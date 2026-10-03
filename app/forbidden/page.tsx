import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
        <div className="relative inline-block">
          <span className="text-8xl font-black text-rose-100 select-none">403</span>
          <div className="absolute inset-0 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Truy Cập Bị Từ Chối (403)
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Bạn không có quyền truy cập vào khu vực này. Vui lòng đăng nhập bằng tài khoản có quyền truy cập phù hợp.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/login"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all text-sm flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> ĐĂNG NHẬP LẠI
          </Link>
          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
