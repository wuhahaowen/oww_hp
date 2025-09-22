import React from 'react';
import { useEntity } from '@hakit/core';
import { mdiWaterPump } from '@mdi/js';
import { useLanguage } from '../../i18n/LanguageContext';
import BaseCard from '../BaseCard';
import './style.css';
import { notification } from 'antd';

function WaterPurifierCard({ config }) {
  const titleVisible = config.titleVisible;
  const { t } = useLanguage();
  const debugMode = localStorage.getItem('debugMode') === 'true';
  const temperature = useEntity(config.waterpuri?.temperature?.entity_id || '', {returnNullIfNotFound: true});
  const tdsIn = useEntity(config.waterpuri?.tds_in?.entity_id || '', {returnNullIfNotFound: true});
  const tdsOut = useEntity(config.waterpuri?.tds_out?.entity_id || '', {returnNullIfNotFound: true});
  const ppFilterLife = useEntity(config.waterpuri?.pp_filter_life?.entity_id || '', {returnNullIfNotFound: true});
  const roFilterLife = useEntity(config.waterpuri?.ro_filter_life?.entity_id || '', {returnNullIfNotFound: true});
  const status = useEntity(config.waterpuri?.status?.entity_id || '', {returnNullIfNotFound: true});

  function safeGetState(entity) {
    if (!entity || !entity.state || entity.state === 'unknown' || entity.state === 'unavailable' || entity.state === 'loading') {
      return 0;
    }
    return entity.state;
  }

  if (!temperature || !tdsIn || !tdsOut || !ppFilterLife || !roFilterLife || !status) {
    if (debugMode) {
      notification.error({
        message: t('waterPurifier.loadError'),
        description: t('waterPurifier.loadErrorDesc'),
        placement: 'topRight',
        duration: 3,
        key: 'WaterPurifierCard',
      });
    }
  }

  return (
    <BaseCard
      title={config.title || t('cardTitles.waterpurifier')}
      icon={mdiWaterPump}
      titleVisible={titleVisible}
      headerRight={
        <div className="device-status">
          {safeGetState(status) || ''}
        </div>
      }
    >
      <div className="water-purifier-content">
        <div className="tds-display">
          <div className="tds-value">{safeGetState(tdsOut) || '0'}</div>
          <div className="tds-label">
            <span>{t('waterPurifier.tds.pure')}</span>
            <span className={safeGetState(tdsOut) < 50 ? 'good' : 'warning'}>
              {safeGetState(tdsOut) < 50 
                ? t('waterPurifier.tds.purityHigh') 
                : t('waterPurifier.tds.purityLow')}
            </span>
          </div>
          <div className="water-info">
            <div className="info-item">
              <span className="label">{t('waterPurifier.temperature')}:</span>
              <span className="value">
                {safeGetState(temperature)}{t('waterPurifier.unit.temp')}
              </span>
            </div>
            <div className="info-item">
              <span className="label">{t('waterPurifier.tds.tap')}:</span>
              <span className="value">{safeGetState(tdsIn)}</span>
            </div>
          </div>
        </div>

        <div className="filter-status">
          <div className="filter-item">
            <div className="filter-number">1</div>
            <div className="filter-info">
              <div className="filter-name">{t('waterPurifier.filter.ppc')}</div>
              <div className="filter-life-bar">
                <div 
                  className="life-remaining" 
                  style={{width: `${ppFilterLife?.state || 0}%`}}
                />
              </div>
              <div className="life-percentage">
                {t('waterPurifier.filter.lifeRemaining').replace('%1', ppFilterLife?.state || 0)}
              </div>
            </div>
          </div>

          <div className="filter-item">
            <div className="filter-number">2</div>
            <div className="filter-info">
              <div className="filter-name">{t('waterPurifier.filter.ro')}</div>
              <div className="filter-life-bar">
                <div 
                  className="life-remaining" 
                  style={{width: `${roFilterLife?.state || 0}%`}}
                />
              </div>
              <div className="life-percentage">
                {t('waterPurifier.filter.lifeRemaining').replace('%1', roFilterLife?.state || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

export default WaterPurifierCard; 