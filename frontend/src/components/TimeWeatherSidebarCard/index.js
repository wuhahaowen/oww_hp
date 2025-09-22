import React, { useState, useEffect } from 'react';
import { useWeather } from '@hakit/core';
import { useLanguage } from '../../i18n/LanguageContext';
import { getAsset } from '../../imageIndex';
import dayjs from 'dayjs';
import Lunar from "lunar-javascript";
import './style.css';
import {renderIcon} from "../../common/SvgIndex";
import {Icon} from '@iconify/react';

function TimeWeatherSidebarCard({ 
  currentTime, 
  timeCardConfig,
  weatherConfig = { entity_id: 'weather.home' }
}) {
  const { t } = useLanguage();
  const [lunarDate, setLunarDate] = useState('');
  const [weekday, setWeekday] = useState('');

  // Get weather data - always call hook at top level
  const weather = useWeather(weatherConfig?.entity_id || 'weather.dummy', { returnNullIfNotFound: true });

  // Get weather icon
  const getWeatherIcon = (condition) => {
    const iconMap = {
      'mdi:weather-night': renderIcon('weather','mdiWeatherNight'),
      'mdi:weather-sunny': renderIcon('weather', 'mdiWeatherSunny'),
      'mdi:weather-fog': renderIcon('weather', 'mdiWeatherFog'),
      'mdi:weather-cloudy': renderIcon('weather', 'mdiWeatherCloudy'),
      'mdi:weather-partly-cloudy': renderIcon('weather', 'mdiWeatherPartlyCloudy'),
      'mdi:weather-rainy': renderIcon('weather', 'mdiWeatherRainy'),
      'mdi:weather-snowy': renderIcon('weather', 'mdiWeatherSnowy'),
      'mdi:weather-lightning': renderIcon('weather', 'mdiWeatherLightning'),
      'mdi:weather-windy': renderIcon('weather', 'mdiWeatherWindy'),
    };
    return iconMap[condition] || renderIcon('weather', 'mdiWeatherNight');
  };

  // Update lunar and weekday information
  useEffect(() => {
    if (!currentTime) return;
    
    const weekday = currentTime.format('dddd');
    setWeekday(t(`weekday.${weekday}`));
    
    try {
      const lunar = Lunar.Lunar.fromDate(currentTime.toDate());
      const yearZhi = lunar.getYearShengXiao();
      setLunarDate(`${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}(${yearZhi}年)`);
    } catch (error) {
      console.warn('Failed to calculate lunar date:', error);
    }
  }, [currentTime, t]);

  if (!currentTime || !timeCardConfig) {
    return <div className="time-weather-sidebar-card error">Time configuration missing</div>;
  }

  return (
      // 修改类名以避免与 control-panel 冲突，添加 time-weather-sidebar-card 前缀
      <div className="time-weather-sidebar-card-box flex-col">
        <div className="time-weather-sidebar-card-group flex-row justify-between">
          <img
              className="time-weather-sidebar-card-home-icon"
              src={getAsset('common', 'header')}
          />
          <span className="time-weather-sidebar-card-home-title">阳先生的家</span>
        </div>
        <div className="time-weather-sidebar-card-time-group flex-row justify-between">
          <span className="time-weather-sidebar-card-current-time">  {currentTime.format(timeCardConfig.timeFormat || 'HH:mm')}</span>
         <Icon  icon={getWeatherIcon(weather.attributes?.icon)}  className="time-weather-sidebar-card-weather-icon" />
          {/*<img*/}
          {/*    className="time-weather-sidebar-card-weather-icon"*/}
          {/*    src={getWeatherIcon(weather.attributes?.icon)}*/}
          {/*/>*/}
        </div>
        <div className="time-weather-sidebar-card-date-group flex-row">
          <span className="time-weather-sidebar-card-date">{currentTime.format(timeCardConfig.dateFormat || 'YYYY-MM-DD')} {weekday}</span>
          <img
              className="time-weather-sidebar-card-temp-icon"
              src={getAsset('sensors', 'temperature')}
          />
          <span className="time-weather-sidebar-card-temperature">{weather.attributes.temperature}℃</span>
          <img
              className="time-weather-sidebar-card-humidity-icon"
              src={getAsset('sensors', 'humidity')}
          />
          <span className="time-weather-sidebar-card-humidity">{weather.attributes.humidity}%</span>
        </div>
      </div>
  );
}

export default TimeWeatherSidebarCard;