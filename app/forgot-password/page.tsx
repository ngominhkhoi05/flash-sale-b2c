"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, RefreshCw, AlertCircle, Info, Lock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("nguyen.van.an@gmail.com");
  const [hasError, setHasError] = useState(true);
  const router = useRouter();

  // (mock) - Backend chưa có endpoint /auth/forgot-password
  // Khi backend có endpoint thì thay thế bằng useForgotPassword() mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between font-sans text-gray-800">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 font-black text-xl tracking-tight">
            <span className="text-sky-500 flex items-center gap-1">
              <svg className="w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Vibe
            </span>
            <span className="text-slate-900">Mart</span>
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-xs font-semibold text-gray-500">Xác thực tài khoản</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
          <Link href="/help" className="hover:text-sky-600">Trợ giúp</Link>
          <Link href="/" className="hover:text-sky-600">Về trang chủ</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xl shadow-gray-200/40 w-full space-y-6">
          
          {/* Card Top Nav */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <Link href="/login" className="flex items-center gap-1 hover:text-sky-700 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Quay lại đăng nhập
            </Link>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Bước 1/3</span>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quên mật khẩu?</h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nguyen.van.an@gmail.com"
                  className={`w-full bg-white border ${
                    hasError ? "border-rose-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-sky-600 transition-all pr-10`}
                />
                {hasError && (
                  <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {hasError && (
                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium pt-1">
                  <span>▲ Email chưa được đăng ký trên Vibe Mart</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Gửi liên kết đặt lại
            </button>
          </form>

          {/* Info Notice Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-gray-600">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              Tài khoản đăng nhập bằng Google, Facebook hoặc GitHub không cần mật khẩu.
            </span>
          </div>

          {/* Security details */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium pt-1 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> Bảo mật 256-bit SSL
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Phản hồi tức thì
            </span>
          </div>

          <div className="text-center text-xs text-gray-500 pt-1">
            Gặp khó khăn khi nhận mã?{" "}
            <Link href="#" className="font-bold text-sky-700 hover:underline">
              Liên hệ chuyên viên
            </Link>
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
