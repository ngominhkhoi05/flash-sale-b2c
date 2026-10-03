/**
 * Flash Sale API hooks (React Query)
 * GET /flash-sales/slots, POST /flash-sales/reservations
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, toNumber } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FlashSaleItem {
  id: number;
  slotId: number;
  variantId: number;
  sku: string;
  variantName: string;
  productName: string;
  imageUrl: string;
  originalPrice: number;
  flashSalePrice: number;
  allocatedStock: number;
  availableStock: number;
  userPurchaseLimit: number;
  status: string;
}

export interface FlashSaleSlot {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  reservationTtlSeconds: number;
  status: "UPCOMING" | "ACTIVE" | "ENDED";
  items: FlashSaleItem[];
}

export interface CreateReservationRequest {
  flashSaleItemId: number;
  addressId: number;
  quantity: number;
  idempotencyKey: string;
}

export interface ReservationResponse {
  orderId: number;
  orderCode: string;
  totalAmount: number;
  status: string;
  expiresAt: string;
}

// ── API functions ──────────────────────────────────────────────────────────────

async function getFlashSaleSlotsApi(): Promise<FlashSaleSlot[]> {
  const slots = await apiFetch<FlashSaleSlot[]>("/flash-sales/slots");
  return slots.map((slot) => ({
    ...slot,
    items: slot.items.map((item) => ({
      ...item,
      originalPrice: toNumber(item.originalPrice),
      flashSalePrice: toNumber(item.flashSalePrice),
      allocatedStock: toNumber(item.allocatedStock),
      availableStock: toNumber(item.availableStock),
    })),
  }));
}

async function createReservationApi(data: CreateReservationRequest): Promise<ReservationResponse> {
  return apiFetch<ReservationResponse>("/flash-sales/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useFlashSaleSlots() {
  return useQuery({
    queryKey: ["flash-sales", "slots"],
    queryFn: getFlashSaleSlotsApi,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useCreateReservation() {
  return useMutation({
    mutationFn: (data: CreateReservationRequest) => createReservationApi(data),
  });
}
