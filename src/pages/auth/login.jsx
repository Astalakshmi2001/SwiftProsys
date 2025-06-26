import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import sampleImage from '../../assets/sample.jpg';
// import { API_URL } from '../../constant/api';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(collection(db, "employees"), where("employeeid", "==", employeeid));
      const snapshot = await getDocs(q);
      if (snapshot.empty) throw new Error("Invalid Employee ID");

      const employee = snapshot.docs[0].data();
      const email = employee.email;
      const role = employee.role;

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("role", role); // For AuthContext use

      // 🎯 Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      console.error("Login failed:", err.message);
      setErrorMsg("Login failed: " + err.message);
    }
  };

  return (
    <div className="w-full h-screen flex p-0 m-0">
      <div
        className="w-full md:w-1/2 lg:w-3/5 h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${sampleImage})` }}
      ></div>

      <div className="w-[40%] flex justify-center items-center">
        <form onSubmit={handleLogin} className="flex flex-col items-center gap-3">
          <h3 className="text-2xl font-semibold">Login</h3>
          {errorMsg && (
            <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
          )}
          <div className="relative mb-3">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-[300px] h-[50px] border border-black rounded-md text-lg px-4 bg-transparent text-black focus:outline-none focus:border-orange-500 peer"
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-[19px] transition-all peer-focus:top-0 peer-focus:text-orange-500 peer-focus:text-sm peer-valid:top-0 peer-valid:text-orange-500 peer-valid:text-sm bg-white px-1"
            >
              Username
            </label>
          </div>

          <div className="relative mb-1">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-[300px] h-[50px] border border-black rounded-md text-lg px-4 bg-transparent text-black focus:outline-none focus:border-orange-500 peer"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-[19px] transition-all peer-focus:top-0 peer-focus:text-orange-500 peer-focus:text-sm peer-valid:top-0 peer-valid:text-orange-500 peer-valid:text-sm bg-white px-1"
            >
              Password
            </label>
          </div>

          <a href="#" className="self-end text-orange-500 font-semibold text-sm">
            Forgot Password
          </a>

          <button type="submit" disabled={loading} className="w-[300px] h-[50px] bg-orange-500 text-white font-semibold rounded-md transition-transform duration-300 hover:shadow-lg disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* <p className="text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-orange-500 font-semibold">
              Signup
            </a>
          </p> */}
        </form>
      </div>
    </div>
  )
}

export default Login
