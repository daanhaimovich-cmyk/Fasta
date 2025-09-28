import React, { useEffect, useRef } from 'react';
import type { Trainer } from '../types';

const TrainerMap: React.FC<{ trainers: Trainer[] }> = ({ trainers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
          scrollWheelZoom: false,
      }).setView([31.7683, 35.2137], 7); // Centered on Israel

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
    }
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const trainersWithCoords = trainers.filter(t => t.coordinates);

    if (trainersWithCoords.length === 0) {
        mapRef.current.setView([31.7683, 35.2137], 7);
        return;
    }

    const markerBounds = L.latLngBounds([]);
    trainersWithCoords.forEach(trainer => {
      if (trainer.coordinates) {
        const popupContent = `
            <div style="font-family: sans-serif; color: #e2e8f0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${trainer.photoUrl}" alt="${trainer.name}" style="width: 60px; height: 60px; border-radius: 9999px; object-fit: cover; border: 2px solid #10b981;" />
                    <div>
                        <h3 style="font-weight: 700; font-size: 1.1rem; color: #fff; margin: 0 0 4px 0;">${trainer.name}</h3>
                        <p style="margin: 0; color: #94a3b8; font-size: 0.8rem;">${trainer.specialties.slice(0, 2).join(', ')}</p>
                    </div>
                </div>
                <div style="display:flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                    <p style="font-weight: 600; font-size: 1rem; color: #fff; margin:0;">₪${trainer.hourlyRate}/hr</p>
                    <a href="#" style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Profile</a>
                </div>
            </div>`;
        
        const customIcon = L.divIcon({
            html: `<span class="flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>`,
            className: '',
            iconSize: [12, 12],
        });

        const marker = L.marker([trainer.coordinates.lat, trainer.coordinates.lng], { icon: customIcon }).addTo(mapRef.current);
        
        marker.bindPopup(popupContent, { className: 'custom-popup' });
        markersRef.current.push(marker);
        markerBounds.extend([trainer.coordinates.lat, trainer.coordinates.lng]);
      }
    });

    // Fit map to markers
    if (markerBounds.isValid()) {
      mapRef.current.fitBounds(markerBounds, { padding: [50, 50], maxZoom: 14 });
    }

  }, [trainers]);

  return <div ref={mapContainerRef} className="h-[75vh] w-full rounded-lg z-0" />;
};

export default TrainerMap;