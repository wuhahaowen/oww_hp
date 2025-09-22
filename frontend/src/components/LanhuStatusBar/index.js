import React from 'react';
import { getAsset } from '../../imageIndex';
import './style.css';

const StatusBar = ({ 
  time = "9:41", 
  date = "Mon Jun 10", 
  batteryLevel = "100%" 
}) => {
  return (
    <div className="lanhu-status-bar">
      <span className="status-time">{time}</span>
      <span className="status-date">{date}</span>
      <div className="status-right">
        <div className="signal-bars">
          <div className="signal-bar" />
          <div className="signal-bar" />
        </div>
        <span className="battery-level">{batteryLevel}</span>
        <img 
          className="battery-icon" 
          src={getAsset('common', 'battery')} 
          alt="battery" 
        />
      </div>
    </div>
  );
};

export default StatusBar;