import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Shield,
  Zap,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Monitor,
  Globe,
  Star,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getDeviceName = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const browser = (() => {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    return "Unknown";
  })();

  return `${platform} ${browser}`;
};

const getDeviceIcon = () => {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad/.test(ua)) return Smartphone;
  if (/Tablet|iPad/.test(ua)) return Smartphone;
  return Monitor;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const device_name = getDeviceName();
  const DeviceIcon = getDeviceIcon();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, device_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (response.ok && data.success === true) {
        const token = data.token;

        rememberMe
            ? localStorage.setItem("authToken", token)
            : sessionStorage.setItem("authToken", token);

        toast.success(data.message || "Login successful");

        // Add a small delay for better UX
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#050A1A] via-[#0A1128] to-[#050B1E] flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg " />

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />

          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            {/* Logo Section */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mr-4 shadow-2xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    Save<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">bills</span>
                  </h1>
                  <p className="text-gray-400 text-sm">Admin Control Center</p>
                </div>
              </div>
            </div>

            {/* Welcome Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                  Powerful Admin
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Dashboard
                                </span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Take control of your platform with advanced analytics,
                  user management, and real-time monitoring tools.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, title: "User Management", desc: "Complete control" },
                  { icon: TrendingUp, title: "Analytics", desc: "Real-time insights" },
                  { icon: Shield, title: "Security", desc: "Enterprise grade" },
                  { icon: Award, title: "Performance", desc: "Optimized system" }
                ].map((feature, index) => (
                    <div key={index} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                        <feature.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                      <p className="text-gray-400 text-xs">{feature.desc}</p>
                    </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex space-x-8 pt-6">
                {[
                  { number: "99.9%", label: "Uptime" },
                  { number: "24/7", label: "Support" },
                  { number: "256-bit", label: "Encryption" }
                ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* Device Info */}
            <div className="mt-12 p-4 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl border border-gray-600/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DeviceIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">Secure Login Session</p>
                  <p className="text-xs text-gray-400">{device_name}</p>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-3 shadow-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold">
                  Save<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">bills</span>
                </h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your admin dashboard</p>
            </div>

            {/* Login Form */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>

              <div className="relative bg-gradient-to-br from-[#0F1629]/90 to-[#1A2332]/90 backdrop-blur-xl rounded-2xl border border-gray-600/50 p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                      Username
                    </label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${
                          usernameFocused ? 'text-blue-400 scale-110' : 'text-gray-400'
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                      <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onFocus={() => setUsernameFocused(true)}
                          onBlur={() => setUsernameFocused(false)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white placeholder-gray-400 transition-all duration-200 ${
                              usernameFocused
                                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-gray-800/70 shadow-lg shadow-blue-500/10'
                                  : 'border-gray-600 hover:border-gray-500 group-hover:bg-gray-800/60'
                          }`}
                          placeholder="Enter your username"
                          required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Password
                      </label>
                      <Link
                          to="/forgot-password"
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${
                          passwordFocused ? 'text-blue-400 scale-110' : 'text-gray-400'
                      }`}>
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                          className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl focus:outline-none text-white placeholder-gray-400 transition-all duration-200 ${
                              passwordFocused
                                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-gray-800/70 shadow-lg shadow-blue-500/10'
                                  : 'border-gray-600 hover:border-gray-500 group-hover:bg-gray-800/60'
                          }`}
                          placeholder="Enter your password"
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="sr-only"
                        />
                        <div
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                rememberMe
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 shadow-lg shadow-blue-500/25'
                                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
                            }`}
                        >
                          {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300 cursor-pointer">
                        Keep me signed in
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                          loading
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                  >
                    {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                          <span>Access Dashboard</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                  </button>
                </form>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-green-300 font-medium">Secure Admin Access</p>
                      <p className="text-xs text-green-400/80">Protected by enterprise security protocols</p>
                    </div>
                    <div className="ml-auto flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-2">
              <p className="text-gray-400 text-sm">
                Secured by SaveBills Security Protocol
              </p>
              <p className="text-gray-500 text-xs">
                © 2024 SaveBills. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
