import React from 'react'
import Breadcrumb from '../../components/Breadcrumb'
export default function VendorDashboard() {
  return (
    <div className="p-6 bg-white">
    {/* Breadcrumb */}
    <Breadcrumb />

    {/* Dashboard Content */}
    <h1 className="text-2xl font-semibold mt-4">Vendor Dashboard</h1>
  </div>
  )
}
