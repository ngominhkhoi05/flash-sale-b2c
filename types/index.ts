export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  rating: number;
  soldCount: number;
  totalStock: number;
  category?: string;
  isFlashSale?: boolean;
}

export interface FlashSaleTimeSlot {
  id: string;
  timeLabel: string;
  status: 'ENDED' | 'IN_PROGRESS' | 'UPCOMING';
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

// ── API Types ─────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface ApiError extends Error {
  code?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  commissionRate: number;
  description?: string;
}

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

export interface FlashSaleSlot {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  reservationTtlSeconds: number;
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED';
  items: FlashSaleItem[];
}

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

export interface Voucher {
  id: number;
  code: string;
  storeId: number | null;
  discountType: 'PERCENT' | 'FIXED_AMOUNT';
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

export interface Address {
  id: number;
  contactName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  status: string;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  status: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

// ── WebSocket Types ────────────────────────────────────────────────────────────

export interface FlashSaleWsEvent {
  eventType:
    | 'STOCK_DECREMENTED'
    | 'STOCK_RESTORED'
    | 'STOCK_RETURNED_UNSOLD'
    | 'SLOT_ACTIVATED'
    | 'SLOT_CLOSED'
    | 'ORDER_RESERVED'
    | 'ORDER_CANCELLED_TIMEOUT';
  slotId?: number;
  flashSaleItemId?: number;
  orderId?: number;
  userId?: number;
  availableStock?: number;
  allocatedStock?: number;
  totalAmount?: number;
  quantity?: number;
  orderCode?: string;
  expiresAt?: string;
  slotStatus?: string;
  restoredQuantity?: number;
  occurredAt: string;
}

export interface FlashSaleWsMessage<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}
