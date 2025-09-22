import React from 'react';
import { getAsset, assetGroups } from '../../imageIndex';
import './style.css';

const ControlCard = ({ 
  type = "light", 
  title, 
  subtitle = "全屋", 
  status = "OFF",
  isOn = false,
  onClick,
  backgroundImage 
}) => {
  const getControlIcon = () => {
    switch(type) {
      case 'light':
        return getAsset('lighting', 'icon');
      case 'climate':
        return getAsset('climate', 'icon');
      case 'curtain':
        return assetGroups.curtainControls.stop;
      default:
        return getAsset('common', 'home');
    }
  };

  const getSwitchIcon = () => {
    return isOn ? assetGroups.switches.on : assetGroups.switches.off;
  };

  return (
    <div className="lanhu-control-card" onClick={onClick}>
      <div className="control-content">
        <div className="control-info">
          <span className="control-title">{title}</span>
          <span className="control-subtitle">{subtitle}</span>
          {backgroundImage && (
            <img 
              className="control-background" 
              src={backgroundImage} 
              alt="background" 
            />
          )}
        </div>
        <span className={`control-status ${isOn ? 'status-on' : 'status-off'}`}>
          {status}
        </span>
        <img 
          className="control-switch" 
          src={getSwitchIcon()} 
          alt="switch" 
        />
      </div>
    </div>
  );
};

export default ControlCard;