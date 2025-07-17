import React, { useState } from 'react';
import { Search, MapPin, Loader2, Coffee } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const SearchBar = ({ onSearch, onLocationRequest, onCafeNameSearch, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cafeNameQuery, setCafeNameQuery] = useState('');
  const [activeTab, setActiveTab] = useState('location');

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCafeNameSubmit = (e) => {
    e.preventDefault();
    if (cafeNameQuery.trim()) {
      onCafeNameSearch(cafeNameQuery.trim());
    }
  };

  const handleLocationRequest = () => {
    onLocationRequest();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="location" className="font-faculty-glyphic">
            <MapPin className="h-4 w-4 mr-2" />
            Search by Location
          </TabsTrigger>
          <TabsTrigger value="cafe" className="font-faculty-glyphic">
            <Coffee className="h-4 w-4 mr-2" />
            Search Cafes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="location" className="mt-4">
          <form onSubmit={handleLocationSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter a city, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-playwrite-de-grund"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={!searchQuery.trim() || isLoading}
                className="btn-hover font-faculty-glyphic"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationRequest}
                disabled={isLoading}
                className="btn-hover font-faculty-glyphic"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use my location
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="cafe" className="mt-4">
          <form onSubmit={handleCafeNameSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search cafe by name..."
                  value={cafeNameQuery}
                  onChange={(e) => setCafeNameQuery(e.target.value)}
                  className="pl-10 font-playwrite-de-grund"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={!cafeNameQuery.trim() || isLoading}
                className="btn-hover font-faculty-glyphic"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Coffee className="h-4 w-4 mr-2" />
                )}
                Search Cafes
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchBar;

