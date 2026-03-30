import { useState, useEffect } from 'react';
import { FiRotateCcw, FiArrowLeft, FiBook, FiUser, FiCalendar } from 'react-icons/fi';
import { getIssuedBooks, returnBook } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function ReturnBook() {
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  const fetchIssued = () => {
    setLoading(true);
    getIssuedBooks()
      .then(setIssued)
      .catch(err => {
        console.error(err);
        toast.error('Failed to load issued books');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchIssued(); }, []);

  const handleReturn = async (issueId, bookTitle) => {
    setReturningId(issueId);
    try {
      await returnBook(issueId);
      toast.success(`"${bookTitle}" returned successfully!`);
      fetchIssued();
    } catch (err) {
      toast.error(err.message);
    }
    setReturningId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-5 font-medium">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FiRotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Return Book</h2>
              <p className="text-sm text-slate-400">Select an issued book to return</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : issued.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-base font-semibold text-slate-500">No books currently issued</p>
            <p className="text-sm text-slate-400 mt-1">All books have been returned</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {issued.map((record) => (
              <div key={record.issue_id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiBook className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-[15px] truncate">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md uppercase tracking-tighter mr-2">ID: {record.book_id}</span>
                      {record.title}
                    </p>
                    <p className="text-sm text-slate-400 truncate">{record.author}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-[12px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" /> {record.student_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" /> {new Date(record.issue_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleReturn(record.issue_id, record.title)}
                  disabled={returningId === record.issue_id}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0
                    ${returningId === record.issue_id
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                >
                  {returningId === record.issue_id ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiRotateCcw className="w-4 h-4" />
                  )}
                  Return
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnBook;
