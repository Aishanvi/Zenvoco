import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", response.data.access_token);
        // Save the user's name so DailyCheckIn can display it
        if (response.data.name) {
          localStorage.setItem("name", response.data.name);
        }
        navigate("/checkin");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.detail || "Login failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-gray-900/50 backdrop-blur-xl p-10 rounded-3xl border border-gray-800 w-full max-w-md relative z-10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Welcome back to <span className="text-blue-500">Zenvoco</span>
          </h2>
          <p className="text-gray-400 text-sm">Log in to continue your training.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="text-gray-400 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>  

          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="text-gray-400">Password</label>
              <a href="#" className="text-blue-500">Forgot password?</a>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            Sign In
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;