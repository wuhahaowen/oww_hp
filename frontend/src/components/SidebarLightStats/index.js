import React, { useMemo } from 'react';
import { mdiLightbulbGroup } from '@mdi/js';
import { Icon } from '@iconify/react';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './style.css';
import {useEntity} from "@hakit/core";

function SidebarLightStats({ lightsConfig }) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Extract entity IDs
  const entityIds = useMemo(() => {
    return Object.values(lightsConfig).map(light => light.entity_id);
  }, [lightsConfig]);

  // Call hooks at top level for a fixed number of entities
  const maxEntities = 20;
  const entity0 = useEntity(entityIds[0] || 'light.dummy_0', { returnNullIfNotFound: true });
  const entity1 = useEntity(entityIds[1] || 'light.dummy_1', { returnNullIfNotFound: true });
  const entity2 = useEntity(entityIds[2] || 'light.dummy_2', { returnNullIfNotFound: true });
  const entity3 = useEntity(entityIds[3] || 'light.dummy_3', { returnNullIfNotFound: true });
  const entity4 = useEntity(entityIds[4] || 'light.dummy_4', { returnNullIfNotFound: true });
  const entity5 = useEntity(entityIds[5] || 'light.dummy_5', { returnNullIfNotFound: true });
  const entity6 = useEntity(entityIds[6] || 'light.dummy_6', { returnNullIfNotFound: true });
  const entity7 = useEntity(entityIds[7] || 'light.dummy_7', { returnNullIfNotFound: true });
  const entity8 = useEntity(entityIds[8] || 'light.dummy_8', { returnNullIfNotFound: true });
  const entity9 = useEntity(entityIds[9] || 'light.dummy_9', { returnNullIfNotFound: true });

  // Map entities back to their IDs
  const entities = {};
  const entityArray = [entity0, entity1, entity2, entity3, entity4, entity5, entity6, entity7, entity8, entity9];
  entityIds.forEach((entityId, index) => {
    if (index < maxEntities && entityArray[index] && entityId) {
      entities[entityId] = entityArray[index];
    }
  });

  // 统计灯状态
  const lightEntities = useMemo(() => {
    return Object.values(lightsConfig).map(light => ({
      ...light,
      entity: entities[light.entity_id]
    })).filter(light => light.entity); // Only include entities that exist
  }, [lightsConfig, entities]);

  const totalLights = lightEntities.length;
  const activeLights = lightEntities.filter(l => l.entity.state === 'on').length;

  return (
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <Icon icon={mdiLightbulbGroup} width={20} height={20} />
          <span>{t('cardTitles.lightStatus') || '灯状态'}</span>
        </div>
        <div className="sidebar-card-content">
          {t('lightStatus.activeLights')
              .replace('%1', activeLights)
              .replace('%2', totalLights)}
        </div>
      </div>
  );
}

export default SidebarLightStats;
