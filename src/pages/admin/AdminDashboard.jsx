import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
export default function AdminDashboard() {
  return (
    <div className="p-6 bg-white">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Dashboard Content */}
      <h1 className="text-2xl font-semibold mt-4">Admin Dashboard</h1>
    </div>
  );
}
