import { useState } from 'react';
import { FiBook, FiUser, FiHash, FiCheck, FiAlertCircle } from 'react-icons/fi';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, quantity: parseInt(quantity) }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
        setTitle('');
        setAuthor('');
        setQuantity(1);
      } else {
        setStatus({ type: 'error', message: data.message || 'Error adding book' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to connect to server' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-blue-100/60 p-8 shadow-lg shadow-blue-500/5">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <FiBook className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Add New Book</h2>
          </div>
          <p className="text-slate-400 text-sm ml-[52px]">Enter the details of the book you want to add to the library inventory.</p>
        </div>

        {status.message && (
          <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {status.type === 'success' ? <FiCheck className="w-4 h-4 flex-shrink-0" /> : <FiAlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Book Title
            </label>
            <div className="relative">
              <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 focus:bg-white transition-all duration-200 text-sm text-slate-700 placeholder:text-slate-300"
                placeholder="e.g. The Great Gatsby"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Author Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 focus:bg-white transition-all duration-200 text-sm text-slate-700 placeholder:text-slate-300"
                placeholder="e.g. F. Scott Fitzgerald"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quantity
            </label>
            <div className="relative">
              <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 focus:bg-white transition-all duration-200 text-sm text-slate-700 placeholder:text-slate-300"
                placeholder="Number of copies"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex justify-center items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Add Book to Library'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;