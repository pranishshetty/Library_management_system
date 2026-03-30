function BookCard({ title, author, available }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-100/60 hover:shadow-xl hover:shadow-blue-500/8 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer group card-glow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-base text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{title}</h3>
        <span className={`px-3 py-1 text-[10px] font-semibold rounded-full tracking-wide ${
          available
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'bg-amber-50 text-amber-600 border border-amber-200'
        }`}>
          {available ? 'Available' : 'Issued'}
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-5">by {author}</p>
      <div className="flex justify-between items-center pt-4 border-t border-blue-50">
        <span className={`text-xs font-medium flex items-center gap-1.5 ${
          available ? 'text-emerald-500' : 'text-amber-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          {available ? 'In Stock' : 'Checked Out'}
        </span>
        <span className="text-[10px] tracking-wider text-blue-400 font-medium uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Details →
        </span>
      </div>
    </div>
  );
}

export default BookCard;