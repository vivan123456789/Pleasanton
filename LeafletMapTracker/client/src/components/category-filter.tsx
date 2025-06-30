import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showOpenOnly: boolean;
  onOpenOnlyChange: (showOpenOnly: boolean) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showOpenOnly,
  onOpenOnlyChange
}: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="min-w-0 flex-shrink-0 w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex space-x-2 overflow-x-auto">
        <Button
          size="sm"
          variant={showOpenOnly ? "default" : "secondary"}
          onClick={() => onOpenOnlyChange(!showOpenOnly)}
          className={cn(
            "whitespace-nowrap transition-colors",
            showOpenOnly 
              ? "bg-primary text-white hover:bg-blue-700" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          Open Now
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="whitespace-nowrap bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Top Rated
        </Button>
      </div>
    </div>
  );
}
