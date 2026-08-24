import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/713/713311.png', // Delivery truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const warehouseIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942858.png', // Warehouse icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const homeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // Home icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const OrderTrackingMap = ({ orderStatus, shippingAddress }) => {
  // Mock Warehouse Location (e.g., Central Mumbai)
  const origin = [19.0760, 72.8777];
  
  // Destination: We will mock it based on city if possible, but default to somewhere nearby
  const [destination, setDestination] = useState([19.2183, 72.9781]); // Default to Thane
  
  // Current position of truck
  const [currentPos, setCurrentPos] = useState(origin);

  // Calculate truck position based on status
  useEffect(() => {
    // A simple mock destination slightly varied by order to look dynamic
    let destLat = 19.1 + (Math.random() * 0.2);
    let destLng = 72.8 + (Math.random() * 0.2);
    const dest = [destLat, destLng];
    setDestination(dest);

    let initialProgress = 0;
    if (orderStatus === 'shipped') {
      initialProgress = 0.3; // 30% there
    } else if (orderStatus === 'out_for_delivery') {
      initialProgress = 0.8; // 80% there
    } else if (orderStatus === 'delivered') {
      initialProgress = 1.0; // 100% there
    }

    const startPos = [
      origin[0] + (dest[0] - origin[0]) * initialProgress,
      origin[1] + (dest[1] - origin[1]) * initialProgress
    ];
    
    setCurrentPos(startPos);

    // If out for delivery, simulate movement
    let interval;
    if (orderStatus === 'out_for_delivery' || orderStatus === 'shipped') {
      let currentProgress = initialProgress;
      interval = setInterval(() => {
        // Move slightly towards destination
        currentProgress += 0.005; // speed
        if (currentProgress >= 1) currentProgress = 1;
        
        setCurrentPos([
          origin[0] + (dest[0] - origin[0]) * currentProgress,
          origin[1] + (dest[1] - origin[1]) * currentProgress
        ]);

        if (currentProgress >= 1) clearInterval(interval);
      }, 1000); // update every 1 seconds
    }

    return () => clearInterval(interval);
  }, [orderStatus]);

  // Center of the map to fit both points
  const center = [
    (origin[0] + destination[0]) / 2,
    (origin[1] + destination[1]) / 2
  ];

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner" style={{ zIndex: 0 }}>
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} className="h-full w-full" style={{ zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={origin} icon={warehouseIcon}>
          <Popup>Fulfillment Center</Popup>
        </Marker>
        
        <Marker position={destination} icon={homeIcon}>
          <Popup>Delivery Address: {shippingAddress?.city}</Popup>
        </Marker>

        {orderStatus !== 'pending' && orderStatus !== 'confirmed' && orderStatus !== 'packed' && orderStatus !== 'cancelled' && (
          <>
            <Polyline 
              positions={[origin, destination]} 
              color="#4f46e5" 
              weight={4} 
              dashArray="8, 8" 
              opacity={0.6}
            />
            <Polyline 
              positions={[origin, currentPos]} 
              color="#4f46e5" 
              weight={4} 
              opacity={1}
            />
            <Marker position={currentPos} icon={truckIcon}>
              <Popup>
                {orderStatus === 'delivered' ? 'Package Delivered!' : 'Package in transit'}
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default OrderTrackingMap;
