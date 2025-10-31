import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import './App.css';
import AirQualityDisplay from './AirQualityDisplay';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// icono del mapa
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl; // elimina el marcador default

L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
});

// clicks en el mapa
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      // Llama a la función que le pasamos con las coordenadas
      onMapClick(e.latlng);
    },
  });
  return null; // No renderiza nada, solo escucha eventos
}


function App() {
  
  const [cityInput, setCityInput] = useState(""); 
  const [airData, setAirData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // posicion del marcador en el mapa
  // no hay marcador al principio
  const [markerPosition, setMarkerPosition] = useState(null);

  
  // llamar a la API del backend
  const fetchAirQuality = async (url) => {
    setIsLoading(true);
    setError(null);
    setAirData(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudieron obtener los datos.');
      }
      const data = await response.json();
      setAirData(data);
      // marcador a nueva ubicación
      setMarkerPosition([data.latitude, data.longitude]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  
  //busqueda por texto
  const handleSearch = () => {
    fetchAirQuality(`http://localhost:4000/api/air-quality?city=${cityInput}`);
  };

  
  // busqueda por mapa
  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    fetchAirQuality(`http://localhost:4000/api/air-quality?lat=${lat}&lon=${lng}`);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Visor de Calidad del Aire Comunitario</h1>
      </header>
    
      <div className="search-container">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Escribe una ciudad y presiona 'Buscar'"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      
      <p>Escribe una ciudad para ver la calidad del aire.</p>
      <p>O haz clic en el mapa para seleccionar una ubicación:</p>

      {/* mapa interactivo */}
      <MapContainer 
        center={[20.66, -103.39]} // Centrado inicial en GDL
        zoom={10} 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* si hay una posicion muestra el pin */}
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>

      
      <main>
        {/* resultados*/}
        {error && <p className="error-message">{error}</p>}
        <AirQualityDisplay data={airData} />
      </main>
    </div>
  );
}

export default App;