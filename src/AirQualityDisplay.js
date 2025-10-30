import React from 'react';

function AirQualityDisplay({ data }) {

  // --- LÓGICA DE NIVELES Y COLORES ACTUALIZADA ---

  // Devuelve el *texto* del estado
  const getStatusText = (aqi) => {
    if (aqi <= 55) return 'Bueno';
    if (aqi <= 70) return 'Moderado';
    if (aqi <= 85) return 'Nocivo (Grupos Sensibles)';
    if (aqi <= 105) return 'Nocivo';
    if (aqi <= 200) return 'Muy Nocivo';
    return 'Peligroso';
  };

  // Devuelve la *clase CSS* para el color
  const getQualityClass = (aqi) => {
    if (aqi <= 55) return 'quality-good';       // Verde
    if (aqi <= 70) return 'quality-moderate';   // Amarillo
    if (aqi <= 85) return 'quality-unhealthy-sensitive'; // Naranja
    if (aqi <= 105) return 'quality-unhealthy';  // Rojo - naranja
    if (aqi <= 200) return 'quality-very-unhealthy'; // Rojo
    return 'quality-hazardous';            // Morado
  };

  // Si no hay datos (cuando la app carga por primera vez)
  if (!data || data.aqi === null) {
    return <p>Escribe una ciudad para ver la calidad del aire.</p>;
  }

  // Obtenemos los valores dinámicos
  const qualityClass = getQualityClass(data.aqi);
  const statusText = getStatusText(data.aqi);
  const cityName = data.city || "Ubicación";

  return (
    // Usamos la clase de color dinámica
    <div className={`air-quality-card ${qualityClass}`}>
      <h2>Calidad del Aire en: {cityName}</h2>
      
      <div className="aqi-meter">
        <span className="aqi-value">{data.aqi}</span>
        <span className="aqi-label">AQI (US)</span>
      </div>
      
      <p className="status-text">Nivel: <strong>{statusText}</strong></p>
    </div>
  );
}

export default AirQualityDisplay;