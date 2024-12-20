import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import API_ENDPOINTS from '../../constants/API_ENDPOINTS';

export default function VendorsList() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.VENDORS);
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    // fetchVendors();
  }, []);

  return (
    <div className="p-6 bg-white">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Vendors List Content */}
      <h1 className="text-2xl font-semibold mt-4">Vendors List</h1>

      {/* Vendors Table */}
      <div className="mt-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Vendor Name</th>
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4">
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
