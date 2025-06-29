import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "./Signup";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement traditional email/password login
      // For now, this is a placeholder since we're focusing on Google auth
      console.log('Login attempt:', loginData);
      
      // Example of what the login logic would look like:
      // const authResponse = await loginUser(loginData);
      // localStorage.setItem('accessToken', authResponse.access_token);
      // localStorage.setItem('refreshToken', authResponse.refresh_token);
      // setUser(authResponse.user);
      // 
      // if (authResponse.user.is_new_user) {
      //   navigate('/onboarding/step-1');
      // } else {
      //   navigate('/dashboard');
      // }
      
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
      <div className="m-auto w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Sign In" : "Sign Up"}</h2>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 border ${!isLogin ? "bg-blue-400 text-white" : "bg-blue-100"}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 border border-l-0 ${isLogin ? "bg-blue-400 text-white" : "bg-blue-100"}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
        </div>        {isLogin ? (
          <>
            {/* Google Sign-In Button - Moved above the form */}
            <div className="mb-6">
              <GoogleSignInButton 
                text="Continue with Google"
                className="hover:bg-gray-50"
              />
            </div>

            <div className="my-4 text-center text-sm text-gray-500">or</div>

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
            </form>

            <p className="mt-4 text-sm text-center">
              Don't have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <SignUp />
        )}
      </div>
    </div>
  );
}
