function BookCard({ title, author, available }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          available
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {available ? 'Available' : 'Issued'}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">by {author}</p>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${
          available ? 'text-green-600' : 'text-red-600'
        }`}>
          {available ? '✓ Available' : '✗ Issued'}
        </span>
      </div>
    </div>
  );
}

export default BookCard;