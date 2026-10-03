"use client";

import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FlashSaleCountdown } from "@/components/storefront/FlashSaleCountdown";
import { Zap, ChevronRight, Store, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import Link from "next/link";
import { useCategories, useProducts, usePlatformVouchers, useFlashSaleSlots } from "@/lib/api";
import { useActiveSlotsRealtime } from "@/lib/realtime/flashsale-ws";
import { useState } from "react";
import type { ProductSummary } from "@/types";

const MOCK_FALLBACK_PRODUCTS: ProductSummary[] = [
  {
    id: 0, storeId: 0, storeName: "", categoryId: 0, categoryName: "",
    name: "Tai nghe Bluetooth VibeSound Pro Active Noise Cancelling",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    minPrice: 790000, maxPrice: 1450000, totalStock: 200, status: "ACTIVE", createdAt: "",
  },
  {
    id: 0, storeId: 0, storeName: "", categoryId: 0, categoryName: "",
    name: "Nồi chiên không dầu VibeCook 5.5L",
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
    minPrice: 999000, maxPrice: 1890000, totalStock: 100, status: "ACTIVE", createdAt: "",
  },
  {
    id: 0, storeId: 0, storeName: "", categoryId: 0, categoryName: "",
    name: "Bình giữ nhiệt Inox 304 750ml",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    minPrice: 199000, maxPrice: 420000, totalStock: 250, status: "ACTIVE", createdAt: "",
  },
  {
    id: 0, storeId: 0, storeName: "", categoryId: 0, categoryName: "",
    name: "Đồng hồ thông minh VibeFit Active AMOLED",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    minPrice: 509000, maxPrice: 1190000, totalStock: 150, status: "ACTIVE", createdAt: "",
  },
  {
    id: 0, storeId: 0, storeName: "", categoryId: 0, categoryName: "",
    name: "Giày thể thao VibeRunner Unisex",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    minPrice: 465000, maxPrice: 890000, totalStock: 200, status: "ACTIVE", createdAt: "",
  },
];

export default function StorefrontHomePage() {
  const { data: slots } = useFlashSaleSlots();
  const { data: categories } = useCategories();
  const { data: productsData } = useProducts({ page: 0, size: 10 });
  const { data: vouchers } = usePlatformVouchers();

  // Active slot (Flash Sale đang diễn ra)
  const activeSlot = slots?.find((s) => s.status === "ACTIVE") ?? null;
  const activeSlotItems = activeSlot?.items.slice(0, 6) ?? [];

  // State cho realtime stock của items trong slot active
  const [realtimeItems, setRealtimeItems] = useState<
    Map<number, { availableStock: number }>
  >(new Map());

  useActiveSlotsRealtime(
    activeSlot ? [activeSlot.id] : [],
    (event) => {
      if (
        event.eventType === "STOCK_DECREMENTED" ||
        event.eventType === "STOCK_RESTORED"
      ) {
        if (event.flashSaleItemId !== undefined) {
          setRealtimeItems((prev) => {
            const next = new Map(prev);
            next.set(event.flashSaleItemId!, {
              availableStock: event.availableStock ?? 0,
            });
            return next;
          });
        }
      }
    }
  );

  const getItemWithRealtime = (item: (typeof activeSlotItems)[0]) => {
    const realtime = realtimeItems.get(item.id);
    if (realtime) {
      return { ...item, availableStock: realtime.availableStock };
    }
    return item;
  };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Banner Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Hero Slider */}
          <div className="lg:col-span-2 bg-gradient-to-r from-sky-900 via-teal-800 to-sky-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-sm">
            <div className="space-y-3 max-w-md relative z-10">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                CHƯƠNG TRÌNH KHUYẾN MÃI LỚN
              </span>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white">
                Siêu hội 10.10 – Đón deal đến <span className="text-amber-300">80%</span>
              </h1>
              <p className="text-xs text-sky-100">
                Hàng ngàn sản phẩm công nghệ, thời trang và nhà cửa được giảm giá đặc biệt trong hôm nay.
              </p>
            </div>
            <div className="pt-4 relative z-10">
              <Link
                href="/flash-sales"
                className="inline-flex items-center gap-1.5 bg-white text-sky-900 font-bold text-xs px-5 py-2.5 rounded-full hover:bg-sky-50 transition-colors shadow-md"
              >
                Khám phá ngay <ChevronRight className="w-4 h-4 text-sky-700" />
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
              alt="Headphones"
              className="absolute right-4 bottom-4 w-48 h-48 object-cover rounded-xl opacity-80 pointer-events-none hidden sm:block border border-white/20"
            />
          </div>

          {/* Sub Side Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="bg-emerald-100/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Ưu đãi vận chuyển</span>
                <h3 className="font-extrabold text-sm text-emerald-950 mt-0.5">Freeship Đơn 0Đ</h3>
                <p className="text-[11px] text-emerald-800 mt-0.5">Miễn phí ship cho tất cả đơn hàng</p>
                <button className="mt-2 text-[10px] font-bold bg-emerald-700 text-white px-3 py-1 rounded-md hover:bg-emerald-800">
                  Lấy mã
                </button>
              </div>
            </div>

            <div className="bg-rose-100/70 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-700 uppercase">Voucher hot</span>
                <h3 className="font-extrabold text-sm text-rose-950 mt-0.5">Voucher 100K</h3>
                <p className="text-[11px] text-rose-800 mt-0.5">Giảm ngay 100K cho đơn từ 500K</p>
                <button className="mt-2 text-[10px] font-bold bg-rose-600 text-white px-3 py-1 rounded-md hover:bg-rose-700">
                  Săn voucher
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Circle Categories Bar */}
        <section className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            {[
              { label: "Voucher hời", bg: "bg-rose-100 text-rose-600", icon: "🎟️" },
              { label: "Hàng hiệu -50%", bg: "bg-amber-100 text-amber-700", icon: "🏷️" },
              { label: "Hàng quốc tế", bg: "bg-sky-100 text-sky-600", icon: "🌐" },
              { label: "Giao nhanh 2h", bg: "bg-emerald-100 text-emerald-600", icon: "⚡" },
              { label: "Hàng mới về", bg: "bg-purple-100 text-purple-600", icon: "✨" },
              { label: "Nạp thẻ - Dịch vụ", bg: "bg-blue-100 text-blue-600", icon: "📱" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center text-xl shadow-2xs group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-medium text-gray-700 group-hover:text-sky-600 transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Category Icons Grid */}
        <section className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Danh mục nổi bật</h2>
            <Link href="#" className="text-[11px] font-semibold text-sky-600 hover:underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
            {(categories ?? []).slice(0, 16).map((cat) => (
              <div key={cat.id} className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                  {cat.name[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="text-[10px] text-gray-600 font-medium line-clamp-1">{cat.name}</span>
              </div>
            ))}
            {(!categories || categories.length === 0) &&
              ["Thời trang nam", "Thời trang nữ", "Điện thoại", "Máy tính", "Thiết bị điện tử", "Nhà cửa", "Sắc đẹp", "Sức khỏe",
               "Thể thao", "Sách báo", "Đồ chơi", "Đồng hồ", "Giày dép", "Túi xách", "Trang sức", "Phụ kiện"].map((cat, i) => (
                <div key={i} className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {cat[0]}
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium line-clamp-1">{cat}</span>
                </div>
              ))
            }
          </div>
        </section>

        {/* Flash Sale Section */}
        {activeSlot && activeSlotItems.length > 0 && (
        <section className="bg-white rounded-2xl p-4 border border-gray-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-rose-600 font-black text-lg flex items-center gap-1 uppercase tracking-tight">
                ⚡ FLASH SALE
              </span>
              <FlashSaleCountdown endTime={activeSlot.endTime} />
            </div>
            <Link href="/flash-sales" className="text-xs font-bold text-rose-600 hover:underline">
              Xem tất cả &gt;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {activeSlotItems.map((item) => (
              <ProductCard
                key={item.id}
                product={getItemWithRealtime(item)}
                slotId={activeSlot.id}
              />
            ))}
          </div>
        </section>
        )}

        {/* Voucher Cards */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Mã giảm giá cho bạn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(vouchers ?? []).slice(0, 4).map((v) => (
              <div key={v.id} className="bg-sky-700 text-white rounded-xl p-3 flex justify-between items-center shadow-2xs">
                <div>
                  <span className="font-extrabold text-sm block">
                    {v.discountType === "PERCENT"
                      ? `Giảm ${v.discountValue}%`
                      : `Giảm ${v.discountValue.toLocaleString("vi-VN")}K`}
                  </span>
                  <span className="text-[10px] opacity-80">
                    {v.minOrderAmount ? `Cho đơn từ ${v.minOrderAmount.toLocaleString("vi-VN")}đ` : "Không giới hạn"}
                    {v.maxDiscountAmount ? ` - Tối đa ${v.maxDiscountAmount.toLocaleString("vi-VN")}đ` : ""}
                  </span>
                  <span className="text-[10px] block opacity-60 mt-0.5">Mã: {v.code}</span>
                </div>
                <button className="bg-white text-gray-900 font-bold text-[10px] px-3 py-1 rounded-md hover:bg-gray-100">
                  Lưu mã
                </button>
              </div>
            ))}
            {(!vouchers || vouchers.length === 0) &&
              [
                { label: "Giảm 100K", desc: "Cho đơn từ 500K", code: "VIBE100K", bg: "bg-sky-700 text-white" },
                { label: "Giảm 15%", desc: "Cho đơn từ 200K", code: "VIBE15", bg: "bg-emerald-700 text-white" },
                { label: "Freeship 30K", desc: "Đơn bất kỳ", code: "FREESHIP30", bg: "bg-teal-700 text-white" },
                { label: "Giảm 50%", desc: "Khách hàng mới", code: "WELCOME50", bg: "bg-rose-700 text-white" },
              ].map((v, i) => (
                <div key={i} className={`${v.bg} rounded-xl p-3 flex justify-between items-center shadow-2xs`}>
                  <div>
                    <span className="font-extrabold text-sm block">{v.label}</span>
                    <span className="text-[10px] opacity-80">{v.desc}</span>
                  </div>
                  <button className="bg-white text-gray-900 font-bold text-[10px] px-3 py-1 rounded-md hover:bg-gray-100">
                    Lưu mã
                  </button>
                </div>
              ))
            }
          </div>
        </section>

        {/* Product Grid For You */}
        <section className="bg-white rounded-2xl p-4 border border-gray-200 space-y-4">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase">Gợi Ý Hôm Nay</h2>
            <div className="flex items-center gap-2">
              <button className="bg-sky-700 text-white font-bold text-xs px-3 py-1 rounded-full">Tất cả sản phẩm</button>
              <button className="bg-slate-100 text-gray-600 font-medium text-xs px-3 py-1 rounded-full hover:bg-slate-200">Bán chạy</button>
              <button className="bg-slate-100 text-gray-600 font-medium text-xs px-3 py-1 rounded-full hover:bg-slate-200">Giá giảm sâu</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(productsData?.items ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {/* Fallback nếu API chưa có data */}
            {(!productsData || productsData.items.length === 0) &&
              MOCK_FALLBACK_PRODUCTS.map((p, idx) => (
                <ProductCard key={`mock-${idx}`} product={p} />
              ))
            }
          </div>

          <div className="text-center pt-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs px-6 py-2 rounded-full transition-colors">
              Xem thêm sản phẩm ↓
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
