// src/pages/auth/VendorLogin.jsx
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../constants/AXIOS_CONFIG'
import API_ENDPOINTS from '../../constants/API_ENDPOINTS'
import { useStateContext } from '../../contexts/ContextProvider'
import { useNavigate } from "react-router-dom";
import { PATH } from '../../constants/PATH'

function VendorLogin() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const { setUser, setToken } = useStateContext()
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault()
    setErrors(null);
    setLoading(true);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    setErrors(null)

    axiosClient
      .post(API_ENDPOINTS.VENDOR_LOGIN, payload)
      .then(({ data }) => {

        setUser(data.user)
        setToken(data.token)

        if (data.user.roleName === "VENDOR") {
          navigate(PATH.VENDOR_DASHBOARD);
        }else{
          navigate(PATH.AUTH_LOGIN_VENDOR);
        }

        emailRef.current.value = "";
        passwordRef.current.value = "";
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        } else {
          setErrors({
            generic: ["An unexpected error occurred. Please try again later."],
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>Vendor Login</h1>

        {/* Error messages */}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key} className="text-sm text-red-500">
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
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
