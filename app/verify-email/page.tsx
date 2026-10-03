"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "bạn";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-4 rounded-3xl bg-rose-50 text-rose-600 mb-4 border border-rose-100 shadow-sm animate-bounce">
          <MailCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Kiểm tra hòm thư Email
        </h2>
        <p className="mt-2 text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
          Chúng tôi đã gửi một liên kết xác thực/đặt lại mật khẩu đến email: <br />
          <strong className="text-gray-900 font-bold">{email}</strong>. Vui lòng kiểm tra kỹ cả thư mục Spams/Thư rác.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 border border-gray-100 sm:rounded-3xl sm:px-10 space-y-4">
          <Link
            href="/reset-password"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all text-sm flex items-center justify-center gap-2 text-center"
          >
            MỞ TRANG ĐẶT LẠI MẬT KHẨU (DEMO)
          </Link>

          <button
            onClick={() => alert("Đã gửi lại email xác thực!")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Gửi lại email xác thực
          </button>

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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500 text-sm">Đang tải...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
