import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import API_ENDPOINTS from '../../constants/API_ENDPOINTS';

export default function VendorsList() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    // Fetch vendors from the API
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

      
    </div>
  );
}
