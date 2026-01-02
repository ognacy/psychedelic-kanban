/**
 * Weather Component
 *
 * Displays current weather conditions based on user's geolocation.
 *
 * Design Choices:
 * - Open-Meteo API: Free, no API key required, generous rate limits
 * - Browser Geolocation API: Native, no external dependencies
 * - Graceful degradation: Shows helpful error messages instead of crashing
 * - Weather codes mapped to readable strings for better UX
 */

import { useState, useEffect } from 'react';
import './Weather.css';

/**
 * Weather data structure from Open-Meteo API (simplified).
 */
interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
}

/**
 * WMO Weather Codes mapped to human-readable descriptions.
 *
 * Design Choice: Using a static lookup table instead of API-provided
 * descriptions for consistent styling and offline capability.
 * Only common codes are included; rare codes fall back to "UNKNOWN".
 *
 * @see https://open-meteo.com/en/docs#weathervariables
 */
const WEATHER_CODES: Record<number, string> = {
  0: 'CLEAR',
  1: 'MAINLY CLEAR',
  2: 'PARTLY CLOUDY',
  3: 'OVERCAST',
  45: 'FOG',
  48: 'RIME FOG',
  51: 'LIGHT DRIZZLE',
  53: 'DRIZZLE',
  55: 'DENSE DRIZZLE',
  61: 'LIGHT RAIN',
  63: 'RAIN',
  65: 'HEAVY RAIN',
  71: 'LIGHT SNOW',
  73: 'SNOW',
  75: 'HEAVY SNOW',
  77: 'SNOW GRAINS',
  80: 'LIGHT SHOWERS',
  81: 'SHOWERS',
  82: 'HEAVY SHOWERS',
  85: 'LIGHT SNOW SHOWERS',
  86: 'SNOW SHOWERS',
  95: 'THUNDERSTORM',
  96: 'THUNDERSTORM + HAIL',
  99: 'THUNDERSTORM + HEAVY HAIL',
};

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetch weather data from Open-Meteo API.
     *
     * Design Choice: Using the "current" endpoint for real-time data
     * instead of forecast. Parameters request only the fields we display.
     */
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`
        );
        const data = await response.json();

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
        });
        setLoading(false);
      } catch {
        setError('WEATHER DATA UNAVAILABLE');
        setLoading(false);
      }
    };

    /**
     * Request user's location via Geolocation API.
     *
     * Design Choices:
     * - Check for API support first (older browsers may not have it)
     * - Handle permission denial gracefully with user-friendly message
     * - Single location request (not watching for updates) to save battery
     */
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // User denied permission or location unavailable
          setError('LOCATION ACCESS DENIED');
          setLoading(false);
        }
      );
    } else {
      setError('GEOLOCATION NOT SUPPORTED');
      setLoading(false);
    }
  }, []); // Empty deps = run once on mount

  /**
   * Convert WMO weather code to display string.
   */
  const getWeatherDescription = (code: number): string => {
    return WEATHER_CODES[code] || 'UNKNOWN';
  };

  // Loading state
  if (loading) {
    return (
      <div className="weather crt-text-dim">
        {'// '} FETCHING WEATHER DATA...
      </div>
    );
  }

  // Error state - show message but don't break the app
  if (error) {
    return (
      <div className="weather crt-text-dim">
        {'// '} {error}
      </div>
    );
  }

  // No data (shouldn't happen, but handle gracefully)
  if (!weather) return null;

  // Success state - display weather info
  return (
    <div className="weather crt-text-dim">
      <span className="weather__temp">{weather.temperature}°C</span>
      <span className="weather__separator">|</span>
      <span className="weather__condition">{getWeatherDescription(weather.weatherCode)}</span>
      <span className="weather__separator">|</span>
      <span className="weather__wind">WIND: {weather.windSpeed} KM/H</span>
    </div>
  );
}
