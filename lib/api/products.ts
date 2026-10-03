/**
 * Product API hooks (React Query)
 * GET /products, GET /products/{id}
 */
import { useQuery } from "@tanstack/react-query";
import { apiFetch, toNumber } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductSummary {
  id: number;
  storeId: number;
  storeName: string;
  categoryId: number;
  categoryName: string;
  name: string;
  imageUrl: string;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  status: string;
  createdAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  variantName: string;
  attributes?: Record<string, string>;
  originalPrice: number;
  stockQuantity: number;
  imageUrl?: string;
  status: string;
  version: number;
  createdAt: string;
}

export interface ProductDetail {
  id: number;
  storeId: number;
  storeName: string;
  categoryId: number;
  categoryName: string;
  name: string;
  imageUrl: string;
  description?: string;
  tierVariationConfigs?: unknown[];
  status: string;
  createdAt: string;
  variants: ProductVariant[];
}

export interface ProductFilter {
  categoryId?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ── API functions ──────────────────────────────────────────────────────────────

function buildProductsUrl(filter: ProductFilter): string {
  const params = new URLSearchParams();
  if (filter.categoryId !== undefined) params.set("categoryId", String(filter.categoryId));
  if (filter.keyword) params.set("keyword", filter.keyword);
  if (filter.minPrice !== undefined) params.set("minPrice", String(filter.minPrice));
  if (filter.maxPrice !== undefined) params.set("maxPrice", String(filter.maxPrice));
  if (filter.page !== undefined) params.set("page", String(filter.page));
  if (filter.size !== undefined) params.set("size", String(filter.size));
  const qs = params.toString();
  return "/products" + (qs ? "?" + qs : "");
}

async function getProductsApi(filter: ProductFilter = {}): Promise<PageResponse<ProductSummary>> {
  const data = await apiFetch<PageResponse<ProductSummary>>(buildProductsUrl(filter));
  return {
    ...data,
    items: data.items.map((p) => ({
      ...p,
      minPrice: toNumber(p.minPrice),
      maxPrice: toNumber(p.maxPrice),
    })),
  };
}

async function getProductDetailApi(id: number): Promise<ProductDetail> {
  return apiFetch<ProductDetail>("/products/" + id);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useProducts(filter: ProductFilter = {}) {
  return useQuery({
    queryKey: ["products", filter],
    queryFn: () => getProductsApi(filter),
    staleTime: 30_000,
  });
}

export function useProductDetail(id: number | null) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => getProductDetailApi(id!),
    enabled: id !== null,
    staleTime: 60_000,
  });
}
