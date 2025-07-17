import React, { useState } from 'react';
import { Coffee, Heart } from 'lucide-react';
import CafeCard from './CafeCard';
import LoadingSpinner from '../LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

const CafeList = ({ 
  cafes, 
  isLoading, 
  error, 
  onCafeMapClick, 
  onCafePhoneClick,
  favorites,
  onToggleFavorite,
  isFavorite
}) => {
  const [activeTab, setActiveTab] = useState('all');

  if (isLoading) {
    return <LoadingSpinner message="Searching for cozy cafés..." />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-destructive mb-2">
          <Coffee className="h-12 w-12 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="font-faculty-glyphic text-xl font-bold text-foreground mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-muted-foreground font-playwrite-de-grund text-sm">
          {error}
        </p>
      </div>
    );
  }

  const renderCafeList = (cafesToRender, emptyMessage) => {
    if (!cafesToRender || cafesToRender.length === 0) {
      return (
        <div className="text-center p-8">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-faculty-glyphic text-xl font-bold text-foreground mb-2">
            {emptyMessage.title}
          </h3>
          <p className="text-muted-foreground font-playwrite-de-grund text-sm">
            {emptyMessage.description}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 custom-scrollbar max-h-96 overflow-y-auto">
        {cafesToRender.map((cafe, index) => (
          <CafeCard
            key={cafe.id || index}
            cafe={cafe}
            onMapClick={onCafeMapClick}
            onPhoneClick={onCafePhoneClick}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite(cafe.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="font-faculty-glyphic">
            <Coffee className="h-4 w-4 mr-2" />
            All Cafés
            {cafes && cafes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cafes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="favorites" className="font-faculty-glyphic">
            <Heart className="h-4 w-4 mr-2" />
            Favorites
            {favorites && favorites.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {favorites.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {renderCafeList(
            cafes,
            {
              title: "No cafés found",
              description: "Try adjusting your filters or searching in a different area."
            }
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          {renderCafeList(
            favorites,
            {
              title: "No favorite cafés yet",
              description: "Start exploring and add cafés to your favorites by clicking the heart icon."
            }
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CafeList;

