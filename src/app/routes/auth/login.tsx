import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const device_name = getDeviceName();
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

      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (response.ok && data.success === true) {
        const token = data.token;

        rememberMe
            ? localStorage.setItem("authToken", token)
            : sessionStorage.setItem("authToken", token);
        toast.success(data.message || "Login successful");
        window.location.href = "/dashboard";
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
      <div className="min-h-screen bg-[#050A1A] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                {/*<img*/}
                {/*    src="/logo.png"*/}
                {/*    alt="TL Logo"*/}
                {/*    width={120}*/}
                {/*    height={60}*/}
                {/*    className="h-16 w-auto mx-auto"*/}
                {/*/>*/}
                <h1 className="text-center font-gothic">
                  Save<span className="text-primary font-gothic">bills</span>
                </h1>
              </Link>
              <h1 className="text-2xl font-bold mt-6 mb-2">Admin Login</h1>
              <p className="text-gray-400">Welcome Back</p>
            </div>

            <div className="bg-[#070D20] rounded-xl border border-gray-800 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Username
                  </label>
                  <input
                      id="email"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A1128] border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
                      placeholder="Enter your email"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                    <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0A1128] border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white pr-10"
                        placeholder="Enter your password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-700 bg-[#0A1128] text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition ${
                        loading ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-blue-800 text-black"
                    }`}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}
