import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    if (!book || !book.title || !book.author) return false;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'available' && book.available) ||
                         (filter === 'issued' && !book.available);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Book Collection</h2>
            <p className="text-slate-400 text-sm mt-1">Manage your library's book inventory</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 w-64 transition-all duration-200 text-sm text-slate-700 placeholder:text-slate-300"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-400 w-3.5 h-3.5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all duration-200 text-sm text-slate-700 appearance-none cursor-pointer"
              >
                <option value="all">All Books</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <FiSearch className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-400 text-sm">Loading your collection...</p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-5">
            <span className="text-[10px] tracking-[0.15em] text-slate-400 font-medium uppercase">
              {filteredBooks.length} {filteredBooks.length === 1 ? 'TITLE' : 'TITLES'} FOUND
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book, index) => (
              <BookCard key={index} title={book.title} author={book.author} available={book.available} />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-blue-100/60">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FiSearch className="w-6 h-6 text-blue-300" />
              </div>
              <p className="text-slate-500 text-base font-medium">No books found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Books;