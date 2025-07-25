import { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    //   const { data } = await axios.post("/api/auth/forgot-password", { email });
        // const data={
        //     success:true,
        //     url:"https://www.google.com/"
        // }

        const data=await forgotPassword({email});
      if (data?.success && data?.link) {
          navigate("/redirect-login")
        window.open(data.link, "_blank");
      } else {
        setError("Failed to send reset link.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
