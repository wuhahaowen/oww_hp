import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './style.css';
import {useEntity} from '@hakit/core';
import Modal from '../Modal';
import LightControl from '../LightOverviewCard/LightControl';
import { notification } from 'antd';
import BaseCard from '../BaseCard';
import { mdiLightbulbGroup } from '@mdi/js';
import {renderIcon} from '../../common/SvgIndex';

function LightStatusCard({ config }) {

  const { theme } = useTheme();
  const { t } = useLanguage();
  const [showControl, setShowControl] = useState(false);
  const [selectedLight, setSelectedLight] = useState(null);
  const pressTimer = useRef(null);
  const debugMode = localStorage.getItem('debugMode') === 'true';
  // 确保 config 是一个对象
  if (!config || typeof config !== 'object') {
    return null;
  }

  const lightEntities = Object.entries(config.lights).reduce((acc, [key, lightConfig]) => {
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
      if (debugMode) {
        notification.error({
          message: t('lightStatus.loadError'),
          description: t('lightStatus.loadErrorDesc') + (lightConfig.name || lightConfig.entity_id) + ' - ' + error.message,
          placement: 'topRight',
          duration: 3,
          key: 'LightStatusCard',
        });
      }
      return acc;
    }
  }, {});

  const activeLights = Object.values(lightEntities).filter(light => light.entity.state === 'on').length;
  const totalLights = Object.keys(lightEntities).length;
  const allLightsOn = activeLights === totalLights;
  const allLightsOff = activeLights === 0;

  const toggleLight = (entity) => {
    entity.service.toggle()
  };

  const turnAllLights = (action) => {
    Object.values(lightEntities).forEach(light => {
      light.entity.service[action]();
    });
  };

  const handlePressStart = (light) => {
    // 只有 light 类型的实体才支持长按
    if (!light.isLight) return;

    pressTimer.current = setTimeout(() => {
      setSelectedLight(light);
      setShowControl(true);
    }, 500); // 500ms 长按触发
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleTouchStart = (light, e) => {
    // 只有 light 类型的实体才阻止默认事件和支持长按
    if (!light.isLight) return;

   // e.preventDefault();
    handlePressStart(light);
  };

    const replaceIcon = (light) => {

        if (!light.entity || !light.icon) {
            return 'light_mdi:track-light';
        }
        return renderIcon('light', light.icon);

    }

    return (
        <BaseCard
            titleVisible={config.titleVisible}
            icon={mdiLightbulbGroup}
            title={config.title || t('cardTitles.lightStatus')}
            color={theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D'}
            headerRight={<div className="header-controls">
      <span className="light-summary">
        {t('lightStatus.activeLights').replace('%1', activeLights).replace('%2', totalLights)}
      </span>

                <button
                    className={`control-button ${allLightsOff ? 'disabled' : ''}`}
                    onClick={() => !allLightsOff && turnAllLights('turn_off')}
                    title={allLightsOff ? t('lightStatus.allLightsOff') : t('lightStatus.turnAllOff')}
                    disabled={allLightsOff}
                >
                    <Icon
                        icon="mdi:lightbulb-group-off"
                        width={20}
                        height={20}
                        color={allLightsOff
                            ? (theme === 'dark' ? '#666666' : '#CCCCCC')
                            : (theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D')
                        }
                    />
                </button>
                <button
                    className={`control-button ${allLightsOn ? 'disabled' : ''}`}
                    onClick={() => !allLightsOn && turnAllLights('turn_on')}
                    title={allLightsOn ? t('lightStatus.allLightsOn') : t('lightStatus.turnAllOn')}
                    disabled={allLightsOn}
                >
                    <Icon
                        icon="mdi:lightbulb-group"
                        width={20}
                        height={20}
                        color={allLightsOn
                            ? (theme === 'dark' ? '#666666' : '#CCCCCC')
                            : (theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D')
                        }
                    />
                </button>
            </div>}
        >

            <div className="light-buttons">
                {Object.entries(lightEntities).map(([key, light]) => (
                    <button
                        key={key}
                        className={`light-button`}
                        onClick={() => toggleLight(light.entity)}
                        onMouseDown={() => handlePressStart(light)}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}
                        onTouchStart={(e) => handleTouchStart(light, e)}
                        onTouchEnd={handlePressEnd}
                        title={`${light.name}${!light.isLight ? t('lightStatus.switchEntity') : ''}`}
                    >
                        <Icon
                            // icon={light.icon || 'mdi:ceiling-light'}
                            //icon ='light_mdi:track-light'
                            icon={replaceIcon(light)}
                            width={48}
                            height={48}
                            color={light.entity?.state === 'on'
                                ? 'var(--color-secondary)'
                                : theme === 'dark'
                                    ? '#999999'
                                    : 'var(--color-text-light)'
                            }
                        />
                        <span className={`light-name ${light.name.length > 4 ? 'long-text' : ''}`}>
              {light.name}
            </span>
                    </button>
                ))}
            </div>

            <Modal
                visible={showControl}
                onClose={() => setShowControl(false)}
                title={selectedLight?.name}
                width="40vw"
            >
                {selectedLight && selectedLight.isLight && (
                    <LightControl
                        lightEntity={selectedLight.entity}
                        lightName={selectedLight.name}
                        onClose={() => setShowControl(false)}
                    />
                )}
            </Modal>
        </BaseCard>
    );
}

export default LightStatusCard; 