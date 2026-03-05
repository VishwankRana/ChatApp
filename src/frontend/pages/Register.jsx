import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white w-[400px] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 p-3 rounded font-semibold transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="block text-center text-blue-400 hover:underline mt-1"
        >
          Login here
        </Link>
      </div>
    </div>
  );
}
