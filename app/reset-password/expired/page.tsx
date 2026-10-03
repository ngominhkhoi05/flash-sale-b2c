import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function ResetPasswordExpiredPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-4 rounded-3xl bg-amber-50 text-amber-600 mb-4 border border-amber-100 shadow-sm">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Liên kết đã hết hạn
        </h2>
        <p className="mt-2 text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
          Liên kết đặt lại mật khẩu này đã quá thời gian hiệu lực (15 phút) hoặc đã được sử dụng trước đó.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 border border-gray-100 sm:rounded-3xl sm:px-10 space-y-4">
          <Link
            href="/forgot-password"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> YÊU CẦU GỬI LẠI LIÊN KẾT MỚI
          </Link>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
