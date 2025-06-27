
const TopStrip = () => {
  return (
    <div className="border-b border-gray-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-black transition-colors">Womens</a>
          <span className="text-black font-semibold">Mens</span>
          <a href="#" className="hover:text-black transition-colors">Beauty</a>
        </div>
      </div>
    </div>
  );
};

export default TopStrip;
