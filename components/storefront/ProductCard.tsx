"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap } from "lucide-react";
import { FlashSaleItem, ProductSummary } from "@/types";
import { useItemRealtime } from "@/lib/realtime/flashsale-ws";

interface ProductCardProps {
  product: ProductSummary | FlashSaleItem;
  slotId?: number;
}

// Normalize ProductSummary | FlashSaleItem → unified shape
export function normalizeProduct(
  item: ProductSummary | FlashSaleItem,
  slotId?: number
) {
  const isFlashSale = "flashSalePrice" in item;
  const price = isFlashSale ? (item as FlashSaleItem).flashSalePrice : (item as ProductSummary).minPrice;
  const originalPrice = isFlashSale
    ? (item as FlashSaleItem).originalPrice
    : (item as ProductSummary).maxPrice;
  const totalStock = isFlashSale ? (item as FlashSaleItem).allocatedStock : (item as ProductSummary).totalStock;
  const soldCount = isFlashSale
    ? (item as FlashSaleItem).allocatedStock - (item as FlashSaleItem).availableStock
    : 0; // (mock)
  const image = isFlashSale ? (item as FlashSaleItem).imageUrl : (item as ProductSummary).imageUrl;
  const productId = (item as ProductSummary).id;
  const itemId = isFlashSale ? (item as FlashSaleItem).id : null;
  const name = isFlashSale ? (item as FlashSaleItem).productName : (item as ProductSummary).name;
  const discount = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0;

  return {
    price,
    originalPrice,
    totalStock,
    soldCount,
    image,
    isFlashSale,
    productId,
    itemId,
    name,
    discount,
    slotId: isFlashSale ? (item as FlashSaleItem).slotId : slotId,
  };
}

export function ProductCard({ product, slotId }: ProductCardProps) {
  const normalized = normalizeProduct(product, slotId);
  const { price, originalPrice, totalStock, soldCount, image, isFlashSale, productId, itemId, name, discount } =
    normalized;

  // Real-time stock update via WebSocket
  const [availableStock, setAvailableStock] = useState(
    isFlashSale ? (product as FlashSaleItem).availableStock : totalStock
  );

  useItemRealtime(itemId, (stock) => {
    setAvailableStock(stock);
  });

  const currentSold = isFlashSale ? totalStock - availableStock : soldCount;
  const percentageSold = totalStock > 0 ? Math.min(100, Math.round((currentSold / totalStock) * 100)) : 0;
  const isOutOfStock = availableStock <= 0;

  // Convert productId to string for Link
  const idStr = String(productId);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-200 relative group">
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1 uppercase tracking-wider">
          <Zap className="w-3 h-3 fill-current" /> FLASH SALE
        </span>
        <span className="bg-rose-50 text-rose-600 font-extrabold text-[10px] px-1.5 py-0.5 rounded-xs border border-rose-200">
          -{discount}%
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-2">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
            Đã hết hàng
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-gray-800 text-xs line-clamp-2 min-h-[32px] mb-2 hover:text-rose-600 transition-colors">
        {name}
      </h3>

      {/* Price */}
      <div className="mt-auto space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-rose-600">
            {price.toLocaleString("vi-VN")}đ
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {originalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative">
            <div
              className="bg-rose-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentageSold}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-rose-600 font-semibold text-center">
            🔥 {isOutOfStock ? "Đã bán hết" : `Đã bán ${percentageSold}% - Chỉ còn ${availableStock} sản phẩm`}
          </div>
        </div>

        {/* Action Button */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 font-bold text-xs py-2 rounded-lg cursor-not-allowed text-center"
          >
            Đã hết hàng
          </button>
        ) : (
          <Link
            href={`/flash-sales/${idStr}`}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            {isFlashSale ? "Mua ngay" : "Mua ngay (mock)"}
          </Link>
        )}
      </div>
    </div>
  );
}
