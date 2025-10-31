const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

// cofig
const app = express();
const PORT = 4000;
app.use(cors());

// api point para calidad del aire
app.get('/api/air-quality', async (req, res) => {
  
  const { city, lat, lon } = req.query;

  try {
    let latitude, longitude, cityName;

    if (city) {
      // se busca por ciudad
      console.log(`(Backend) Buscando por ciudad: ${city}`);
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=es&format=json`;
      
      const geoResponse = await fetch(geocodingUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        console.log(`(Backend) Ciudad no encontrada: ${city}`);
        return res.status(404).json({ error: 'Ciudad no encontrada. Intenta con otro nombre.' });
      }

      const location = geoData.results[0];
      latitude = location.latitude;
      longitude = location.longitude;
      cityName = location.name;

    } else if (lat && lon) {
      //se busca por mapa
      console.log(`(Backend) Buscando por coordenadas: Lat ${lat}, Lon ${lon}`);
      latitude = lat;
      longitude = lon;
      
      const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=es`;
      
      const fetchOptions = {
        headers: {
          'User-Agent': 'VisorCalidadAireComunitario/1.0 (tu-email@ejemplo.com)'
        }
      };

      const reverseGeoResponse = await fetch(reverseGeoUrl, fetchOptions);
      const reverseGeoData = await reverseGeoResponse.json();

      //address
      if (reverseGeoData.address) {
        if (reverseGeoData.address.city) {
          cityName = reverseGeoData.address.city;
        } else if (reverseGeoData.address.municipality) {
          cityName = reverseGeoData.address.municipality;
        } else if (reverseGeoData.address.state) {
          cityName = reverseGeoData.address.state;
        } else if (reverseGeoData.address.country) {
          cityName = reverseGeoData.address.country;
        } else {
          cityName = "Ubicación seleccionada"; // Fallback
        }
      } else {
        cityName = "Ubicación seleccionada";
      }
      
      console.log(`(Backend) Nombre encontrado por coords: ${cityName}`);

    } else {
      //error si no hay parametros
      return res.status(400).json({ error: 'Se requiere el parámetro "city" o "lat" y "lon".' });
    }

    //obtener AQI
    console.log(`(Backend) Obteniendo AQI para Coordenadas: Lat ${latitude}, Lon ${longitude}`);
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&timezone=auto`;

    const aqResponse = await fetch(airQualityUrl);
    const aqData = await aqResponse.json();

    const currentAqi = aqData.hourly.us_aqi[0];
    console.log(`(Backend) AQI (US) actual: ${currentAqi}`);

    //response
    res.json({
      city: cityName,
      aqi: currentAqi,
      latitude: latitude,
      longitude: longitude
    });

  } catch (error) {
    console.error('(Backend) Error en el servidor:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
  }
});

// iniciar sewrver
app.listen(PORT, () => {
  console.log(`Servidor de backend corriendo en http://localhost:${PORT}`);
});