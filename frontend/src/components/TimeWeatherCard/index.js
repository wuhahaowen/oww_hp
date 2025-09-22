import React from 'react';
import Icon from '@mdi/react';
import { 
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiWeatherFog,
  mdiWeatherCloudy,
  mdiWeatherPartlyCloudy,
  mdiWeatherRainy,
  mdiWeatherSnowy,
  mdiWeatherLightning,
  mdiWeatherWindy,
  mdiClock,
} from '@mdi/js';
import { useTheme } from '../../theme/ThemeContext';
import BaseCard from '../BaseCard';
import { useWeather } from '@hakit/core';
import { notification } from 'antd';
import { useLanguage } from '../../i18n/LanguageContext';
import dayjs from 'dayjs';
import Lunar from "lunar-javascript";
import './style.css';

function TimeWeatherCard({ config }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const debugMode = localStorage.getItem('debugMode') === 'true';
  
  let weather = null;
  try {
    if (config.weather_entity_id) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      weather = useWeather(config.weather_entity_id);
    }
  } catch (error) {
    if (debugMode) {
      notification.error({
        message: t('weather.loadError'),
        description: t('weather.loadErrorDesc') + error.message,
        placement: 'topRight',
        duration: 3,
      });
    }
  }

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'clear-night': mdiWeatherNight,
      'sunny': mdiWeatherSunny,
      'fog': mdiWeatherFog,
      'cloudy': mdiWeatherCloudy,
      'partlycloudy': mdiWeatherPartlyCloudy,
      'rainy': mdiWeatherRainy,
      'snowy': mdiWeatherSnowy,
      'lightning': mdiWeatherLightning,
      'windy': mdiWeatherWindy,
    };
    return iconMap[condition] || mdiWeatherCloudy;
  };

  // Get current time
  const now = dayjs();
  const currentTime = now.format(config.timeFormat || 'HH:mm');
  const currentDate = now.format(config.dateFormat || 'YYYY-MM-DD ddd');
  
  // Lunar calendar if enabled
  let lunarInfo = null;
  if (config.showLunar) {
    try {
      const lunar = Lunar.fromDate(now.toDate());
      lunarInfo = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
    } catch (error) {
      console.warn('Lunar calendar calculation failed:', error);
    }
  }

  return (
    <BaseCard
      title={config.title || t('cardTitles.timeWeather')}
      icon={mdiClock}
      titleVisible={config.titleVisible}
      className={`time-weather-card ${config.layout || 'vertical'}`}
    >
      <div className="time-weather-content">
        {/* Time Section */}
        <div className="time-section">
          <div className="current-time">{currentTime}</div>
          <div className="current-date">
            {currentDate}
            {lunarInfo && <span className="lunar-date">{lunarInfo}</span>}
          </div>
        </div>

        {/* Weather Section */}
        {weather && config.weather_entity_id && (
          <div className="weather-section">
            <div className="weather-icon-temp">
              <Icon 
                path={getWeatherIcon(weather.state)} 
                size={config.weatherIconSize || 1.2}
                className="weather-icon"
              />
              <span className="temperature">
                {Math.round(weather.attributes.temperature)}°
              </span>
            </div>
            
            {config.showHumidity && weather.attributes.humidity && (
              <div className="humidity">
                <span className="humidity-icon">💧</span>
                <span>{weather.attributes.humidity}%</span>
              </div>
            )}
            
            {config.showCondition && (
              <div className="weather-condition">
                {t(`weather.conditions.${weather.state}`) || weather.state}
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        {config.showAdditionalInfo && weather && (
          <div className="additional-info">
            {config.showFeelsLike && weather.attributes.apparent_temperature && (
              <div className="feels-like">
                {t('timeWeather.weather.feelsLike')}: {Math.round(weather.attributes.apparent_temperature)}°
              </div>
            )}
            
            {config.showWind && weather.attributes.wind_speed && (
              <div className="wind-info">
                {t('timeWeather.weather.wind.speed')}: {weather.attributes.wind_speed} {weather.attributes.wind_speed_unit || 'km/h'}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}

export default TimeWeatherCard;