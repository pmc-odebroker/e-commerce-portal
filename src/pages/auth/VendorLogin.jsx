// src/pages/auth/VendorLogin.jsx
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../constants/AXIOS_CONFIG'
import API_ENDPOINTS from '../../constants/API_ENDPOINTS'
import { useStateContext } from '../../contexts/ContextProvider'
import PATH from '../../constants/ROUTER'

function VendorLogin() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const { setUser, setToken } = useStateContext()
  const [errors, setErrors] = useState(null)

  const onSubmit = (ev) => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    setErrors(null)

    axiosClient.post(API_ENDPOINTS.VENDOR_LOGIN, payload)
      .then(({ data }) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors)
          } else {
            setErrors({
              email: [response.data.message]
            })
          }
        }
      })
  }

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>Vendor Login</h1>

        {/* Error messages */}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key} className="text-sm">
                {errors[key][0]}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Not Registered?{' '}
          <Link to={PATH.AUTH_REGISTER} className="text-blue-600 hover:text-blue-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VendorLogin
