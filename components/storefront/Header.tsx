"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Phone, Bell, HelpCircle, LogOut, Package } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { VibeMartLogo } from "@/components/ui/VibeMartLogo";
import { useAuth } from "@/lib/auth/store";
import { useLogout } from "@/lib/api/auth";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-slate-50 border-b border-gray-100 text-[11px] text-gray-500 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-sky-600 transition-colors">Kênh Người Bán</Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-sky-600 transition-colors">Tải Ứng Dụng</Link>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              Kết nối:
              <Link href="#" className="text-blue-600 font-semibold hover:underline">Facebook</Link>,
              <Link href="#" className="text-sky-500 font-semibold hover:underline">Zalo</Link>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-sky-600" />
              Hotline: <strong className="text-gray-700">1900-8888</strong>
            </span>
            <span className="text-gray-300">|</span>
            <Link href="/help" className="flex items-center gap-1 hover:text-sky-600">
              <HelpCircle className="w-3 h-3" /> Trợ giúp
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5 text-gray-700 font-medium">
              <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-4 h-3 rounded-xs object-cover" />
              Tiếng Việt
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <VibeMartLogo size="md" />

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm, thương hiệu hoặc deal hot..."
              className="w-full bg-slate-50 border border-gray-200 rounded-lg py-2 pl-4 pr-12 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 bg-sky-700 hover:bg-sky-800 text-white p-1.5 rounded-md transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-5">
          <Link href="/notifications" className="relative p-1 text-gray-600 hover:text-sky-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>

          <Link href="/cart" className="relative p-1 text-gray-600 hover:text-sky-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>

          <div className="h-6 w-px bg-gray-200"></div>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                className="flex items-center gap-2 text-xs text-gray-700 hover:text-sky-600 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-xs uppercase">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    user.fullName?.[0] ?? <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col text-left max-w-[120px]">
                  <span className="text-[10px] text-gray-400">Xin chào</span>
                  <span className="font-semibold text-gray-900 leading-tight text-xs truncate">
                    {user.fullName || "Tài khoản"}
                  </span>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-slate-50"
                  >
                    <User className="w-3.5 h-3.5" /> Hồ sơ của tôi
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-slate-50"
                  >
                    <Package className="w-3.5 h-3.5" /> Đơn hàng của tôi
                  </Link>
                  <button
                    type="button"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-xs text-gray-700 hover:text-sky-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-gray-900 leading-tight text-xs">Tài khoản</span>
                <span className="text-[10px] text-gray-400">Đăng nhập</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-1.5 text-xs font-semibold">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full transition-colors ${
              pathname === "/" ? "text-gray-900 font-bold" : "text-gray-600 hover:text-sky-600"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/flash-sales"
            className={`px-4 py-1.5 rounded-full font-bold transition-all ${
              pathname.startsWith("/flash-sales")
                ? "bg-sky-700 text-white shadow-sm"
                : "text-sky-700 bg-sky-50 hover:bg-sky-100"
            }`}
          >
            ⚡ Flash Sale
          </Link>
          <Link href="/#new" className="px-4 py-1.5 text-gray-600 hover:text-sky-600 transition-colors">
            Hàng mới về
          </Link>
          <Link href="/#brands" className="px-4 py-1.5 text-gray-600 hover:text-sky-600 transition-colors">
            Thương hiệu nổi bật
          </Link>
          <Link href="/#bestsellers" className="px-4 py-1.5 text-gray-600 hover:text-sky-600 transition-colors">
            Bán chạy
          </Link>
          <Link href="/#vouchers" className="px-4 py-1.5 text-gray-600 hover:text-sky-600 transition-colors">
            Voucher & Mã giảm giá
          </Link>
        </div>
      </nav>
    </header>
  );
}
