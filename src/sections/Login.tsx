import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // For now, we'll just handle Google login
      // Add standard email/password login when backend supports it
      setError("Email/password login is not yet implemented. Please use Google login.");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-[#eaf2f8]">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                By clicking continue, you agree to our Terms of Use and Privacy Policy
              </p>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}              </button>
            </form>
            
            <div className="my-4 text-center text-sm text-gray-500">or</div>

            <GoogleSignInButton className="w-full" />
            
            <p className="mt-4 text-sm text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 cursor-pointer hover:underline">
                Sign Up
              </Link>
            </p>
      </div>
    </div>
  );
}
