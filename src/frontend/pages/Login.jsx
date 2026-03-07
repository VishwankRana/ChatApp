import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/chat");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-12 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl shadow-slate-950/40 text-slate-100">
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90 font-semibold">
            Welcome Back
          </p>
          <h2 className="text-3xl font-bold tracking-tight mt-2">Sign in</h2>
          <p className="text-sm text-slate-300/80 mt-1">
            Continue your conversations securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 outline-none transition focus:border-cyan-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 outline-none transition focus:border-cyan-400"
          />

          <button
            type="submit"
            className="mt-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-300/80 mt-6">
          Don't have an account?
        </p>

        <Link
          to="/register"
          className="block text-center text-cyan-300 hover:text-cyan-200 transition mt-1"
        >
          Register here
        </Link>
      </div>
    </div>
  );
}
