import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiSend, FiBook, FiFilter, FiClock, FiCheck, FiX, FiActivity } from 'react-icons/fi';
import { getBooks, deleteBook, createRequest } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { user, isAdmin } = useAuth();

  const fetchBooks = () => {
    setLoading(true);
    getBooks()
      .then(setBooks)
      .catch(err => {
        console.error(err);
        toast.error('Failed to load books');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteBook(id);
      toast.success(`"${title}" deleted`);
      fetchBooks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === 'all' ||
                       (filter === 'available' && b.available) ||
                       (filter === 'issued' && !b.available);
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Book Inventory</h2>
          <p className="text-sm text-slate-400">
            {isAdmin ? 'Manage your library collection' : 'Browse available books'}
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/add-book"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 w-fit"
          >
            <FiBook className="w-4 h-4" /> Add Book
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer text-slate-600"
            >
              <option value="all">All Books</option>
              <option value="available">Available</option>
              <option value="issued">Fully Issued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
        {filtered.length} {filtered.length === 1 ? 'book' : 'books'} found
      </p>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <FiBook className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-base font-semibold text-slate-500">No books found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        /* Book Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800 text-[15px] truncate group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5 truncate">by {book.author}</p>
                </div>
                <span className={`ml-3 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0
                  ${book.available
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-500'
                  }`}>
                  {book.available ? 'Available' : 'Issued'}
                </span>
              </div>

              {/* Quantities */}
              <div className="flex gap-4 py-3 border-t border-slate-50 mt-2">
                <div>
                  <p className="text-lg font-bold text-slate-800">{book.quantity}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Total</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600">{book.available_qty}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Available</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{book.quantity - book.available_qty}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Issued</p>
                </div>
              </div>

              {/* Actions — Admin only or Student Request */}
              {isAdmin ? (
                <div className="flex gap-2 mt-3">
                  <Link
                    to="/issue"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <FiSend className="w-3.5 h-3.5" /> Issue
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button
                    onClick={async () => {
                      try {
                        await createRequest(book.id, user.id);
                        toast.success(`Request for "${book.title}" sent!`);
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }}
                    disabled={!book.available}
                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                      ${book.available 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/10' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    <FiClock className="w-3.5 h-3.5" /> 
                    {book.available ? 'Request Book' : 'Out of Stock'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;