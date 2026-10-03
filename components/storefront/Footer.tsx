import Link from "next/link";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { VibeMartLogo } from "@/components/ui/VibeMartLogo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <VibeMartLogo height={32} />
          <p className="text-gray-500 text-[11px] leading-relaxed">
            Hệ thống mua sắm trực tuyến giá tốt hàng ngày, mang đến trải nghiệm mua sắm mượt mà, tiện lợi cho hàng triệu người dùng tại Việt Nam.
          </p>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Hàng Chính Hãng - Đổi Trả Dễ Dàng
          </div>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 text-xs">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2 text-[11px] text-gray-600">
            <li className="flex items-center gap-1.5 text-sky-700 font-bold text-xs">
              <Phone className="w-3.5 h-3.5" /> Hotline: 1900-8888
            </li>
            <li className="flex items-center gap-1.5 text-gray-500">
              <Mail className="w-3.5 h-3.5" /> hotro@vibemart.vn
            </li>
            <li><Link href="#" className="hover:text-sky-600">Trung tâm trợ giúp</Link></li>
            <li><Link href="#" className="hover:text-sky-600">Hướng dẫn mua hàng Flash Sale</Link></li>
            <li><Link href="#" className="hover:text-sky-600">Chính sách vận chuyển & Thanh toán</Link></li>
            <li><Link href="#" className="hover:text-sky-600">Chính sách đổi trả & Hoàn tiền</Link></li>
          </ul>
        </div>

        {/* Payment & Shipping Partners */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 text-xs">Thanh toán & Vận chuyển</h4>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1.5">Cổng thanh toán hỗ trợ:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-xs border border-slate-200">Visa</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-xs border border-slate-200">Mastercard</span>
                <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-xs border border-rose-200">ShopeePay</span>
                <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded-xs border border-pink-200">MoMo</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-xs border border-blue-200">VNPay</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1.5">Đối tác vận chuyển uy tín:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-xs border border-emerald-200">GHN</span>
                <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded-xs border border-amber-200">GHTK</span>
                <span className="bg-red-50 text-red-800 px-2 py-1 rounded-xs border border-red-200">Ninja Van</span>
                <span className="bg-red-50 text-red-800 px-2 py-1 rounded-xs border border-red-200">J&T Express</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 text-xs">Theo dõi & Tải ứng dụng</h4>
          <p className="text-[11px] text-gray-500 mb-2">Tải app VibeMart để săn deal Flash Sale nhanh hơn ngay hôm nay!</p>
          <div className="flex gap-2">
            <button className="bg-slate-900 text-white text-[10px] font-semibold px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
              App Store
            </button>
            <button className="bg-slate-900 text-white text-[10px] font-semibold px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
              Google Play
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 py-3 text-center text-[11px] text-gray-400">
        © 2026 VibeMart. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
}
