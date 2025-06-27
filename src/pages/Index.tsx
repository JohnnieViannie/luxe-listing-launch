
import TopStrip from "@/components/TopStrip";
import MainNavigation from "@/components/MainNavigation";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import HelpButton from "@/components/HelpButton";
import ProductFilters from "@/components/ProductFilters";
import SearchAndSort from "@/components/SearchAndSort";
import { ProductFilterProvider } from "@/contexts/ProductFilterContext";

const IndexContent = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopStrip />
      <MainNavigation />
      <HeroSection />

      {/* Main Content with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <ProductFilters />
          
          <div className="flex-1 min-w-0">
            <SearchAndSort />
            <ProductGrid />
          </div>
        </div>
      </div>

      {/* Fixed Help Button */}
      <HelpButton />
    </div>
  );
};

const Index = () => {
  return (
    <ProductFilterProvider>
      <IndexContent />
    </ProductFilterProvider>
  );
};

export default Index;
