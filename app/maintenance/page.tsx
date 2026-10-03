import Link from "next/link";
import { Wrench, Home, Zap, Clock } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
        <div className="inline-flex p-5 rounded-3xl bg-amber-50 text-amber-500 border border-amber-100 shadow-sm animate-pulse">
          <Wrench className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            NÂNG CẤP HỆ THỐNG
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Hệ Thống Đang Bảo Trì
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
            Tính năng Flash Sale Vibe Mart đang được tối ưu hóa server để đảm bảo tốc độ giật deal mượt mà nhất. Vui lòng quay lại sau!
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Dự kiến hoàn thành: <strong className="text-gray-900">15:30 Hôm nay</strong></span>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> VỀ TRANG CHỦ
          </Link>
        </div>
      </div>
    </div>
  );
}
