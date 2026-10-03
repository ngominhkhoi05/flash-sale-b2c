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
