import React from 'react';

// Este componente recibe los datos (props) y los muestra.
function AirQualityDisplay({ data }) {

  // 3. Lógica de Visualización (Colores)
  // Determina el color basado en el valor AQI
  const getQualityColor = (aqi) => {
    if (aqi <= 50) {
      return 'quality-good'; // Verde
    } else if (aqi <= 100) {
      return 'quality-moderate'; // Amarillo
    } else {
      return 'quality-bad'; // Rojo
    }
  };

  const qualityClass = getQualityColor(data.aqi);

  // Si no hay datos, no muestra nada
  if (!data) {
    return <p>Escribe una ciudad para ver la calidad del aire.</p>;
  }

  // 4. Renderizado Visual (el "medidor" simple)
  // Usamos la clase de color dinámica en el div "aqi-meter"
  return (
    <div className={`air-quality-card ${qualityClass}`}>
      <h2>Calidad del Aire en: {data.city}</h2>
      
      {/* Este es el medidor visual simple */}
      <div className="aqi-meter">
        <span className="aqi-value">{data.aqi}</span>
        <span className="aqi-label">ICARS</span>
      </div>
      
      <p className="status-text">Nivel: <strong>{data.status}</strong></p>
    </div>
  );
}

export default AirQualityDisplay;