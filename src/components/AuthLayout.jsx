//src/compponents/AuthLayout.jsx
import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Outlet , Navigate} from 'react-router-dom'

export default function AuthLayout() {
  const {token} = useStateContext()
  if(token){
    // Navigate to either admin or vendor dashboard
  }

  return (
    <div>
      <Outlet/>
    </div>
  );
}
