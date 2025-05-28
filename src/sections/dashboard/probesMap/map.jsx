import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const iconColors = {
  ok: 'green',
  slow: 'orange',
  fail: 'red'
};

function getAnimatedIcon(status, isSelected) {
  const size = isSelected ? [35, 51] : [25, 41];
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColors[status]}.png`,
    iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColors[status]}.png`,
    shadowUrl: markerShadow,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

const iranCenter = [32.4279, 53.688];

const probes = [
  { id: 1, name: "Probe Tehran", location: "Tehran", position: [35.6892, 51.3890], status: "ok", ip: "192.168.1.1" },
  { id: 2, name: "Probe Mashhad", location: "Mashhad", position: [36.2605, 59.6168], status: "fail", ip: "192.168.1.2" },
  { id: 3, name: "Probe Shiraz", location: "Shiraz", position: [29.5918, 52.5837], status: "slow", ip: "192.168.1.3" },
  { id: 4, name: "Probe Rasht", location: "Rasht", position: [37.2808, 49.5832], status: "ok", ip: "192.168.1.4" },
];


const statusColors = {
  ok: '🟢',
  slow: '🟡',
  fail: '🔴',
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvent('click', () => {
    onMapClick();
  });
  return null;
}

function MapComponent() {
  const markerRefs = useRef([]);
  const intervalId = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [mapCenter, setMapCenter] = useState(iranCenter);
  const [mapZoom, setMapZoom] = useState(5);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 🔸 سایدبار باز یا بسته

  const filteredProbes = probes.filter(probe =>
    probe.name.toLowerCase().includes(searchText.toLowerCase()) ||
    probe.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const openPopup = useCallback(index => {
    const marker = markerRefs.current[index];
    if (marker && marker.openPopup) {
      marker.openPopup();
    }
  }, []);

  const closePopup = useCallback(index => {
    const marker = markerRefs.current[index];
    if (marker && marker.closePopup) {
      marker.closePopup();
    }
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      openPopup(currentIndex);
      return;
    }

    openPopup(currentIndex);

    intervalId.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        closePopup(prevIndex);
        const nextIndex = (prevIndex + 1) % probes.length;
        openPopup(nextIndex);
        setMapCenter(probes[nextIndex].position);
        setMapZoom(6);
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [currentIndex, isPaused, openPopup, closePopup]);

  const handleMarkerClick = useCallback(index => {
    setIsPaused(true);
    setCurrentIndex(index);
    setMapCenter(probes[index].position);
    setMapZoom(10);
    openPopup(index);
  }, [openPopup]);

  const handlePopupClose = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleMapClick = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
    }
  }, [isPaused]);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', position: 'relative' }}>
      
      {/* 🔘 دکمه‌ی باز و بسته کردن سایدبار */}
      <button
        onClick={() => setIsSidebarOpen(prev => !prev)}
        style={{
          position: 'absolute',
          top: 15,
          right: isSidebarOpen ? '280px' : '10px',
          zIndex: 1000,
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'right 0.3s ease'
        }}
      >
        {isSidebarOpen ? '✖' : '☰'}
      </button>

      {/* 📦 سایدبار */}
      <div style={{
        width: isSidebarOpen ? '280px' : '0',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        padding: isSidebarOpen ? '10px' : '0',
        borderRight: isSidebarOpen ? '1px solid #ccc' : 'none',
        boxSizing: 'border-box',
        transition: 'width 0.3s ease, padding 0.3s ease'
      }}>
        {isSidebarOpen && (
          <>
            <h3>لیست پراپ‌ها</h3>
            <input
              type="text"
              placeholder="جستجو..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredProbes.map(probe => {
                const originalIndex = probes.findIndex(p => p.id === probe.id);
                return (
                  <li
                    key={probe.id}
                    onClick={() => {
                      setIsPaused(true);
                      setCurrentIndex(originalIndex);
                      setMapCenter(probe.position);
                      setMapZoom(10);
                      openPopup(originalIndex);
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: '8px',
                      marginBottom: '6px',
                      backgroundColor: currentIndex === originalIndex ? '#d0eaff' : 'transparent',
                      borderRadius: '4px',
                      userSelect: 'none',
                    }}
                  >
                    {statusColors[probe.status]} {probe.name} - {probe.location}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* 🗺 نقشه */}
      <div style={{ flexGrow: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {probes.map((probe, index) => (
            <Marker
              key={probe.id}
              position={probe.position}
              icon={getAnimatedIcon(probe.status, currentIndex === index)}
              ref={el => (markerRefs.current[index] = el)}
              eventHandlers={{
                click: () => handleMarkerClick(index),
              }}
            >
              <Popup eventHandlers={{ close: handlePopupClose }}>
                <strong>{statusColors[probe.status]} {probe.name}</strong><br />
                موقعیت: {probe.location}<br />
                IP: {probe.ip}<br />
                وضعیت: {probe.status}
              </Popup>
            </Marker>
          ))}

          <MapClickHandler onMapClick={handleMapClick} />
          <MapController center={mapCenter} zoom={mapZoom} />
        </MapContainer>
      </div>
    </div>
  );
}

export default MapComponent;
