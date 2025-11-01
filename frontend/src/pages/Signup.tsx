import { useContext } from "react";
import { AuthDataContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  // ✅ Correct: call inside the component
  const { name, setName, email, setEmail, password, setPassword, handleSignup } =
    useContext(AuthDataContext);


    const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    try{
          e.preventDefault();
    handleSignup();
    navigate("/login");
    toast.success("Signup Successfully");
    }catch(error){
           toast.error("Signup Error");
          console.log(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-cyan-300/50 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">Create Account</h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/20 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder-gray-300 transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/20 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder-gray-300 transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/20 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder-gray-300 transition-all duration-300"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-2 rounded-md font-semibold text-lg shadow-md hover:shadow-cyan-400/30"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-200">
          Already have an account?{" "}
          <span className="text-cyan-300 hover:underline cursor-pointer" onClick={()=>navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
