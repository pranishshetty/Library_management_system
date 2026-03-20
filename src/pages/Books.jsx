import { useState } from 'react';
import BookCard from '../components/BookCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', available: false },
    { title: '1984', author: 'George Orwell', available: true },
    { title: 'Pride and Prejudice', author: 'Jane Austen', available: true },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', available: false },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', available: true },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', available: false },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', available: true },
    { title: 'Dune', author: 'Frank Herbert', available: true },
    { title: 'Neuromancer', author: 'William Gibson', available: false },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'available' && book.available) ||
                         (filter === 'issued' && !book.available);
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Collection</h2>
            <p className="text-gray-600">Manage your library's book inventory</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Books</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book, index) => (
          <BookCard key={index} title={book.title} author={book.author} available={book.available} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default Books;