import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react"; // Make sure to install lucide-react

const SuccessPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.info("User redirected to success page from:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Link Sent!</h2>
        <p className="text-gray-600 mb-6">Please check your email for the reset link and follow the instructions.</p>
        <Link
          to="/login"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
