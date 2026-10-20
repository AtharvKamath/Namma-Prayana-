import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { Destination } from '../types/travel';
import { useTranslation } from '../i18n/LanguageContext';
import { Compass, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  destinations: Destination[];
  selectedDestination?: Destination | null;
  onSelectDestination?: (dest: Destination) => void;
  className?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  selectedDestination = null,
  onSelectDestination,
  className = 'h-[500px] w-full',
  zoom = 7,
  center = { lat: 14.5, lng: 75.7 },
}) => {
  const { language, t } = useTranslation();
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA-OanlkGCrCzLOKf8QH0HT0UmdcJSpNrM';
  const [activeMarker, setActiveMarker] = useState<Destination | null>(selectedDestination);

  React.useEffect(() => {
    if (selectedDestination) {
      setActiveMarker(selectedDestination);
    }
  }, [selectedDestination]);

  const currentCenter = selectedDestination
    ? { lat: selectedDestination.lat, lng: selectedDestination.lng }
    : center;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm bg-stone-100 ${className}`}>
      {/* Top Map Controls Header */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2">
        <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
        <span className="text-xs font-semibold text-stone-800">
          {language === 'kn' 
            ? `ಕರ್ನಾಟಕ ಪ್ರವಾಸ ನಕ್ಷೆ (${destinations.length} ಪರಿಶೀಲಿಸಿದ ತಾಣಗಳು)`
            : `Karnataka Explorer Map (${destinations.length} verified destinations)`}
        </span>
      </div>

      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={currentCenter}
          center={currentCenter}
          defaultZoom={zoom}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {destinations.map((dest) => (
            <AdvancedMarker
              key={dest.id}
              position={{ lat: dest.lat, lng: dest.lng }}
              onClick={() => {
                setActiveMarker(dest);
                onSelectDestination?.(dest);
              }}
              title={language === 'kn' ? dest.kannadaName : dest.name}
            >
              <Pin
                background={activeMarker?.id === dest.id ? '#059669' : '#0f4c5c'}
                borderColor="#ffffff"
                glyphColor="#ffffff"
                scale={activeMarker?.id === dest.id ? 1.25 : 1.0}
              />
            </AdvancedMarker>
          ))}

          {activeMarker && (
            <InfoWindow
              position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-1 max-w-[240px]">
                <div 
                  className="cursor-pointer group relative overflow-hidden rounded-lg mb-2"
                  onClick={() => onSelectDestination?.(activeMarker)}
                >
                  <img
                    src={activeMarker.imageUrl}
                    alt={activeMarker.name}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (activeMarker.gallery?.[0] && target.src !== activeMarker.gallery[0]) {
                        target.src = activeMarker.gallery[0];
                      } else {
                        target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%230f4c5c"/><text x="150" y="75" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">ನಮ್ಮ ಪ್ರಯಾಣ · Namma Prayana</text></svg>';
                      }
                    }}
                  />
                  {activeMarker.imageAttribution && (
                    <span className="text-[9px] text-stone-400 block mt-1 truncate" title={activeMarker.imageAttribution}>
                      📷 {activeMarker.imageAttribution}
                    </span>
                  )}
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => onSelectDestination?.(activeMarker)}
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <h4 className="font-bold text-stone-900 text-sm leading-tight hover:text-emerald-700 transition-colors">
                      {language === 'kn' ? activeMarker.kannadaName : activeMarker.name}
                    </h4>
                    <span className="text-[11px] font-kannada text-emerald-700 font-semibold">
                      {language === 'kn' ? activeMarker.name : activeMarker.kannadaName}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {language === 'kn' ? `${activeMarker.district} ಜಿಲ್ಲೆ` : `${activeMarker.district} District`} · {activeMarker.region}
                  </p>
                </div>
                <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                  {language === 'kn' && activeMarker.taglineKn ? activeMarker.taglineKn : activeMarker.tagline}
                </p>

                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onSelectDestination?.(activeMarker)}
                    className="font-bold text-[#0f4c5c] hover:underline cursor-pointer"
                  >
                    {language === 'kn' ? 'ಪೂರ್ಣ ಮಾಹಿತಿ' : 'View Details →'}
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeMarker.lat},${activeMarker.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1"
                  >
                    <span>{t('modalGetDirections')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
