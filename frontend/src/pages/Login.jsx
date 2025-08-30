import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import googleLogo from "../assets/g-logo.png";
import appLogo from "../assets/imageStorageLogo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${backendUrl}/api/auth/login`, form);
      if (res.data?.token) {
        toast.success("Login successful");
        login(res.data.user.username, res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-500 items-center justify-center p-12">
        <div className="text-white max-w-md flex flex-col items-center justify-center">
          <img
            className="hover:scale-105 transition-transform duration-500 h-60 w-60"
            src={appLogo}
            alt="app-logo"
          />
          {/* <h1 className="text-5xl font-bold mb-6">My Drive App</h1> */}
          <p className="text-lg leading-relaxed ml-3">
            Store, organize, and search your images effortlessly. Secure and
            easy to use.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center w-full h-screen lg:w-1/2 justify-center">
        <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl flex flex-col">
          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">
              Sign in to your account or continue with Google
            </p>
          </div>

          {/* Google login */}
          <button className="w-full flex items-center justify-center border-2 mb-2 border-cyan-500 py-2 rounded-lg hover:bg-gray-50 transition">
            <img src={googleLogo} alt="logo" className="w-5 h-5 mr-2" />
            <span
              onClick={() => {
                alert("UI Demo");
              }}
              className="text-cyan-500 font-medium"
            >
              Login with Google
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 m-3">
            <span className="flex-grow border-t border-gray-200"></span>
            <span className="text-gray-400 text-sm">or</span>
            <span className="flex-grow border-t border-gray-200"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="placeholder:text-gray-400  mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="placeholder:text-gray-400 mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeIcon size={18} />
                  ) : (
                    <EyeOffIcon size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right">
              <Link
                className="text-indigo-600 hover:underline text-sm"
                onClick={() => alert("UI demo")}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
