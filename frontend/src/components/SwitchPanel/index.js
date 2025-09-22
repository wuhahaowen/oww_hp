import React from 'react';
import { useHass } from '@hakit/core';
import { Command } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { notification } from 'antd';
import BaseCard from '../BaseCard';
import './style.css';
import { Icon } from '@iconify/react';

function SwitchPanel({ config }) {
  const titleVisible = config.titleVisible;
  const { t } = useLanguage();
  const { callService, entities } = useHass();

  const handleToggle = async (entityId, entityName) => {
    const currentState = entities[entityId]?.state;
    const domain = entityId.split('.')[0]; // 自动识别是 switch/light/script 等

    try {
      await callService({
        domain,
        service: currentState === 'on' ? 'turn_off' : 'turn_on',
        target: { entity_id: entityId }
      });
    } catch (error) {
      notification.error({
        message: t('script.executeError'),
        description:
            t('script.executeErrorDesc') +
            (entityName || entityId) +
            ' - ' +
            error.message,
        placement: 'topRight',
        duration: 3,
        key: 'SwitchPanel'
      });
    }
  };

  return (
      <BaseCard
          title={config.title || t('cardTitles.switchpanel')}
          icon={<Command size={24} />}
          className="switch-panel"
          titleVisible={titleVisible}
      >
        <div className="switch-buttons">
          {config.entities.map((item) => {
            const entityState = entities[item.entity_id]?.state;

            // 图标
            const iconName =
                entityState === 'on'
                    ? 'mdi:toggle-switch'
                    : 'mdi:toggle-switch-off';

            // 按钮样式
            const stateClass =
                entityState === 'on' ? 'switch-button on' : 'switch-button off';

            return (
                <button
                    key={item.entity_id}
                    className={stateClass}
                    onClick={() => handleToggle(item.entity_id, item.name)}
                >
                  <Icon icon={iconName} width={24} className="switch-icon" />
                  <span className="switch-name">{item.name}</span>
                </button>
            );
          })}
        </div>
      </BaseCard>
  );
}

export default SwitchPanel;
