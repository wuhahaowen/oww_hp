import React from 'react';
import Icon from '@mdi/react';
import { 
  mdiPlay,
  mdiPause,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiPlayCircle,
  mdiVolumeHigh,
  mdiMusic,
} from '@mdi/js';
import BaseCard from '../BaseCard';
import './style.css';
import { useLanguage } from '../../i18n/LanguageContext';
import { useEntity } from '@hakit/core';
import {Slider} from 'antd';

function MaxPlayerCard({ 
  config,
}) {
  const titleVisible = config.titleVisible;
  const entity = useEntity(config.entity_id,{returnNullIfNotFound: true});
  const { t } = useLanguage();
  const entityState = entity?.state || 'off';
  const hassUrl = localStorage.getItem('hass_url');
  const coverUrl = entity?.attributes?.entity_picture 
    ? `${hassUrl}${entity.attributes.entity_picture}`
    : null;

    
  // 安全获取实体状态
  const getEntityState = (entity) => {
    if (!entity || entity.error || entity.state === undefined || entity.state === null) {
      return 'off';
    }
    return entity.state;
  };

  // 安全获取媒体标题
  const getMediaTitle = (entity) => {
    if (!entity || entity.error || !entity.attributes?.media_title) {
      return t('mediaPlayer.notPlaying');
    }
    return entity.attributes.media_title;
  };

  // 安全获取音量级别
  const getVolumeLevel = (entity) => {
    if (!entity || entity.error || entity.attributes?.volume_level === undefined) {
      return 0;
    }
    return entity.attributes.volume_level;
  };

  const handlePlayPause = (player) => {
    if (player && !player.error) {
      player.service?.mediaPlayPause();
    }
  };

  const handlePrevious = (player) => {
    if (player && !player.error) {
      player.service?.mediaPreviousTrack();
    }
  };

  const handleNext = (player) => {
    if (player && !player.error) {
      player.service?.mediaNextTrack();
    }
  };

  // const handleVolumeUp = (player) => {
  //   if (player && !player.error) {
  //     player.service?.volumeUp();
  //   }
  // };

  // const handleVolumeDown = (player) => {
  //   if (player && !player.error) {
  //     player.service?.volumeDown();
  //   }
  // };

  const handleVolumeSet = (player, volume) => {
    if (player && !player.error) {
      player.service?.volumeSet({ serviceData: { "volume_level": volume } });
    }
  };


  return (
    <BaseCard
    title={config.title || t('cardTitles.MaxPlayerCard')}
    icon={mdiPlayCircle}
    titleVisible={titleVisible}
    >
      <div className="max-player-card">
        <div className="max-player-content">
          <div className="max-cover-image">
          {coverUrl ? (
            <img src={coverUrl} alt={entity?.attributes?.media_title || '封面'} />
          ) : (
            <div className="max-cover-placeholder" >
              <div className="max-cover-placeholder-icon">
                <Icon path={mdiMusic} color="var(--color-primary)" size={8} />
              </div>
            </div>
          )}
        </div>
        
        <div className="max-track-info">
          <h2 className="max-track-title">
            {getMediaTitle(entity)}
          </h2>
          <p className="max-track-artist">
            {entity?.attributes?.media_artist || '未知艺术家'}
          </p>
        </div>

        <div className="max-player-controls">
        
          <button 
            className="max-control-button prev"
            onClick={() => handlePrevious(entity)}
            disabled={entityState === 'off'}
          >
            <Icon path={mdiSkipPrevious} size={17} />
          </button>
          <button 
            className="max-control-button play"
            onClick={() => handlePlayPause(entity)}
            disabled={entityState === 'off'}
          >
            <Icon 
              path={entityState === 'playing' ? mdiPause : mdiPlay} 
              size={21} 
            />
          </button>
          <button 
            className="max-control-button next"
            onClick={() => handleNext(entity)}
            disabled={entityState === 'off'}
          >
            <Icon path={mdiSkipNext} size={17} />
          </button>
    
        </div>
        <div className="max-progress-bar">
          <Icon path={mdiVolumeHigh} size={14} />
          <Slider disabled={getEntityState(entity) === 'off'} min={0} max={1} step={0.01} tooltip={null} defaultValue={getVolumeLevel(entity)} onChange={(value) => handleVolumeSet(entity, value)} style={{ flex: 1 }} />
        </div>
        </div>
      </div>
    </BaseCard>
  );
}

export default MaxPlayerCard; 