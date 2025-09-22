import React,{useState} from 'react';
import { useHass } from '@hakit/core';
import { Command } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { notification } from 'antd';
import BaseCard from '../BaseCard';
import './style.css';
import {Icon} from '@iconify/react';
import {renderIcon} from "../../common/SvgIndex";
function ScriptPanel({ config }) {
  const titleVisible = config.titleVisible;
  const { t } = useLanguage();
  const { callService } = useHass();
  const [iconColor, setIconColor] = new useState('turn_off');
  const { theme } = useTheme();
  const handleScriptClick = async (entityId, scriptName,elem) => {
    console.log(entityId, scriptName,elem);
    try {
      await callService({
        domain: 'script',
        service: 'turn_on',
        target: {
          entity_id: entityId
        }
      });


      setIconColor('turn_on');
    } catch (error) {
      notification.error({
        message: t('script.executeError'),
        description: t('script.executeErrorDesc') + (scriptName || entityId) + ' - ' + error.message,
        placement: 'topRight',
        duration: 3,
        key: 'ScriptPanel',
      });
    }
  };



  return (
    <BaseCard 
      title={config.title || t('cardTitles.scriptpanel')} 
      icon={<Command size={24} />} 
      className="script-panel"
      titleVisible={titleVisible}
    >
      <div className="script-buttons">
        {config.scripts.map((script) => (
          <button
            key={script.entity_id}
            color= "#FFB74D"
            className="script-button"
            onClick={() => handleScriptClick(script.entity_id, script.name)}
          >
            <Icon icon={renderIcon('scene',script.icon)} width={48} className="script-icon"/>
            <span className="script-name">{script.name}</span>
          </button>
        ))}
      </div>
    </BaseCard>
  );
}

export default ScriptPanel; 