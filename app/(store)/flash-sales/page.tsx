"use client";

import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FlashSaleCountdown } from "@/components/storefront/FlashSaleCountdown";
import { useState } from "react";
import { Zap, ShieldCheck, Bell } from "lucide-react";
import { Product } from "@/types";

const MOCK_FLASH_SALE_PRODUCTS: Product[] = [
  {
    id: "fs-1",
    name: "Tai nghe Bluetooth không dây VibeSound Pro Active Noise Cancelling",
    price: 790000,
    originalPrice: 1450000,
    discountPercentage: 45,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    soldCount: 170,
    totalStock: 200,
    category: "Electronics",
    isFlashSale: true,
  },
  {
    id: "fs-2",
    name: "Nồi chiên không dầu điện tử VibeCook 5.5L 8 chế độ nấu tự động",
    price: 999000,
    originalPrice: 1890000,
    discountPercentage: 47,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    soldCount: 95,
    totalStock: 100,
    category: "Home",
    isFlashSale: true,
  },
  {
    id: "fs-3",
    name: "Bình giữ nhiệt Inox 304 dung tích 750ml giữ nóng lạnh 24H",
    price: 199000,
    originalPrice: 420000,
    discountPercentage: 52,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    soldCount: 220,
    totalStock: 250,
    category: "Home",
    isFlashSale: true,
  },
  {
    id: "fs-4",
    name: "Đồng hồ thông minh thế hệ mới VibeFit Active AMOLED IP68",
    price: 509000,
    originalPrice: 1190000,
    discountPercentage: 57,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    soldCount: 150,
    totalStock: 150,
    category: "Electronics",
    isFlashSale: true,
  },
  {
    id: "fs-5",
    name: "Giày thể thao êm chân nhẹ thoáng khí VibeRunner Unisex",
    price: 465000,
    originalPrice: 890000,
    discountPercentage: 47,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    soldCount: 180,
    totalStock: 200,
    category: "Fashion",
    isFlashSale: true,
  },
  {
    id: "fs-6",
    name: "Bàn phím cơ không dây RGB switch nhận diện cực nhạy",
    price: 690000,
    originalPrice: 1350000,
    discountPercentage: 48,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    soldCount: 88,
    totalStock: 100,
    category: "Electronics",
    isFlashSale: true,
  },
];

const UPCOMING_PRODUCTS: Product[] = [
  {
    id: "up-1",
    name: "Máy pha cà phê Espresso cầm tay du lịch cao cấp VibeBarista",
    price: 510000,
    originalPrice: 950000,
    discountPercentage: 46,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    soldCount: 0,
    totalStock: 100,
    category: "Home",
  },
  {
    id: "up-2",
    name: "Gối cao su công lực học định hình chống mỏi vai gáy",
    price: 330000,
    originalPrice: 650000,
    discountPercentage: 49,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    soldCount: 0,
    totalStock: 150,
    category: "Home",
  },
  {
    id: "up-3",
    name: "Camera an ninh chống nước 3K AI quay 360 đàm thoại",
    price: 399000,
    originalPrice: 790000,
    discountPercentage: 49,
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    soldCount: 0,
    totalStock: 80,
    category: "Electronics",
  },
];

export default function FlashSalePage() {
  const [selectedSlot, setSelectedSlot] = useState("12:00");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Banner Section */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 text-white p-3 rounded-xl shadow-md">
              <Zap className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">FLASH SALE HÔM NAY</h1>
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Đang diễn ra
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Giá sốc theo khung giờ - Số lượng có hạn - Cam kết 100% hoàn tiền nếu sản phẩm hỏng
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Cam kết chính hãng - Đổi trả 7 ngày miễn phí
          </div>
        </div>

        {/* Time Slot Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { time: "09:00", status: "Vừa kết thúc", active: false },
            { time: "12:00", status: "ĐANG DIỄN RA", active: true },
            { time: "15:00", status: "Sắp diễn ra", active: false },
            { time: "18:00", status: "Sắp diễn ra", active: false },
            { time: "21:00", status: "Ngày mai", active: false },
          ].map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedSlot(slot.time)}
              className={`p-3 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${
                selectedSlot === slot.time
                  ? "bg-rose-600 text-white border-rose-600 font-bold shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50"
              }`}
            >
              <span className="text-base font-black">{slot.time}</span>
              <span className={`text-[10px] uppercase font-bold mt-0.5 ${
                selectedSlot === slot.time ? "text-amber-200" : "text-gray-400"
              }`}>
                {slot.status}
              </span>
            </button>
          ))}
        </div>

        {/* Countdown & Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FlashSaleCountdown initialSeconds={4800} />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold no-scrollbar">
            {[
              { id: "ALL", label: "Tất cả" },
              { id: "Fashion", label: "Thời trang" },
              { id: "Electronics", label: "Điện tử - Công nghệ" },
              { id: "Home", label: "Gia dụng & Đời sống" },
              { id: "Beauty", label: "Chăm sóc & Sức khỏe" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-sky-700 text-white border-sky-700 font-bold"
                    : "bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Product Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-1.5">
              <span className="text-rose-600">📍</span> Deal Đang Mở Bán Sôi Nổi
            </h2>
            <span className="text-xs text-gray-400">Hiển thị 12 sản phẩm</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MOCK_FLASH_SALE_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Upcoming Time Slot */}
        <section className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                SẮP DIỄN RA
              </span>
              <h2 className="text-sm font-bold text-gray-900">
                Khung Giờ Kế Tiếp – 15:00 Hôm Nay
              </h2>
            </div>
            <span className="text-xs text-sky-700">Mở bán sau 2h 15m</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING_PRODUCTS.map((up) => (
              <div key={up.id} className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 items-center">
                <img src={up.image} alt={up.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">{up.name}</h4>
                  <div className="text-rose-600 font-bold text-sm">
                    {up.price.toLocaleString("vi-VN")}đ
                    <span className="text-[10px] text-gray-400 line-through font-normal ml-1">
                      {up.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <button
                    onClick={() => alert("Đã đặt nhắc nhở cho sản phẩm này!")}
                    className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold text-[11px] py-1 rounded-md transition-colors flex items-center justify-center gap-1"
                  >
                    <Bell className="w-3 h-3" /> Nhắc tôi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
