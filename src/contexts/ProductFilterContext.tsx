
import { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  category: string;
  sizes?: string[];
  colors?: string[];
}

interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  sortBy: string;
}

interface ProductFilterContextType {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  clearFilters: () => void;
  filteredProducts: Product[];
  setProducts: (products: Product[]) => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedCategories: [],
  selectedBrands: [],
  selectedSizes: [],
  selectedColors: [],
  priceRange: [0, 500],
  sortBy: 'newest'
};

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export const useProductFilter = () => {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error('useProductFilter must be used within a ProductFilterProvider');
  }
  return context;
};

interface ProductFilterProviderProps {
  children: ReactNode;
}

export const ProductFilterProvider = ({ children }: ProductFilterProviderProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand]
    }));
  };

  const toggleSize = (size: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const toggleColor = (color: string) => {
    setFilters(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color)
        ? prev.selectedColors.filter(c => c !== color)
        : [...prev.selectedColors, color]
    }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const setSortBy = (sort: string) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const filteredProducts = products.filter(product => {
    // Search query filter
    if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !product.brand.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(product.category)) {
      return false;
    }

    // Brand filter
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
      return false;
    }

    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'brand-az':
        return a.brand.localeCompare(b.brand);
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  return (
    <ProductFilterContext.Provider value={{
      filters,
      setSearchQuery,
      toggleCategory,
      toggleBrand,
      toggleSize,
      toggleColor,
      setPriceRange,
      setSortBy,
      clearFilters,
      filteredProducts,
      setProducts
    }}>
      {children}
    </ProductFilterContext.Provider>
  );
};
