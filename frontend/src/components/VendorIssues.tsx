import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Issue {
  _id: string;
  product: { _id: string, title: string, image: string };
  reportedBy: { _id: string, email: string };
  subject: string;
  description: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
}

const VendorIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIssues = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const response = await fetch(`${API_URL}/api/issues/vendor`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch issues');
      
      const data = await response.json();
      setIssues(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const response = await fetch(`${API_URL}/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setIssues(issues.map(issue => 
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  if (loading) return <div className="p-8">Loading issues...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Reported Issues</h2>
        <p className="text-gray-600 mt-1">Manage customer issues regarding your products</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {issues.length === 0 ? (
           <div className="p-10 text-center text-gray-500">
             No issues reported for your products. Great job!
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Product</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Customer</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Issue Details</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {issues.map(issue => (
                  <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={issue.product.image.startsWith('http') ? issue.product.image : `${API_URL}${issue.product.image}`} 
                          alt={issue.product.title} 
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="font-medium text-gray-800 line-clamp-2 max-w-[200px]">{issue.product.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {issue.reportedBy.email}
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-800">{issue.subject}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{issue.description}</p>
                        {issue.imageUrl && (
                          <a href={`${API_URL}${issue.imageUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs mt-2 inline-block flex items-center">
                            <span>🖼️</span> View Attached Image
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        issue.status === 'Dismissed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="p-4">
                       <select 
                         value={issue.status}
                         onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                         className="border rounded px-2 py-1 text-sm bg-white"
                       >
                         <option value="Pending">Mark Pending</option>
                         <option value="Resolved">Mark Resolved</option>
                         <option value="Dismissed">Dismiss</option>
                       </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorIssues;
