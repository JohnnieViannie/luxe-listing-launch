
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useProductFilter } from '@/contexts/ProductFilterContext';

const SearchAndSort = () => {
  const { filters, setSearchQuery, setSortBy, filteredProducts } = useProductFilter();

  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4 items-start sm:items-center justify-between mb-4 sm:mb-6">
      <div className="relative flex-1 w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </span>
        
        <Select value={filters.sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="brand-az">Brand: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchAndSort;
