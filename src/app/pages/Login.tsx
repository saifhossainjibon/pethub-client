import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, PawPrint, AlertCircle } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Pet Owner", email: "owner@petcare.com", password: "owner123@KL", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { role: "Clinic", email: "clinic@petcare.com", password: "clinic123@KL", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { role: "Doctor", email: "doctor@petcare.com", password: "doctor123@KL", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { role: "Admin", email: "admin@petcare.com", password: "admin123@KL", color: "bg-orange-100 text-orange-700 border-orange-200" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      const user = { email, password };
      const matched = DEMO_ACCOUNTS.find((a) => a.email === email);
      if (matched) {
        const roleRoutes: Record<string, string> = {
          "Pet Owner": "/owner",
          Clinic: "/clinic",
          Doctor: "/doctor",
          Admin: "/admin",
        };
        navigate(roleRoutes[matched.role]);
      }
    } else {
      setError(result.message);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 p-3 rounded-2xl">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">PetCare Hub</h1>
              <p className="text-teal-100 text-sm">Your Pet's Health Partner</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-white text-4xl font-bold leading-tight">
              Complete Pet Care Management
            </h2>
            <p className="text-teal-100 text-lg">
              Manage appointments, medical records, and connect with certified veterinarians — all in one place.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { label: "Active Pets", value: "1,200+" },
            { label: "Vet Clinics", value: "80+" },
            { label: "Appointments", value: "5,000+" },
            { label: "Doctors", value: "320+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-teal-100 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <PawPrint className="w-7 h-7 text-teal-600" />
            <span className="text-2xl font-bold text-gray-800">PetCare Hub</span>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  className={`text-xs font-medium px-3 py-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${acc.color}`}
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-gray-900 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-gray-900 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            PetCare Hub &copy; 2025 — All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
