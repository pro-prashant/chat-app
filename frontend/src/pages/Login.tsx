import { useContext } from "react";
import AuthDataContextProvider, { AuthDataContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";





const Login = () => {
   const navigate = useNavigate();
     const {handleLogin,email,password,setEmail,setPassword}  = useContext(AuthDataContext);
const handleSubmit = (e:React.FormEvent)=>{
           try{
              e.preventDefault();
            handleLogin();
            toast.success("Login Successfully");
            navigate("/profile");
            console.log("click")
           }catch(error){
               toast.error("Login Error");
           }


}

   

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-cyan-300/50 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
              onChange={(e)=>setPassword(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/20 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder-gray-300 transition-all duration-300"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-2 rounded-md font-semibold text-lg shadow-md hover:shadow-cyan-400/30"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-200">
          Don’t have an account?{" "}
          <span className="text-cyan-300 hover:underline cursor-pointer" onClick={()=>navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
