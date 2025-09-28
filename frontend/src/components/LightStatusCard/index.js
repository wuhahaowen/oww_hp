import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './style.css';
import {useEntity} from '@hakit/core';
import Modal from '../Modal';
import LightControl from '../LightOverviewCard/LightControl';
import { notification,Image } from 'antd';
import BaseCard from '../BaseCard';
import { mdiLightbulbGroup } from '@mdi/js';
import {renderIcon} from '../../common/SvgIndex';
import imageAssets from '../../imageIndex';

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


    
    console.log(`执行 ${action} 操作，目标: 所有灯光`);
    const lightCount = Object.values(lightEntities).length;
    console.log(`涉及的灯光数量: ${lightCount}`);
    
    Object.values(lightEntities).forEach((light, index) => {
      console.log(`正在${action === 'turn_off' ? '关闭' : '开启'}灯光 ${index + 1}: ${light.name} (${light.entity.entity_id})`);
      light.entity.service[action]();
    });
    
    console.log(`${action === 'turn_off' ? '关闭' : '开启'}所有灯光操作已完成`);
    if (action === 'turn_off') {
      console.log('✓ 已确认关闭所有灯光');
    }
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
        // 基础卡片组件，包含灯光控制的标题和操作按钮
        <BaseCard
            titleVisible={config.titleVisible}
            icon={mdiLightbulbGroup}
            title={config.title || t('cardTitles.lightStatus')}
            color={theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D'}
            // 头部右侧控制区域，包含灯光统计和全局控制按钮
            headerRight={<div className="header-controls">
      <span className="light-summary">
        {/* 显示当前开启的灯光数量 */}
        {t('lightStatus.activeLights').replace('%1', activeLights).replace('%2', totalLights)}
      </span>
                {/* 关闭所有灯光按钮 */}
                <button
                    className={`control-button ${allLightsOff ? 'disabled' : ''}`}
                    onClick={() => !allLightsOff && turnAllLights('turn_off')}
                    title={allLightsOff ? t('lightStatus.allLightsOff') : t('lightStatus.turnAllOff')}
                    disabled={allLightsOff}
                >
                    <Icon
                        icon="mdi:lightbulb-group-off"
                        width="0.97vw" /* 28px/2880*100% = 0.97vw */
                        height="0.97vw"
                        color={allLightsOff
                            ? (theme === 'dark' ? '#666666' : '#CCCCCC')
                            : (theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D')
                        }
                    />
                </button>
                
                {/* 开启所有灯光按钮 */}
                <button
                    className={`control-button ${allLightsOn ? 'disabled' : ''}`}
                    onClick={() => !allLightsOn && turnAllLights('turn_on')}
                    title={allLightsOn ? t('lightStatus.allLightsOn') : t('lightStatus.turnAllOn')}
                    disabled={allLightsOn}
                >
                    <Icon
                        icon="mdi:lightbulb-group"
                        width="0.97vw" /* 28px/2880*100% = 0.97vw */
                        height="0.97vw"
                        color={allLightsOn
                            ? (theme === 'dark' ? '#666666' : '#CCCCCC')
                            : (theme === 'dark' ? 'var(--color-text-primary)' : '#FFB74D')
                        }
                    />
                </button>
            </div>}
            className="light-status-card"
        >
            {/* 灯光控制主要内容区域 */}
            <div className="card-content">
                {/* 灯光按钮网格布局 */}
                <div className="light-buttons">
                    {Object.entries(lightEntities).map(([key, light]) => (
                        // 单个灯光控制按钮
                        <button
                            key={key}
                            className={`light-button ${light.entity?.state === 'on' ? 'on' : ''}`}
                            // 点击切换灯光状态
                            onClick={() => toggleLight(light.entity)}
                            // 长按功能实现
                            onMouseDown={() => handlePressStart(light)}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchStart={(e) => handleTouchStart(light, e)}
                            onTouchEnd={handlePressEnd}
                            // 提示信息显示
                            title={`${light.name}${!light.isLight ? t('lightStatus.switchEntity') : ''}`}
                        >
                            {/* 灯光图标 */}
                            <Icon
                                icon={replaceIcon(light)}
                                width="2.78vw" /* 80px/2880*100% = 2.78vw */
                                height="2.78vw"
                                color={light.entity?.state === 'on'
                                    ? 'var(--color-secondary)'
                                    : theme === 'dark'
                                        ? '#999999'
                                        : 'var(--color-text-light)'
                                }
                            />
                            {/* 灯光名称 */}
                            <span className={`light-name ${light.name.length > 4 ? 'long-text' : ''}`}>
                              {light.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 灯光详细控制弹窗 */}
            <Modal
                visible={showControl}
                onClose={() => setShowControl(false)}
                title={selectedLight?.name}
                width="auto" /* 自适应宽度 */
                style={{ maxWidth: '90vw', minWidth: '30vw' }} /* 设置最大最小宽度限制 */
            >
                {/* 仅对实际灯光设备显示控制面板 */}
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
