import React, { useState } from 'react';
import './App.css';
import AirQualityDisplay from './AirQualityDisplay';

function App() {
  // 1. Simulación de datos (Mock Data)
  // En el futuro, estos datos vendrán de tu backend (Node.js)
  // después de que el usuario busque una ciudad.
  const [airData, setAirData] = useState({
    city: "Guadalajara",
    aqi: 25, // Índice de Calidad del Aire (AQI)
    status: "Aceptable"
  });

  // Por ahora, no hay función de búsqueda, solo mostramos los datos simulados.

  return (
    <div className="App">
      <header className="App-header">
        <h1>Visor de Calidad del Aire Comunitario</h1>
      </header>
      
      {/* Aquí iría el componente de búsqueda (el input o mapa).
        Por ahora, lo saltamos para este avance rápido.
      */}
      
      {/* 2. Componente de visualización */}
      <main>
        <AirQualityDisplay data={airData} />
      </main>
    </div>
  );
}

export default App;