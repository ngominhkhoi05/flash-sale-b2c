import Link from "next/link";
import { Search, Home, ArrowLeft, Headphones, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50 flex flex-col justify-between items-center py-12 px-4 font-sans text-gray-800">
      
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center items-center text-center my-auto space-y-6 relative">
        
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100/70 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-sky-800 shadow-2xs">
          <span className="text-sky-600 font-extrabold">🛍️ VIBE MART</span>
          <span>•</span>
          <span className="text-sky-700">LỖI 404</span>
        </div>

        {/* 404 Graphic Illustration */}
        <div className="relative flex items-center justify-center py-4">
          <span className="text-9xl font-black text-sky-100/80 tracking-widest select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-sky-600 shadow-xl flex items-center justify-center text-sky-600">
              <Search className="w-12 h-12 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Không tìm thấy trang
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Trang bạn tìm có thể đã bị xóa hoặc đổi địa chỉ.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Về trang chủ
          </Link>
          <Link
            href="/flash-sales"
            className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Link>
        </div>

        {/* Help footer */}
        <div className="pt-8 space-y-2 text-[11px] text-gray-400">
          <div className="flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Gợi ý: Kiểm tra lại đường dẫn URL, hoặc quay lại trang trước</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-600 font-semibold pt-1">
            <span>Cần hỗ trợ ngay?</span>
            <Link href="/help" className="flex items-center gap-1 hover:text-sky-700">
              <Headphones className="w-3.5 h-3.5 text-sky-600" /> Hỗ trợ khách hàng
            </Link>
            <span>•</span>
            <Link href="/" className="flex items-center gap-1 hover:text-sky-700">
              <Search className="w-3.5 h-3.5 text-sky-600" /> Tìm kiếm sản phẩm
            </Link>
          </div>
        </div>

      </div>

      <footer className="text-[11px] text-gray-400 py-2">
        © 2026 VibeMart. Tất cả các quyền được bảo lưu.
      </footer>
    </div>
  );
}
