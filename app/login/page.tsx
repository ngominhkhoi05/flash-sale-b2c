"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Zap, Package, CreditCard, ShoppingBag, Gift, AlertCircle } from "lucide-react";
import { VibeMartLogo } from "@/components/ui/VibeMartLogo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("nguyen.van.an@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [rememberMe, setRememberMe] = useState(true);
  const [hasError, setHasError] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    alert(`Đăng nhập thành công với tài khoản: ${email}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between font-sans text-gray-800">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <VibeMartLogo height={28} />
          <span className="text-gray-300">|</span>
          <span className="text-xs font-semibold text-gray-500">Xác thực tài khoản</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
          <Link href="/help" className="hover:text-sky-600">Trợ giúp</Link>
          <Link href="/" className="hover:text-sky-600">Về trang chủ</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
          
          {/* Left Panel: Marketing Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-teal-50/50 p-8 sm:p-10 rounded-3xl border border-blue-100/80 flex flex-col justify-between relative overflow-hidden shadow-2xs">
            <div className="space-y-6 relative z-10">
              <VibeMartLogo height={28} />

              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Mua sắm dễ dàng, <br />
                  săn deal mỗi ngày
                </h1>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed max-w-md">
                  Nền tảng thương mại điện tử đồng hành cùng trải nghiệm mua sắm hiện đại, an tâm tuyệt đối với hàng triệu ưu đãi độc quyền.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="space-y-3 pt-2">
                <div className="bg-white p-3.5 rounded-2xl border border-blue-50 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">Hàng nghìn gian hàng uy tín</h4>
                    <p className="text-[11px] text-gray-500">Sản phẩm chính hãng 100% được chứng thực</p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-blue-50 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">Flash Sale giá sốc mỗi khung giờ</h4>
                      <p className="text-[11px] text-gray-500">Voucher hoàn tiền đến 50% hàng tuần</p>
                    </div>
                  </div>
                  <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    HOT DEAL
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-blue-50 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">Thanh toán ZaloPay hoặc COD</h4>
                    <p className="text-[11px] text-gray-500">Bảo mật chuẩn PCI DSS và nhận hàng thanh toán linh hoạt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Graphic Illustration */}
            <div className="pt-8 flex items-end gap-3 relative z-10">
              <div className="w-16 h-16 bg-sky-700 rounded-2xl flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="w-14 h-14 bg-teal-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-md">
                <Gift className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Right Panel: Login Form Card */}
          <div className="lg:col-span-6 flex items-center">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xl shadow-gray-200/40 w-full space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Đăng nhập</h2>
                <p className="text-xs text-gray-500 mt-1">Chào mừng bạn quay lại</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email hoặc Số điện thoại
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nguyen.van.an@gmail.com"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="12345678"
                      className={`w-full bg-white border ${
                        hasError ? "border-rose-500" : "border-gray-300"
                      } rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-sky-600 transition-all pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {hasError && (
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Email hoặc mật khẩu chưa đúng</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-sky-700 focus:ring-sky-600"
                    />
                    <span className="text-xs text-gray-600 font-medium">Ghi nhớ đăng nhập</span>
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-sky-700 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider"
                >
                  Đăng nhập
                </button>
              </form>

              <div className="space-y-4 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="bg-white px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider absolute">
                    Hoặc tiếp tục với
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button type="button" className="border border-gray-200 hover:bg-slate-50 py-2 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center transition-colors">
                    <span className="text-rose-500 font-black">G</span>
                  </button>
                  <button type="button" className="border border-gray-200 hover:bg-slate-50 py-2 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center transition-colors">
                    <span className="text-blue-600 font-black">f</span>
                  </button>
                  <button type="button" className="border border-gray-200 hover:bg-slate-50 py-2 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center transition-colors">
                    <span className="text-gray-900 font-black">🐱</span>
                  </button>
                </div>

                <div className="text-center text-xs text-gray-600 pt-2">
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="font-bold text-sky-700 hover:underline">
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 px-6 text-[11px] text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Vibe Mart. Tất cả các quyền được bảo lưu.</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Điều khoản dịch vụ</Link>
            <span>•</span>
            <Link href="#" className="hover:underline">Chính sách bảo mật</Link>
            <span>•</span>
            <Link href="#" className="hover:underline">Liên hệ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
