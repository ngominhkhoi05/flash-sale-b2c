"use client";

import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FlashSaleCountdown } from "@/components/storefront/FlashSaleCountdown";
import { useState } from "react";
import { Zap, ShieldCheck, Bell } from "lucide-react";
import { useFlashSaleSlots } from "@/lib/api/flashsales";
import { useSlotRealtime } from "@/lib/realtime/flashsale-ws";
import type { FlashSaleSlot, FlashSaleItem, ProductSummary } from "@/types";

// Mock upcoming products (khong co API)
const UPCOMING_PRODUCTS: (ProductSummary & { isFlashSale?: boolean })[] = [
  {
    id: -1, storeId: 0, storeName: "", categoryId: 0, categoryName: "Home",
    name: "May pha ca phe Espresso cam tay du lich VibeBarista",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80",
    minPrice: 510000, maxPrice: 950000, totalStock: 100, status: "INACTIVE", createdAt: "",
    isFlashSale: false,
  },
  {
    id: -2, storeId: 0, storeName: "", categoryId: 0, categoryName: "Home",
    name: "Goi cao su cong luc hoc dinh hinh chong moi vai gay",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    minPrice: 330000, maxPrice: 650000, totalStock: 150, status: "INACTIVE", createdAt: "",
    isFlashSale: false,
  },
  {
    id: -3, storeId: 0, storeName: "", categoryId: 0, categoryName: "Electronics",
    name: "Camera an ninh chong nuoc 3K AI quay 360 dam thoai",
    imageUrl: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80",
    minPrice: 399000, maxPrice: 790000, totalStock: 80, status: "INACTIVE", createdAt: "",
    isFlashSale: false,
  },
];

export default function FlashSalePage() {
  const { data: slots } = useFlashSaleSlots();

  const getDefaultSlot = (): FlashSaleSlot | null => {
    if (!slots || slots.length === 0) return null;
    const active = slots.find((s) => s.status === "ACTIVE");
    if (active) return active;
    return slots.find((s) => s.status === "UPCOMING") ?? slots[0];
  };

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(() => getDefaultSlot()?.id ?? null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [localItems, setLocalItems] = useState<Map<number, FlashSaleItem>>(new Map());

  const selectedSlot = slots?.find((s) => s.id === selectedSlotId) ?? getDefaultSlot() ?? null;

  useSlotRealtime(selectedSlot?.id ?? null, (event) => {
    if (
      (event.eventType === "STOCK_DECREMENTED" || event.eventType === "STOCK_RESTORED") &&
      event.flashSaleItemId !== undefined &&
      event.availableStock !== undefined
    ) {
      setLocalItems((prev) => {
        const next = new Map(prev);
        next.set(event.flashSaleItemId!, {
          ...(prev.get(event.flashSaleItemId!) ?? {}),
          availableStock: event.availableStock,
        } as FlashSaleItem);
        return next;
      });
    }
  });

  const getItemWithRealtime = (item: FlashSaleItem): FlashSaleItem => {
    return localItems.get(item.id) ?? item;
  };

  const filteredItems = selectedSlot?.items ?? [];
  const upcomingSlot = slots
    ?.filter((s) => s.status === "UPCOMING")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] ?? null;

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 text-white p-3 rounded-xl shadow-md">
              <Zap className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">FLASH SALE HOM NAY</h1>
                {selectedSlot?.status === "ACTIVE" && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Dang dien ra
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Gia soc theo khung gio - So luong co han - Cam ket 100% hoan tien neu san pham hong
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Cam ket chinh hang - Doi tra 7 ngay mien phi
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(slots ?? []).map((slot) => {
            const isActive = selectedSlotId === slot.id;
            const label = slot.status === "ACTIVE" ? "DANG DIEN RA" : slot.status === "UPCOMING" ? "Sap dien ra" : "Vua ket thuc";
            return (
              <button
                key={slot.id}
                onClick={() => { setSelectedSlotId(slot.id); setLocalItems(new Map()); }}
                className={
                  "p-3 rounded-xl text-center border transition-all flex flex-col items-center justify-center " +
                  (isActive ? "bg-rose-600 text-white border-rose-600 font-bold shadow-md" : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50")
                }
              >
                <span className="text-base font-black">{formatTime(slot.startTime)}</span>
                <span className={
                  "text-[10px] uppercase font-bold mt-0.5 " +
                  (isActive ? "text-amber-200" : "text-gray-400")
                }>{label}</span>
              </button>
            );
          })}
          {(!slots || slots.length === 0) &&
            ["09:00", "12:00", "15:00", "18:00", "21:00"].map((time) => (
              <button key={time} className="p-3 rounded-xl text-center border bg-white text-gray-700 border-gray-200">
                <span className="text-base font-black">{time}</span>
                <span className="text-[10px] uppercase font-bold mt-0.5 text-gray-400">Sap dien ra (mock)</span>
              </button>
            ))
          }
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FlashSaleCountdown endTime={selectedSlot?.endTime} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold no-scrollbar">
            {[
              { id: "ALL", label: "Tat ca" },
              { id: "Fashion", label: "Thoi trang" },
              { id: "Electronics", label: "Dien tu - CN" },
              { id: "Home", label: "Gia dung" },
              { id: "Beauty", label: "Suc khoe" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={
                  "px-3 py-1.5 rounded-full border transition-all whitespace-nowrap " +
                  (selectedCategory === cat.id ? "bg-sky-700 text-white border-sky-700 font-bold" : "bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100")
                }
              >
                {cat.label} {cat.id !== "ALL" && <span className="text-[9px] opacity-60">(mock)</span>}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-1.5">
              <span className="text-rose-600">📍</span> Deal Dang Mo Ban Soi Noi
            </h2>
            <span className="text-xs text-gray-400">Hien thi {filteredItems.length} san pham</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ProductCard key={item.id} product={getItemWithRealtime(item)} slotId={selectedSlot?.id} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 text-sm py-8">
                {selectedSlot ? "Phien nay chua co san pham nao." : "Khong co du lieu Flash Sale. Vui long quay lai sau."}
              </p>
            )}
          </div>
        </section>

        <section className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">SAP DIEN RA</span>
              <h2 className="text-sm font-bold text-gray-900">
                {upcomingSlot
                  ? "Khung Gio Ke Tiep - " + formatTime(upcomingSlot.startTime) + " Hom Nay"
                  : "Khung Gio Ke Tiep - 15:00 Hom Nay (mock)"}
              </h2>
            </div>
            {upcomingSlot && <FlashSaleCountdown endTime={upcomingSlot.startTime} />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcomingSlot && upcomingSlot.items.length > 0 ? (
              upcomingSlot.items.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 items-center">
                  <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">{item.productName}</h4>
                    <div className="text-rose-600 font-bold text-sm">
                      {item.flashSalePrice.toLocaleString("vi-VN")}d
                      <span className="text-[10px] text-gray-400 line-through font-normal ml-1">{item.originalPrice.toLocaleString("vi-VN")}d</span>
                    </div>
                    <button onClick={() => alert("Da dat nhac nho cho san pham nay!")} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold text-[11px] py-1 rounded-md transition-colors flex items-center justify-center gap-1">
                      <Bell className="w-3 h-3" /> Nhac toi
                    </button>
                  </div>
                </div>
              ))
            ) : (
              UPCOMING_PRODUCTS.map((up) => (
                <div key={up.id} className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 items-center">
                  <img src={up.imageUrl} alt={up.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">{up.name}</h4>
                    <div className="text-rose-600 font-bold text-sm">
                      {up.minPrice.toLocaleString("vi-VN")}d
                      <span className="text-[10px] text-gray-400 line-through font-normal ml-1">{up.maxPrice.toLocaleString("vi-VN")}d</span>
                    </div>
                    <button onClick={() => alert("Da dat nhac nho cho san pham nay!")} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold text-[11px] py-1 rounded-md transition-colors flex items-center justify-center gap-1">
                      <Bell className="w-3 h-3" /> Nhac toi
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
