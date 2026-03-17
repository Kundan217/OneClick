import { useState } from 'react';

const ReportIssueModal = ({ productId, onClose }: { productId: string, onClose: () => void }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      setError('Please login to report an issue.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('subject', subject);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('✅ Issue reported successfully. Our team will review it.');
        onClose();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to report issue');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Report an Issue</h3>
        <p className="text-gray-500 mb-6 text-sm">Please provide details about what went wrong with this product.</p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.g. Damaged item, Wrong size..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please explain the issue in detail..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </div>

          <div className="pt-4 border-t mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;
