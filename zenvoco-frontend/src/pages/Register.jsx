import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        // Clear any old user data
        localStorage.clear();
        localStorage.setItem("name", response.data.name || name);

        // Auto-login to get the token for the new user
        try {
          const loginResponse = await API.post("/auth/login", { email, password });
          if (loginResponse.status === 200 || loginResponse.status === 201) {
            localStorage.setItem("token", loginResponse.data.access_token);
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // If auto login fails, force them to login
          alert("Registration successful! Please log in.");
          navigate("/login");
          return;
        }

        alert("Registration successful!");
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Registration failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl p-10 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-md relative z-10 my-8">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Join <span className="text-blue-500">Zenvoco</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Start your journey to fearless communication.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              placeholder="e.g. virat"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"

            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"

            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-gray-900 dark:text-white p-4 rounded-xl font-bold hover:bg-blue-500 transition-all duration-300 transform active:scale-[0.98] mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
