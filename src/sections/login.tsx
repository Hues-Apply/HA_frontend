import { useState } from "react";
import SignUp from "./signup";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

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
        </div>

        {isLogin ? (
          <>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter your password"
                />
              </div>

              <p className="text-xs text-gray-500">
                By clicking continue, you agree to our Terms of Use and Privacy Policy
              </p>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600"
              >
                Log In
              </button>
            </form>

            <div className="my-4 text-center text-sm text-gray-500">or</div>

            <button className="w-full border py-2 rounded hover:bg-gray-100">
              Continue with Google
            </button>

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
