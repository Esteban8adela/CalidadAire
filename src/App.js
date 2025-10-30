import React, { useState } from 'react';
import './App.css';
import AirQualityDisplay from './AirQualityDisplay';

function App() {
  //Simulación de datos
  //conectar al backend en Node.js
  const [airData, setAirData] = useState({
    city: "Guadalajara",
    aqi: 80, // Índice de Calidad del Aire (AQI)
  });

  // agregar busqueda de ciudad o selección en mapa

  return (
    <div className="App">
      <header className="App-header">
        <h1>Visor de Calidad del Aire Comunitario</h1>
      </header>
      <main>
        <AirQualityDisplay data={airData} />
      </main>
    </div>
  );
}

export default App;