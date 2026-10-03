"use client";

/**
 * Flash Sale WebSocket Layer
 * Singleton StompClient with topic multiplexing, exponential-backoff reconnect.
 */

import { useEffect, useRef } from "react";
import type { FlashSaleWsEvent } from "@/types";

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_BASE ?? "http://localhost:8080";

type WsCallback = (event: FlashSaleWsEvent) => void;

interface StompFrame {
  body: string;
}

interface StompSubscriptionLike {
  unsubscribe: () => void;
}

interface StompClientLike {
  connected: boolean;
  activate: () => void;
  deactivate: () => void;
  subscribe: (
    topic: string,
    cb: (frame: StompFrame) => void,
  ) => StompSubscriptionLike;
}

export class StompClient {
  private client: StompClientLike | null = null;
  private subscriptions = new Map<string, Set<WsCallback>>();
  private stompSubs = new Map<string, StompSubscriptionLike>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 1000;
  private maxDelay = 10000;
  private shouldReconnect = false;
  private activeTopics = new Set<string>();

  private getToken(): string {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("vibemart.auth");
      if (!raw) return "";
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return parsed.accessToken ?? "";
    } catch {
      return "";
    }
  }

  connect(token?: string): void {
    if (this.client?.connected) return;

    // dynamic require to avoid SSR
    const { Client } = require("@stomp/stompjs") as typeof import("@stomp/stompjs");
    // sockjs-client CJS module: the SockJS class is the module.exports itself
    // Cast through `any` to dodge ESM/CJS interop type quirks across next versions.
    const SockJSAny = require("sockjs-client") as unknown;

    this.shouldReconnect = true;
    const self = this;
    this.client = new Client({
      webSocketFactory: () =>
        new (SockJSAny as new (url: string) => WebSocket)(
          `${WS_BASE}/ws?token=${token ?? self.getToken()}`,
        ),
      reconnectDelay: 0,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        self.reconnectDelay = 1000;
        self.stompSubs.forEach((_, topic) => self.doSubscribe(topic));
      },
      onWebSocketClose: () => {
        if (self.shouldReconnect) {
          self.reconnectTimer = setTimeout(() => {
            self.reconnectDelay = Math.min(
              self.reconnectDelay * 2,
              self.maxDelay,
            );
            self.client?.activate();
          }, self.reconnectDelay);
        }
      },
      onStompError: (frame) => {
        const msg =
          (frame.headers as Record<string, string> | undefined)?.message ??
          "unknown";
        console.error("[WS] STOMP error:", msg);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.client?.deactivate();
    this.client = null;
    this.subscriptions.clear();
    this.stompSubs.clear();
    this.activeTopics.clear();
  }

  private doSubscribe(topic: string): void {
    if (!this.client?.connected) return;
    if (this.stompSubs.has(topic)) return;

    const sub = this.client.subscribe(topic, (payload: StompFrame) => {
      try {
        const raw = JSON.parse(payload.body) as
          | { data?: FlashSaleWsEvent }
          | FlashSaleWsEvent;
        const event: FlashSaleWsEvent =
          (raw as { data?: FlashSaleWsEvent }).data ??
          (raw as FlashSaleWsEvent);
        const cbs = this.subscriptions.get(topic);
        cbs?.forEach((cb) => {
          try {
            cb(event);
          } catch {
            /* ignore */
          }
        });
      } catch (e) {
        console.error("[WS] Failed to parse message", e);
      }
    });
    this.stompSubs.set(topic, sub);
  }

  subscribe(topic: string, callback: WsCallback): () => void {
    this.activeTopics.add(topic);
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(callback);

    if (this.client?.connected) {
      this.doSubscribe(topic);
    } else {
      this.connect();
    }

    return () => {
      this.subscriptions.get(topic)?.delete(callback);
      if (this.subscriptions.get(topic)?.size === 0) {
        this.subscriptions.delete(topic);
        this.activeTopics.delete(topic);
        const stompSub = this.stompSubs.get(topic);
        if (stompSub) {
          stompSub.unsubscribe();
          this.stompSubs.delete(topic);
        }
      }
    };
  }
}

let _instance: StompClient | null = null;

function getClient(): StompClient {
  if (!_instance) {
    _instance = new StompClient();
  }
  return _instance;
}

export function useSlotRealtime(
  slotId: number | null,
  onUpdate: (event: FlashSaleWsEvent) => void,
): void {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (slotId == null) return;
    const topicStock = `/topic/flash-sale/slot/${slotId}/stock-update`;
    const topicStatus = `/topic/flash-sale/slot/${slotId}/status`;

    const unsubStock = getClient().subscribe(topicStock, (event) => {
      onUpdateRef.current(event);
    });
    const unsubStatus = getClient().subscribe(topicStatus, (event) => {
      onUpdateRef.current(event);
    });

    return () => {
      unsubStock();
      unsubStatus();
    };
  }, [slotId]);
}

export function useItemRealtime(
  itemId: number | null,
  onStock: (availableStock: number) => void,
): void {
  const onStockRef = useRef(onStock);
  onStockRef.current = onStock;

  useEffect(() => {
    if (itemId == null) return;
    const topic = `/topic/flash-sale/item/${itemId}/stock`;
    return getClient().subscribe(topic, (event) => {
      if (event.availableStock !== undefined) {
        onStockRef.current(event.availableStock);
      }
    });
  }, [itemId]);
}

export function useActiveSlotsRealtime(
  slotIds: number[],
  onUpdate: (event: FlashSaleWsEvent) => void,
): void {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const key = slotIds.join(",");

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    slotIds.forEach((slotId) => {
      const topicStock = `/topic/flash-sale/slot/${slotId}/stock-update`;
      const topicStatus = `/topic/flash-sale/slot/${slotId}/status`;

      unsubscribers.push(
        getClient().subscribe(topicStock, (event) => {
          onUpdateRef.current(event);
        }),
        getClient().subscribe(topicStatus, (event) => {
          onUpdateRef.current(event);
        }),
      );
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
