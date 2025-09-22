import React from 'react';
import { mdiWhiteBalanceSunny } from '@mdi/js';
import { useEntity } from '@hakit/core';
import { useLanguage } from '../../i18n/LanguageContext';
import BaseCard from '../BaseCard';
import './style.css';
import {renderIcon} from "../../common/SvgIndex";
import { Icon } from '@iconify/react';

function IlluminanceCard({ config, titleVisible }) {
  const { t } = useLanguage();
  // 从 config.sensors 获取传感器列表
  const sensors = Array.isArray(config.sensors) ? config.sensors : [];

  return (
    <BaseCard
      title={config.title || t('cardTitles.illuminance')}
      icon={mdiWhiteBalanceSunny}
      titleVisible={titleVisible}
    >
      <div className="illuminance-sensors">
        {sensors.map((sensor) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const entity = useEntity(sensor.entity_id, {returnNullIfNotFound: true});
          if (!entity) {
            return (
              <div key={sensor.entity_id} className="illuminance-sensor">
                {sensor.name || entity?.attributes?.friendly_name || sensor.entity_id}
                {t('illuminance.loadFailed')}
              </div>
            );
          }

          
          return (
              <div className="box_30 flex-row" key={sensor.entity_id}>
                <div className="text-wrapper_14 flex-col justify-between">
                  <span className="text_118">{sensor.name || entity.attributes?.friendly_name || sensor.entity_id}</span>
                  <span className="text_119">{entity.state}</span>
                </div>
                <span className="text_120">{t('illuminance.unit')}</span>
                <Icon  className="label_63" icon={renderIcon('sensor','illuminance-sensors')}/>
              </div>

          // <div key={sensor.entity_id} className="illuminance-sensor">
          //   <div className="sensor-name">{sensor.name || entity.attributes?.friendly_name || sensor.entity_id}</div>
          //   <div className="sensor-value">
          //     <span className="value">{entity.state}</span>
          //     <span className="unit">{t('illuminance.unit')}</span>
          //   </div>
          // </div>


        )
          ;
        })}
      </div>
    </BaseCard>
  );
}

export default IlluminanceCard; 