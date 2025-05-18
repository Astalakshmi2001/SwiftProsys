import React from 'react'
import '../../App.css'
import { Colors } from '../../constant/colors'

function Login() {
  return (
    <div>
      <div className='container-fluid d-flex p-0'>
      <div className="imagecontainer" style={{ backgroundColor: Colors.primary, width: '60%', height: '100vh' }}>

      </div>
      <div className="contentcontainer">
        <div className='formcontainer'>
          <h3>Login</h3>
          <div className='input-field'>
            <input type="text" id='username' required />
            <label htmlFor="username">Username</label>
          </div>

          <div className='input-field' style={{marginBottom: 5}}>
            <input type="password" id='password' required />
            <label htmlFor="password">Password</label>
          </div>
          <a href="" style={{alignSelf: 'flex-end'}}>Forgot Password</a>
          <button>Login</button>
          <p>don't have an account? <a href="/signup">Signup</a></p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login
