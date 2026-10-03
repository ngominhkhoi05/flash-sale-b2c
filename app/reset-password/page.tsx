"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    router.push("/reset-password/success");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-4 rounded-3xl bg-rose-50 text-rose-600 mb-4 border border-rose-100 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Đặt lại mật khẩu mới
        </h2>
        <p className="mt-2 text-xs text-gray-600">
          Vui lòng tạo mật khẩu mạnh gồm ít nhất 8 ký tự để bảo vệ tài khoản.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 border border-gray-100 sm:rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all pl-11 pr-11"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all pl-11"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="font-semibold text-gray-700">Yêu cầu mật khẩu:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li className={password.length >= 8 ? "text-emerald-600 font-medium" : ""}>Tối thiểu 8 ký tự</li>
                <li className={/[A-Z]/.test(password) ? "text-emerald-600 font-medium" : ""}>Có ít nhất 1 chữ viết hoa</li>
                <li className={/[0-9]/.test(password) ? "text-emerald-600 font-medium" : ""}>Có ít nhất 1 chữ số</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all text-sm flex items-center justify-center gap-2"
            >
              CẬP NHẬT MẬT KHẨU
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/reset-password/expired"
              className="text-[11px] text-gray-400 hover:text-rose-600 underline"
            >
              Demo: Thử xem giao diện Liên kết hết hạn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
