import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const distanceOptions = [
    { value: '500', label: '500m' },
    { value: '1000', label: '1km' },
    { value: '2000', label: '2km' },
    { value: '5000', label: '5km' }
  ];

  return (
    <div className="filter-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-amatic text-xl font-bold text-foreground">
            Filters
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="md:hidden"
          >
            {isCollapsed ? 'Show' : 'Hide'}
          </Button>
        </div>
      </div>

      <div className={`space-y-4 ${isCollapsed ? 'hidden md:block' : 'block'}`}>
        {/* Distance Filter */}
        <div className="space-y-2">
          <Label htmlFor="distance" className="font-merriweather font-medium">
            Maximum distance
          </Label>
          <Select
            value={filters.distance}
            onValueChange={(value) => onFilterChange('distance', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              {distanceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opening Hours Filter */}
        <div className="space-y-2">
          <Label className="font-merriweather font-medium">
            Opening hours
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="openNow"
                checked={filters.openNow}
                onCheckedChange={(checked) => onFilterChange('openNow', checked)}
              />
              <Label htmlFor="openNow" className="font-merriweather text-sm">
                Open now
              </Label>
            </div>
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="space-y-2">
          <Label className="font-merriweather font-medium">
            Amenities
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wifi"
                checked={filters.wifi}
                onCheckedChange={(checked) => onFilterChange('wifi', checked)}
              />
              <Label htmlFor="wifi" className="font-merriweather text-sm">
                WiFi
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="outdoor"
                checked={filters.outdoor}
                onCheckedChange={(checked) => onFilterChange('outdoor', checked)}
              />
              <Label htmlFor="outdoor" className="font-merriweather text-sm">
                Outdoor seating
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="takeaway"
                checked={filters.takeaway}
                onCheckedChange={(checked) => onFilterChange('takeaway', checked)}
              />
              <Label htmlFor="takeaway" className="font-merriweather text-sm">
                Takeaway
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

