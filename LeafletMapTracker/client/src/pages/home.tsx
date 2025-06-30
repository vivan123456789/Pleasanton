import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Business } from "@shared/schema";
import BusinessCard from "@/components/business-card";
import SearchBar from "@/components/search-bar";
import CategoryFilter from "@/components/category-filter";
import InteractiveMap from "@/components/interactive-map";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDebounce } from "@/hooks/use-debounce";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch businesses based on search and category
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['/api/businesses', debouncedSearchQuery, selectedCategory],
    queryFn: async () => {
      if (debouncedSearchQuery) {
        const response = await fetch(`/api/businesses/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
        if (!response.ok) throw new Error('Failed to search businesses');
        return response.json();
      } else if (selectedCategory !== "All") {
        const response = await fetch(`/api/businesses/category/${encodeURIComponent(selectedCategory)}`);
        if (!response.ok) throw new Error('Failed to fetch businesses by category');
        return response.json();
      } else {
        const response = await fetch('/api/businesses');
        if (!response.ok) throw new Error('Failed to fetch businesses');
        return response.json();
      }
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Filter businesses by open status if needed
  const filteredBusinesses = showOpenOnly 
    ? businesses.filter((b: Business) => b.isOpen)
    : businesses;

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold">Pleasanton Downtown</h1>
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Business Directory
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {filteredBusinesses.length} businesses
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        {/* Business List Sidebar */}
        <div className="w-full lg:w-2/5 xl:w-1/3 bg-card border-r flex flex-col">
          {/* Search and Filter Section */}
          <div className="p-6 border-b bg-muted/50">
            <div className="space-y-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search businesses..."
              />
              
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                showOpenOnly={showOpenOnly}
                onOpenOnlyChange={setShowOpenOnly}
              />
            </div>
          </div>

          {/* Business List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-sm text-muted-foreground">Loading businesses...</p>
                </div>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-muted-foreground">No businesses found.</p>
                  {searchQuery && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredBusinesses.map((business: Business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onClick={() => handleBusinessSelect(business)}
                    isSelected={selectedBusiness?.id === business.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map */}
        <div className="w-full lg:w-3/5 xl:w-2/3 h-[400px] lg:h-full relative">
          <InteractiveMap
            businesses={filteredBusinesses}
            selectedBusiness={selectedBusiness}
            onBusinessSelect={handleBusinessSelect}
          />
        </div>
      </div>
    </div>
  );
}
