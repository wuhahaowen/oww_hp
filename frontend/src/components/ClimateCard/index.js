import React, { useState } from 'react';
import BaseCard from '../BaseCard';
import Icon from '@mdi/react';
import { Icon as Icon2 } from '@iconify/react';

// import { useHass } from '@hakit/core';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  mdiThermometer, 
  mdiWaterPercent, 
  mdiPower, 
  mdiFan, 
  mdiAirConditioner,
  mdiSnowflake,
  mdiWaterPercent as mdiDry,
  mdiFan as mdiFanOnly,
  mdiFireCircle,
  mdiPowerOff,
  mdiArrowOscillating,
  mdiMinus,
  mdiPlus,
  mdiLeaf,
  mdiPowerSleep,
  mdiHeatingCoil,
  mdiAirFilter,
  mdiAirPurifier,
} from '@mdi/js';
import { Popup, List } from 'antd-mobile';
import './style.css';
import { useEntity } from '@hakit/core';
import { notification } from 'antd';
import {renderIcon} from "../../common/SvgIndex";


// 图标映射
const ICON_MAP = {
  mdiLeaf,
  mdiPowerSleep,
  mdiHeatingCoil,
  mdiAirFilter,
  mdiAirPurifier,
};


function ClimateCard({ 
  config,
  titleVisible
}) {
  const { t } = useLanguage();
  const climate = useEntity(config?.entity_id || '', {returnNullIfNotFound: true});

  const target_temp_step = climate?.attributes?.target_temp_step;
  const tempSensor = useEntity(config?.temperature_entity_id || '', {returnNullIfNotFound: true});
  const humiditySensor = useEntity(config?.humidity_entity_id || '', {returnNullIfNotFound: true});
  const currentShowTemp = tempSensor?.state || climate?.attributes?.current_temperature;
  const currentShowHumidity = humiditySensor?.state || climate?.attributes?.current_humidity;
  const [showFanModes, setShowFanModes] = useState(false);
  const [showSwingModes, setShowSwingModes] = useState(false);
  const [showHvacModes, setShowHvacModes] = useState(false);
  const debugMode = localStorage.getItem('debugMode') === 'true';

  const changeClimateIcon = (mode) => {

   const  icon  = renderIcon('climate',mode);
    return  icon;
  };

  // 处理空调实体未找到的情况
  if (!climate) {
    if (debugMode) {
      notification.error({
        message: t('climate.loadError'),
        description: `${t('climate.loadErrorDesc')} ${config.entity_id}`,
        placement: 'topRight',
        duration: 3,
        key: 'ClimateCard',
      });
    }
    return <BaseCard 
      title={config.name || t('cardTitles.climate')} 
      icon={mdiAirConditioner}
    >
      {t('climate.loadFailed')}
    </BaseCard>;
  }

  // 处理特性实体
  const features = {};
  if (config.features) {
    Object.entries(config.features).forEach(([key, feature]) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const entity = useEntity(feature.entity_id, {returnNullIfNotFound: true});
      if (entity) {
        features[key] = {
          name: feature.name,
          icon: feature.icon,
          disableWhen: feature.disableWhen,
          enableWhen: feature.enableWhen,
          entity: entity,
        };
      } else {
        if (debugMode) {
          notification.error({
            message: t('climate.featureLoadError'),
            description: `${t('climate.featureLoadErrorDesc')} ${feature.entity_id}`,
            placement: 'topRight',
            duration: 3,
            key: 'ClimateCard',
          });
        }
      }
    });
  }

  // const { getServices } = useHass();
  // const [services, setServices] = useState(null);
  // useEffect(() => {
  //   async function fetchServices() {
  //     const services = await getServices();
  //     setServices(services);
  //   }
  //   fetchServices();
  // }, []);
  // console.log(services);

  const isOn = climate?.state !== 'off';
  const targetTemp = climate?.attributes?.temperature;
  const fanMode = climate?.attributes?.fan_mode;
  const fanModes = climate?.attributes?.fan_modes || [];
  const swingMode = climate?.attributes?.swing_mode;
  const swingModes = climate?.attributes?.swing_modes || [];

  const handlePowerClick = () => {
    if (climate?.service) {
      climate.service.toggle();
    }
  };

  const handleFanModeChange = (mode) => {
    if (climate?.service) {
      climate.service.set_fan_mode({ serviceData: { "fan_mode": mode } });
    }
    setShowFanModes(false);
  };

  const handleSwingModeChange = (mode) => {
    if (climate?.service) {
      climate.service.set_swing_mode({ serviceData: { "swing_mode": mode } });
    }
    setShowSwingModes(false);
  };

  const handleTempChange = (delta) => {
    if (climate?.service && isOn) {
      const minTemp = climate.attributes.min_temp;
      const maxTemp = climate.attributes.max_temp;
      const step = climate.attributes.target_temp_step;
      const currentTemp = climate.attributes.temperature;
      
      const newTemp = Math.round((currentTemp + delta) / step) * step;
      
      if (newTemp >= minTemp && newTemp <= maxTemp) {
        climate.service.set_temperature({ serviceData: { "temperature": newTemp } });
      }
    }
  };

  const getSwingModeLabel = (mode) => {
    return t(`climate.swingModes.${mode}`);
  };

  const getHvacModeLabel = (mode) => {
    return t(`climate.hvacModes.${mode}`);
  };

  const getHvacModeIcon = (mode) => {
    switch (mode) { 
      case 'cool':
        return changeClimateIcon('mdiSnowflake') ;
      case 'dry':
        return changeClimateIcon('mdiSnowflake');
      case 'fan_only':
        return changeClimateIcon('mdiSnowflake');
      case 'heat':
        return changeClimateIcon('mdiSnowflake');
      case 'off':
        return changeClimateIcon('mdiSnowflake');
      default:
        return changeClimateIcon('mdiSnowflake');
    }
  };

  const handleHvacModeChange = (mode) => {
    if (climate?.service) {
      if (mode === 'off') {
        climate.service.turn_off();
      } else {
        climate.service.set_hvac_mode({ serviceData: {"hvac_mode": mode } });
      }
    }
    setShowHvacModes(false);
  };

  const canAdjustTemperature = (mode) => {
    return mode === 'cool' || mode === 'heat';
  };

  return (
    <BaseCard
      title={config.name || t('cardTitles.climate')}
      titleVisible={titleVisible}
      icon={mdiAirConditioner}
      headerRight={
        <button 
          className={`power-button ${!isOn ? 'off' : ''}`} 
          onClick={handlePowerClick}
          title={t('climate.power')}
        >
          <Icon path={mdiPower} size={14} />
        </button>
      }
    >
      <div className="climate-content">
        <div className="climate-status">
          <div className="climate-readings">
            <div className="reading">
              <div className="reading-label">
                <Icon2 icon={changeClimateIcon('mdiThermometer')} size={48}  />
                <span>{t('climate.currentTemp')}</span>
              </div>
              <div className="reading-value">
                <span className="value">{currentShowTemp || '--'}</span>
                <span className="unit">°C</span>
              </div>
            </div>
            <div className="reading">
              <div className="reading-label">
                <Icon2 icon={changeClimateIcon('mdiWaterPercent')} size={12} />
                <span>{t('climate.currentHumidity')}</span>
              </div>
              <div className="reading-value">
                <span className="value">{currentShowHumidity || '--'}</span>
                <span className="unit">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="climate-circle">
          <button
            className="temp-button"
            onClick={() => handleTempChange(target_temp_step)}
            disabled={!isOn || !canAdjustTemperature(climate?.state) || (targetTemp >= climate?.attributes?.max_temp)}
          >
            <Icon path={mdiMinus} size={14} />
          </button>
          <div className={`target-temp ${!isOn || !canAdjustTemperature(climate?.state) ? 'disabled' : ''}`}>
            <span className="temp-value">{targetTemp?.toFixed(1) || '--'}</span>
            <span className="temp-unit">°C</span>
          </div>
          <button
            className="temp-button"
            onClick={() => handleTempChange(-target_temp_step)}
            disabled={!isOn || !canAdjustTemperature(climate?.state) || (targetTemp <= climate?.attributes?.min_temp)}
          >
            <Icon path={mdiPlus} size={14} />
          </button>
        </div>


        <div className="climate-controls">
          <button
              className="mode-button"
              onClick={() => setShowHvacModes(true)}
          >
            <Icon2 icon={getHvacModeIcon(climate?.state)} size={14}/>
            <span>{t('climate.operationMode')}</span>
            <span className="mode-value">{getHvacModeLabel(climate?.state)}</span>
          </button>
          <button
              className="mode-button"
              onClick={() => setShowFanModes(true)}
              disabled={!isOn}
          >
            <Icon2 icon={changeClimateIcon('mdiPowerOff')} size={14}/>
            <span>{t('climate.fanMode')}</span>
            <span className="mode-value">{fanMode}</span>
          </button>
          <button
              className="mode-button"
              onClick={() => setShowSwingModes(true)}
              disabled={!isOn}
          >
            <Icon2 icon={changeClimateIcon('mdiFanOnly')} size={14}/>
            <span>{t('climate.swingMode')}</span>
            <span className="mode-value">{getSwingModeLabel(swingMode)}</span>
          </button>
        </div>

        <div className="climate-functions">
          {Object.entries(features).map(([key, feature]) => {
            let isDisabled = feature?.disableWhen?.state === climate?.state;
            if (feature?.enableWhen?.mode) {
              isDisabled = feature?.enableWhen?.mode !== climate?.state;
            }
            const isActive = feature.entity?.state === 'on';
            
            return (
              <button 
                key={key}
                className={`function-button ${isActive ? 'active' : ''}`}
                onClick={() => feature.entity?.service?.toggle()}
                disabled={isDisabled}
              >
                <Icon2 icon={changeClimateIcon(feature.icon)} size={14} />
                <span>{feature.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Popup
        visible={showFanModes}
        onMaskClick={() => setShowFanModes(false)}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '40vh',
          maxHeight: '80vh',
          backgroundColor: 'var(--color-background)',
        }}
      >
        <div className="fan-mode-popup">
          <div className="popup-header">
            <h3>{t('climate.fanMode')}</h3>
            <Icon path={mdiFan} size={14} />
          </div>
          <List>
            {fanModes.map((mode) => (
              <List.Item
                key={mode}
                onClick={() => handleFanModeChange(mode)}
                className={fanMode === mode ? 'active-mode' : ''}
              >
                {t(`climate.fanModes.${mode}`)}
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>

      <Popup
        visible={showSwingModes}
        onMaskClick={() => setShowSwingModes(false)}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '40vh',
          maxHeight: '80vh',
        }}
      >
        <div className="fan-mode-popup">
          <div className="popup-header">
            <h3>{t('climate.swingMode')}</h3>
            <Icon path={mdiFan} size={14} className="rotate-90" />
          </div>
          <List>
            {swingModes.map((mode) => (
              <List.Item
                key={mode}
                onClick={() => handleSwingModeChange(mode)}
                className={swingMode === mode ? 'active-mode' : ''}
              >
                {getSwingModeLabel(mode)}
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>

      <Popup
        visible={showHvacModes}
        onMaskClick={() => setShowHvacModes(false)}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '40vh',
          maxHeight: '80vh',
          backgroundColor: 'var(--color-background) !important',
        }}
      >
        <div className="fan-mode-popup">
          <div className="popup-header">
            <h3>{t('climate.operationMode')}</h3>
            <Icon path={mdiPower} size={14} />
          </div>
          <List>
            {climate?.attributes?.hvac_modes.map((mode) => (
              <List.Item
                key={mode}
                onClick={() => handleHvacModeChange(mode)}
                className={climate?.state === mode ? 'active-mode' : ''}
                prefix={<Icon path={getHvacModeIcon(mode)} size={14} />}
              >
                {getHvacModeLabel(mode)}
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>
    </BaseCard>
  );
}

export default ClimateCard; 