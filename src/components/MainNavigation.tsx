
import { useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProductFilter } from "@/contexts/ProductFilterContext";
import { useNavigate } from "react-router-dom";

const MainNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { toggleCategory, clearFilters, filters } = useProductFilter();
  const navigate = useNavigate();

  // Category mapping for navigation
  const categoryMap: { [key: string]: string } = {
    'NEW': 'new',
    'CLOTHING': 'shirts',
    'SHOES': 'shoes',
    'ACCESSORIES': 'accessories',
    'DESIGNERS': 'designer',
    'CURATED': 'curated',
    'SALE': 'sale'
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'ADMIN') {
      navigate('/admin');
      return;
    }

    const categoryValue = categoryMap[categoryName];
    if (categoryValue) {
      // Clear existing filters first
      clearFilters();
      // Then apply the selected category
      setTimeout(() => {
        toggleCategory(categoryValue);
      }, 100);
    }
  };

  const isActiveCategory = (categoryName: string) => {
    const categoryValue = categoryMap[categoryName];
    return categoryValue && filters.selectedCategories.includes(categoryValue);
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-black tracking-wide cursor-pointer" onClick={() => navigate('/')}>LUXE</h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-black transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <button 
              onClick={() => handleCategoryClick('NEW')}
              className={`font-medium hover:text-gray-600 transition-colors text-sm lg:text-base ${
                isActiveCategory('NEW') ? 'text-black' : 'text-gray-700'
              }`}
            >
              NEW
            </button>
            <button 
              onClick={() => handleCategoryClick('CLOTHING')}
              className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                isActiveCategory('CLOTHING') ? 'text-black' : 'text-gray-700'
              }`}
            >
              CLOTHING
            </button>
            <button 
              onClick={() => handleCategoryClick('SHOES')}
              className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                isActiveCategory('SHOES') ? 'text-black' : 'text-gray-700'
              }`}
            >
              SHOES
            </button>
            <button 
              onClick={() => handleCategoryClick('ACCESSORIES')}
              className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                isActiveCategory('ACCESSORIES') ? 'text-black' : 'text-gray-700'
              }`}
            >
              ACCESSORIES
            </button>
            <button 
              onClick={() => handleCategoryClick('DESIGNERS')}
              className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                isActiveCategory('DESIGNERS') ? 'text-black' : 'text-gray-700'
              }`}
            >
              DESIGNERS
            </button>
            <button 
              onClick={() => handleCategoryClick('CURATED')}
              className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                isActiveCategory('CURATED') ? 'text-black' : 'text-gray-700'
              }`}
            >
              CURATED
            </button>
            <button 
              onClick={() => handleCategoryClick('SALE')}
              className="text-red-600 font-medium hover:text-red-700 transition-colors text-sm lg:text-base"
            >
              SALE
            </button>
            <button 
              onClick={() => handleCategoryClick('ADMIN')}
              className="text-gray-700 font-medium hover:text-black transition-colors text-sm lg:text-base"
            >
              ADMIN
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden sm:flex items-center">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
            </div>
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <button 
              onClick={() => handleCategoryClick('NEW')}
              className={`block font-medium hover:text-gray-600 transition-colors ${
                isActiveCategory('NEW') ? 'text-black' : 'text-gray-700'
              }`}
            >
              NEW
            </button>
            <button 
              onClick={() => handleCategoryClick('CLOTHING')}
              className={`block font-medium hover:text-black transition-colors ${
                isActiveCategory('CLOTHING') ? 'text-black' : 'text-gray-700'
              }`}
            >
              CLOTHING
            </button>
            <button 
              onClick={() => handleCategoryClick('SHOES')}
              className={`block font-medium hover:text-black transition-colors ${
                isActiveCategory('SHOES') ? 'text-black' : 'text-gray-700'
              }`}
            >
              SHOES
            </button>
            <button 
              onClick={() => handleCategoryClick('ACCESSORIES')}
              className={`block font-medium hover:text-black transition-colors ${
                isActiveCategory('ACCESSORIES') ? 'text-black' : 'text-gray-700'
              }`}
            >
              ACCESSORIES
            </button>
            <button 
              onClick={() => handleCategoryClick('DESIGNERS')}
              className={`block font-medium hover:text-black transition-colors ${
                isActiveCategory('DESIGNERS') ? 'text-black' : 'text-gray-700'
              }`}
            >
              DESIGNERS
            </button>
            <button 
              onClick={() => handleCategoryClick('CURATED')}
              className={`block font-medium hover:text-black transition-colors ${
                isActiveCategory('CURATED') ? 'text-black' : 'text-gray-700'
              }`}
            >
              CURATED
            </button>
            <button 
              onClick={() => handleCategoryClick('SALE')}
              className="block text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              SALE
            </button>
            <button 
              onClick={() => handleCategoryClick('ADMIN')}
              className="block text-gray-700 font-medium hover:text-black transition-colors"
            >
              ADMIN
            </button>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <Search className="h-5 w-5 text-gray-700" />
                <span className="text-gray-700 font-medium">Search</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
