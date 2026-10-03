import Link from "next/link";
import { Product } from "@/types";
import { Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const percentageSold = Math.min(
    100,
    Math.round((product.soldCount / product.totalStock) * 100)
  );
  const isOutOfStock = product.soldCount >= product.totalStock;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-200 relative group">
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1 uppercase tracking-wider">
          <Zap className="w-3 h-3 fill-current" /> FLASH SALE
        </span>
        <span className="bg-rose-50 text-rose-600 font-extrabold text-[10px] px-1.5 py-0.5 rounded-xs border border-rose-200">
          -{product.discountPercentage}%
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-2">
        <img
          src={product.image}
          alt={product.name}
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
        {product.name}
      </h3>

      {/* Price */}
      <div className="mt-auto space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-rose-600">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {product.originalPrice.toLocaleString("vi-VN")}đ
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
            🔥 {isOutOfStock ? "Đã bán hết" : `Đã bán ${percentageSold}% - Chỉ còn ${product.totalStock - product.soldCount} sản phẩm`}
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
            href={`/flash-sales/${product.id}`}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Mua ngay
          </Link>
        )}
      </div>
    </div>
  );
}
