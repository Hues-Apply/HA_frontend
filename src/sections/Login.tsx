import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement login logic
      setError('Traditional login not implemented yet. Please use Google Sign-In.');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex h-screen bg-[#eaf2f8]">
      <img
        src={"/hero/hues_apply_logo.svg"}
        alt="Hues Apply"
        className="absolute top-4 left-4 h-20 w-28 text-[#4DA5E2] hidden md:block"
      />
      <div className="m-auto w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <div className="flex mb-6">
          <Link
            to="/Signup"
            className="flex-1 py-2 border bg-blue-100 text-center text-gray-700 hover:bg-blue-200"
          >
            Sign Up
          </Link>
          <button
            className="flex-1 py-2 border border-l-0 bg-blue-400 text-white"
            disabled
          >
            Log In
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <p className="text-xs text-gray-500">
            By clicking continue, you agree to our Terms of Use and Privacy Policy
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="my-4 text-center text-sm text-gray-500">or</div>
          
          <div className="mb-6">
          <GoogleSignInButton 
            text="Continue with Google"
            className="hover:bg-gray-50"
          />
          </div>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}