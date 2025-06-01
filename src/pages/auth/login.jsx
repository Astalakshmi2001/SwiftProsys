import React from 'react'
// import '../../App.css'
// import { Colors } from '../../constant/colors'
import sampleImage from '../../assets/sample.jpg';

function Login() {
  return (
    <div className="w-full h-screen flex p-0 m-0">
      <div
        className="w-full md:w-1/2 lg:w-3/5 h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${sampleImage})` }}
      ></div>

      <div className="w-[40%] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-2xl font-semibold">Login</h3>

          <div className="relative mb-3">
            <input
              type="text"
              id="username"
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

          <button className="w-[300px] h-[50px] bg-orange-500 text-white font-semibold rounded-md transition-transform duration-300 hover:shadow-lg">
            Login
          </button>

          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-orange-500 font-semibold">
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
