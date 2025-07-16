import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  // const [loginData, setLoginData] = useState({ email: '', password: '' });
  // const [isLoading, setIsLoading] = useState(false);
  // const [isLogin, setIsLogin] = useState(false);
  // const [error, setError] = useState('');
  // const navigate = useNavigate();
  // const { setUser } = useAuth();

  // const handleLoginSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     // TODO: Implement login logic
  //     setError('Traditional login not implemented yet. Please use Google Sign-In.');
  //   } catch (err: any) {
  //     setError(err.message || 'Login failed. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setLoginData(prev => ({ ...prev, [name]: value }));
  // };

  return (
    <div className="flex h-screen bg-[#eaf2f8]">
      <img
        src={"/hero/hues_apply_logo.svg"}
        alt="Hues Apply"
        className="absolute top-4 left-4 h-20 w-28 text-[#4DA5E2] hidden md:block"
      />
      <div className="m-auto w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In/Sign Up</h2>

        {/* Only show Google Sign-In */}
        <div className="mb-6">
          <GoogleSignInButton
            text="Continue with Google"
            className="hover:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
