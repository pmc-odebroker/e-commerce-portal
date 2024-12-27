import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosConfig from '../../constants/AXIOS_CONFIG';
import API from '../../constants/API';
import { useStateContext } from '../../contexts/ContextProvider';
import { PATH } from '../../constants/PATH';

function Register() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    axiosConfig
      .post(API.VENDOR_REGISTER, payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        navigate(PATH.AUTH_LOGIN_VENDOR);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>Signup for free</h1>

        {/* Error messages */}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key} className="text-sm">{errors[key][0]}</p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              ref={firstNameRef}
              id="first_name"
              type="text"
              placeholder="First Name"
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              ref={lastNameRef}
              id="last_name"
              type="text"
              placeholder="Last Name"
            />
          </div>
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
          <div>
            <label htmlFor="password_confirmation">Password Confirmation</label>
            <input
              ref={passwordConfirmationRef}
              id="password_confirmation"
              type="password"
              placeholder="Password Confirmation"
            />
          </div>

          <button type="submit">Register</button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to={PATH.AUTH_LOGIN_VENDOR} className="text-blue-600 hover:text-blue-800">
              Login In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
