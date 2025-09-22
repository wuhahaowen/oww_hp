import React, { useState, useMemo } from 'react';
import { useEntity } from '@hakit/core';
import './style.css';
import  {notification, Switch,ConfigProvider } from "antd";
import imageAssets, {getAsset} from "../../imageIndex";


function ClimateControlSidebarCard({ climateControlSidebarConfig = { climates: [], globalControl: true } }) {
  const [selectedMode, setSelectedMode] = useState('auto');
  const debugMode = process.env.NODE_ENV === 'development';
  const [climateImg, setClimateImg] = useState("");
  const [climateStatus, setClimateStatus] = useState("");

  const theme ={
    token:{
      handleSize: 58
    }
  }
  // Extract climate entities
  const climateEntities = useMemo(() => {
    const { climates = [] } = climateControlSidebarConfig;
    return climates.map((climate, index) => ({
      key: climate.entity_id || `climate_${index}`,
      entity_id: climate.entity_id || `climate.${index}`,
      name: climate.name || `空调 ${index + 1}`,
      area: climate.area || 'Unknown'
    }));
  }, [climateControlSidebarConfig]);

  // Extract entity IDs for Hook calls
  const entityIds = useMemo(() => {
    return climateEntities.map(climate => climate.entity_id);
  }, [climateEntities]);

  // Use entities at component top level - create dynamic hook calls
  const entities = {};

  // We need to call useEntity for each entity ID at the top level
  // Since the number of entities is dynamic, we'll use a different approach
  const maxEntities = 20; // Reasonable limit for hooks
  const limitedEntityIds = entityIds.slice(0, maxEntities);

  // Call hooks for each entity at top level - always call the same number of hooks
  const entity0 = useEntity(entityIds[0] || 'climate.dummy_0', { returnNullIfNotFound: true });
  const entity1 = useEntity(entityIds[1] || 'climate.dummy_1', { returnNullIfNotFound: true });
  const entity2 = useEntity(entityIds[2] || 'climate.dummy_2', { returnNullIfNotFound: true });
  const entity3 = useEntity(entityIds[3] || 'climate.dummy_3', { returnNullIfNotFound: true });
  const entity4 = useEntity(entityIds[4] || 'climate.dummy_4', { returnNullIfNotFound: true });
  const entity5 = useEntity(entityIds[5] || 'climate.dummy_5', { returnNullIfNotFound: true });
  const entity6 = useEntity(entityIds[6] || 'climate.dummy_6', { returnNullIfNotFound: true });
  const entity7 = useEntity(entityIds[7] || 'climate.dummy_7', { returnNullIfNotFound: true });
  const entity8 = useEntity(entityIds[8] || 'climate.dummy_8', { returnNullIfNotFound: true });
  const entity9 = useEntity(entityIds[9] || 'climate.dummy_9', { returnNullIfNotFound: true });

  // Map entities back to their IDs
  const entityArray = [entity0, entity1, entity2, entity3, entity4, entity5, entity6, entity7, entity8, entity9];
  entityIds.forEach((entityId, index) => {
    if (index < maxEntities && entityArray[index] && entityId) {
      entities[entityId] = entityArray[index];
    }
  });

  // Process climate data
  const activeClimateDevices = useMemo(() => {
    return climateEntities
      .filter(climate => entities[climate.entity_id])
      .map(climate => ({
        ...climate,
        entity: entities[climate.entity_id]
      }));
  }, [climateEntities, entityIds]);
  //   try {
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     const entity = useEntity(climate.entity_id);
  //
  //     acc[key] = {
  //       ...climate,
  //       entity,
  //       key: climate.entity_id || `climate_${key}`,
  //     };
  //     return acc;
  //   } catch (error) {
  //     return acc;
  //   }
  // }, {});



  // Calculate statistics
  const totalClimateDevices = climateEntities.length;
  const onClimateDevices = Object.entries(climateEntities).filter(climate =>
    climate.entity?.state !== 'off'
  ).length;

  const avgTargetTemp = useMemo(() => {
    const temps = Object.entries(climateEntities)
      .filter(climate => climate.entity?.attributes?.temperature)
      .map(climate => parseFloat(climate.entity.attributes.temperature));

    if (temps.length === 0) return 0;
    return temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
  }, [climateEntities]);


  // Toggle all climate devices
  const toggleAllClimate = async () => {
    const action = onClimateDevices === totalClimateDevices ? 'turn_off' : 'turn_on';

    const promises = Object.entries(climateEntities).map(async (climate) => {
      try {
        await climate.entity.service.callService('climate', action, {
          entity_id: climate.entity_id
        });
      } catch (error) {
        if (debugMode) {
          console.warn(`Failed to ${action} climate ${climate.name}:`, error);
        }
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn(`Failed to ${action} climate devices:`, error);
      }
    }
  };

  // Change mode for all devices
  const handleModeChange = async (mode) => {
    setSelectedMode(mode);

    const promises = Object.entries(climateEntities)
      .filter(climate => climate.entity?.state !== 'off')
      .map(async (climate) => {
        try {
          await climate.entity.service.callService('climate', 'set_hvac_mode', {
            entity_id: climate.entity_id,
            hvac_mode: mode
          });
        } catch (error) {
          if (debugMode) {
            console.warn(`Failed to set mode for climate ${climate.name}:`, error);
          }
        }
      });

    try {
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn('Failed to set climate mode:', error);
      }
    }
  };

  // Adjust temperature
  const handleTempAdjust = async (delta) => {
    const newTemp = Math.max(16, Math.min(32, avgTargetTemp + delta));

    const promises = Object.entries(climateEntities)
      .filter(climate => climate.entity?.state !== 'off')
      .map(async (climate) => {
        try {
          await climate.entity.service.callService('climate', 'set_temperature', {
            entity_id: climate.entity_id,
            temperature: newTemp
          });
        } catch (error) {
          if (debugMode) {
            console.warn(`Failed to set temperature for climate ${climate.name}:`, error);
          }
        }
      });

    try {
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn('Failed to set climate temperature:', error);
      }
    }
  };


  const onChange = (checked) => {
    if(checked){
      toggleAllClimate().then(r=>{
        setClimateImg(getAsset('lighting', 'allOn'))
        setClimateStatus("ON")
      })
    }else{
      toggleAllClimate().then(r=>{
        setClimateImg(getAsset('lighting', 'allOff'))
        setClimateStatus("OFF")
      })
    }

  };

  return (
      // className="home-climate-switch"
      <div className="climate-control-group flex-row">
        <div className="climate-control-info flex-col">
          <span className="climate-control-title">空调</span>
          <span className="climate-control-area">全屋</span>
            <Switch className="home-climate-switch" size ="small"  onChange={onChange} />
        </div>
        <span className="climate-control-status">{climateStatus?climateStatus:"OFF"}</span>
        <img
            className="climate-control-image"
            src={imageAssets.climate.icon}
        />
      </div>
  );
}

export default ClimateControlSidebarCard;