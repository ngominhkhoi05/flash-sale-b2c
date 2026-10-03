import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100 shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Đổi mật khẩu thành công!
        </h2>
        <p className="mt-2 text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
          Mật khẩu tài khoản Vibe Mart của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại bằng mật khẩu mới.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 border border-gray-100 sm:rounded-3xl sm:px-10">
          <Link
            href="/login"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all text-sm flex items-center justify-center gap-2"
          >
            ĐĂNG NHẬP NGAY <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
