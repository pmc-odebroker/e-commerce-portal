//src/compponents/AuthLayout.jsx
import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  const {token} = useStateContext()

  return (
    <div>
      <Outlet/>
    </div>
  );
}
