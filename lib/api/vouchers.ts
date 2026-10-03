/**
 * Voucher API hooks (React Query)
 * GET /vouchers/platform, GET /vouchers/store/{storeId}
 */
import { useQuery } from "@tanstack/react-query";
import { apiFetch, toNumber } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Voucher {
  id: number;
  code: string;
  storeId: number | null;
  discountType: "PERCENT" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  totalQuantity: number;
  usedQuantity: number;
  userUsageLimit?: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

// ── API functions ──────────────────────────────────────────────────────────────

async function getPlatformVouchersApi(): Promise<Voucher[]> {
  const vouchers = await apiFetch<Voucher[]>("/vouchers/platform");
  return vouchers.map((v) => ({
    ...v,
    discountValue: toNumber(v.discountValue),
    minOrderAmount: toNumber(v.minOrderAmount),
    maxDiscountAmount: toNumber(v.maxDiscountAmount),
  }));
}

async function getStoreVouchersApi(storeId: number): Promise<Voucher[]> {
  const vouchers = await apiFetch<Voucher[]>(`/vouchers/store/${storeId}`);
  return vouchers.map((v) => ({
    ...v,
    discountValue: toNumber(v.discountValue),
    minOrderAmount: toNumber(v.minOrderAmount),
    maxDiscountAmount: toNumber(v.maxDiscountAmount),
  }));
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function usePlatformVouchers() {
  return useQuery({
    queryKey: ["vouchers", "platform"],
    queryFn: getPlatformVouchersApi,
    staleTime: 60_000,
  });
}

export function useStoreVouchers(storeId: number | null) {
  return useQuery({
    queryKey: ["vouchers", "store", storeId],
    queryFn: () => getStoreVouchersApi(storeId!),
    enabled: storeId !== null,
    staleTime: 60_000,
  });
}
