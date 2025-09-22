import React, {useMemo, useState} from 'react';
import { useEntity,useEntities } from '@hakit/core';
import { useLanguage } from '../../i18n/LanguageContext';
import {notification, Switch} from 'antd';
import './style.css';
import {Icon} from "@iconify/react";
import {theme} from "../../theme";
import {renderIcon} from '../../common/SvgIndex';
import imageAssets, {getAsset} from '../../imageIndex';
function LightStatusSidebarCard({ allLights = [] }) {
  const { t } = useLanguage();
  const debugMode = localStorage.getItem('debugMode') === 'true';


  // 假设有批量查询的Hook
  if (!allLights || !Array.isArray(allLights)){
    return null;
  }
  const lightEntities = Object.entries(allLights).reduce((acc, [key, lightConfig]) => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const entity = useEntity(lightConfig.entity_id);

      acc[key] = {
        ...lightConfig,
        entity,
        isLight: lightConfig.entity_id.startsWith('light.')
      };
      return acc;
    } catch (error) {
      // if (debugMode) {
      //   notification.error({
      //     message: t('lightStatus.loadError'),
      //     description: t('lightStatus.loadErrorDesc') + (lightConfig.name || lightConfig.entity_id) + ' - ' + error.message,
      //     placement: 'topRight',
      //     duration: 3,
      //     key: 'LightStatusCard',
      //   });
      // }
      return acc;
    }
  }, {});
  // Calculate light statistics
  const activeLights = Object.values(lightEntities).filter(light => light?.entity?.state === 'on').length;
  const totalLights = Object.keys(lightEntities).length;
  const allLightsOn = activeLights === totalLights;
  const allLightsOff = activeLights === 0;

  // Control functions
  const turnAllLights = (action) => {
    lightEntities.forEach(light => {
      if (light.entity && light.entity.service && light.entity.service[action]) {
        try {
          light.entity.service[action]();
        } catch (error) {
          if (debugMode) {
            notification.error({
              message: t('lightStatus.controlError'),
              description: `${t('lightStatus.controlErrorDesc')} ${light.name || light.entity_id}`,
              placement: 'topRight',
              duration: 3,
            });
          }
        }
      }
    });
  };

  const handleToggleOn = () => {
    turnAllLights('turn_on');
  };

  const handleToggleOff = () => {
    turnAllLights('turn_off');
  };

  const replaceIcon = (light) => {

    if (!light.entity || !light.icon) {
      return 'light_mdi:track-light';
    }
    return renderIcon('light', light.icon);

  }

  return (
      <>
        <div className="home-light-status-container flex-col">
          <div className="home-light-header-section flex-row justify-between">
            <span className="home-light-title">灯光</span>
            <img
                className="home-light-icon"
                referrerPolicy="no-referrer"
                src="https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG29f392c85d12da001aadf0b3cc75a3fd.png"
            />
          </div>
          <div className="home-light-stats-section flex-row">
            <div className="home-light-stats-text">
              <span className="home-current-lights">当前：{activeLights}</span>
              <span className="home-lights-separator">/&nbsp;</span>
              <span className="home-total-lights">{totalLights}</span>
              <span className="home-lights-unit">&nbsp;个灯开启</span>
            </div>
            <Icon
                className="home-light-control-icon on-icon"
                icon="light_mdi:lightbulb-group-on"
                width={48}
                height={48}
                color={allLightsOff
                    ? (theme === 'dark' ? '#666666' : '#CCCCCC')
                    : (theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D')
                }
            />
            <Icon
                className="home-light-control-icon off-icon"
                icon="light_mdi:lightbulb-group-off"
                width={48}
                height={48}
                color={allLightsOn
                    ? (theme === 'dark' ? '#666666' : '#CCCCCC')
                    : (theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D')
                }
            />

          </div>
        </div>

      </>

  )
      ;
}

export default LightStatusSidebarCard;