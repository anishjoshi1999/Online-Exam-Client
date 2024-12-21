
export function ProcessStep({ number, title, description }) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
}