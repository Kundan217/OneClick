
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

interface Vendor {
  _id: string;
  vendorName: string;
  email: string;
  isApproved: boolean;
  ownerName: string;
  city: string;
}

const VendorTable = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVendors = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      } else {
        setError('Failed to fetch vendors');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/admin/vendors/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setVendors(vendors.map(vendor =>
          vendor._id === id ? { ...vendor, isApproved: newStatus === 'approved' } : vendor
        ));
      }
    } catch (error) {
      console.error('Error updating status', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this vendor?')) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/admin/vendors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });

      if (response.ok) {
        setVendors(vendors.filter(vendor => vendor._id !== id));
      }
    } catch (error) {
      console.error('Error deleting vendor', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Vendor List</h3>
          <p className="text-sm text-gray-500">Manage vendor approvals and accounts</p>
        </div>
        <div className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-600 shadow-sm">
          Total: {vendors.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4 font-semibold">Vendor Store</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-gray-800">{vendor.vendorName || 'Unnamed Store'}</p>
                    <p className="text-xs text-gray-500">{vendor.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {vendor.ownerName || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {vendor.city || 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${vendor.isApproved
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                    {vendor.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!vendor.isApproved && (
                    <button
                      onClick={() => handleStatusUpdate(vendor._id, 'approved')}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                  )}
                  {vendor.isApproved && (
                    <button
                      onClick={() => handleStatusUpdate(vendor._id, 'rejected')}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors shadow-sm"
                    >
                      Suspend
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(vendor._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Vendor"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vendors.length === 0 && !loading && (
        <div className="p-12 text-center text-gray-400">
          No vendors found.
        </div>
      )}
    </div>
  );
};

export default VendorTable;
