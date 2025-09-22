import React from 'react';
import { 
  mdiPlay,
  mdiPause,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiVolumeHigh,
  mdiPlayCircle,
} from '@mdi/js';
import './style.css';
import { useLanguage } from '../../i18n/LanguageContext';
import Icon from '@mdi/react';
import { Slider } from 'antd';

function MiniPlayerCard({ 
  entity, 
  title,
  handlePlayPause,
  handlePrevious,
  handleNext,
  handleVolumeUp,
  handleVolumeDown,
  handleVolumeSet,
  getMediaTitle,
  getVolumeLevel,
}) {
  const entityState = entity?.state || 'off';
  const hassUrl = localStorage.getItem('hass_url');
  const coverUrl = entity?.attributes?.entity_picture 
    ? `${hassUrl}${entity.attributes.entity_picture}`
    : null;
  const { t } = useLanguage();

  return (
    <div 
      className="mini-player"
      data-has-cover={!!coverUrl}
      style={coverUrl ? { '--cover-image': `url(${coverUrl})` } : undefined}
    >
      <div className="mini-player-content">
        <div className="mini-player-name">{title}</div>
        <div className="mini-player-info-row">
          <div className="mini-player-cover">
            {coverUrl ? (
              <img src={coverUrl} alt={t('mediaPlayer.cover')} />
            ) : (
              <div className="mini-cover-placeholder" >
                <div className="mini-cover-placeholder-icon">
                  <Icon path={mdiPlayCircle} color="var(--color-primary)" size={17} />
                </div>
              </div>
            )}
          </div>
          <div className="mini-player-info">
            <span className="mini-player-state">{getMediaTitle(entity)}</span>
            {entity?.attributes?.media_artist && (
              <span className="mini-player-artist">{entity.attributes.media_artist}</span>
            )}
          </div>
        </div>
        <div className="mini-player-controls-row">
          <div className="mini-volume-slider">
            <Icon path={mdiVolumeHigh} size={12} />
            <Slider min={0} max={1} step={0.01} tooltip={null} defaultValue={getVolumeLevel(entity)} onChange={(value) => handleVolumeSet(entity, value)} style={{ flex: 1 }} />
          </div>
          <div className="mini-player-controls">
            <button 
              className="mini-control-button"
              onClick={() => handlePrevious(entity)}
              disabled={entityState === 'off'}
              title={t('mediaPlayer.controls.previous')}
            >
              <Icon path={mdiSkipPrevious} size={14} />
            </button>
            <button 
              className="mini-control-button mini-play-button"
              onClick={() => handlePlayPause(entity)}
              disabled={entityState === 'off'}
              title={t('mediaPlayer.controls.playPause')}
            >
              <Icon path={entityState === 'playing' ? mdiPause : mdiPlay} size={14} />
            </button>
            <button 
              className="mini-control-button"
              onClick={() => handleNext(entity)}
              disabled={entityState === 'off'}
              title={t('mediaPlayer.controls.next')}
            >
              <Icon path={mdiSkipNext} size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniPlayerCard; 