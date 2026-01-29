"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get('/partners');
        if (response.success) {
          setPartners(response.data);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (partners.length <= 4) return; // Don't auto-slide if there are 4 or fewer partners
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= partners.length ? 0 : nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [partners.length]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Trusted Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Companies that support our mission to empower students from Tier 2 and Tier 3 cities
            </p>
          </div>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null; // Don't show the section if there are no partners
  }

  // Show 4 partners at a time
  const visiblePartners = [];
  for (let i = 0; i < 4; i++) {
    const index = (currentIndex + i) % partners.length;
    visiblePartners.push(partners[index]);
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Trusted Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Companies that support our mission to empower students from Tier 2 and Tier 3 cities
          </p>
        </div>

        {/* Partners Carousel */}
        <div className="relative">
          <div className="flex justify-center items-center space-x-8 md:space-x-12 overflow-hidden">
            {visiblePartners.map((partner, index) => (
              <div 
                key={partner.id} 
                className="flex-shrink-0 flex flex-col items-center transition-all duration-300 hover:scale-105"
              >
                {partner.websiteUrl ? (
                  <a 
                    href={partner.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-32 w-40 md:w-48 overflow-hidden">
                      {partner.imageUrl ? (
                        <img 
                          src={partner.imageUrl} 
                          alt={partner.name} 
                          className="max-h-16 max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/150x80?text=${encodeURIComponent(partner.name.substring(0, 10))}`;
                          }}
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500">
                          {partner.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </a>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-32 w-40 md:w-48 overflow-hidden">
                    {partner.imageUrl ? (
                      <img 
                        src={partner.imageUrl} 
                        alt={partner.name} 
                        className="max-h-16 max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/150x80?text=${encodeURIComponent(partner.name.substring(0, 10))}`;
                        }}
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
                <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">{partner.name}</h3>
                {partner.description && (
                  <p className="text-sm text-gray-600 text-center mt-1">{partner.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          {partners.length > 4 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(partners.length / 4) }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentIndex(dotIndex * 4)}
                  className={`w-3 h-3 rounded-full ${
                    Math.floor(currentIndex / 4) === dotIndex 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Manual navigation buttons (optional) */}
        {partners.length > 4 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentIndex(prev => 
                prev === 0 ? partners.length - 1 : prev - 1
              )}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(prev => 
                prev === partners.length - 1 ? 0 : prev + 1
              )}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;