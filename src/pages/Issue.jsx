import { useState } from 'react';
import { FiSend, FiUser, FiHash, FiArrowLeft } from 'react-icons/fi';
import { issueBook } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Issue() {
  const [studentName, setStudentName] = useState('');
  const [bookId, setBookId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await issueBook({ student_name: studentName, book_id: parseInt(bookId) });
      toast.success('Book issued successfully!');
      setStudentName('');
      setBookId('');
    } catch (err) {
      toast.error(err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-5 font-medium">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <FiSend className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Issue Book</h2>
            <p className="text-sm text-slate-400">Issue a book to a student</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Student Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
                placeholder="Enter student name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Book ID</label>
            <div className="relative">
              <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                min="1"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
                placeholder="Enter book ID"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Issue Book'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Issue;