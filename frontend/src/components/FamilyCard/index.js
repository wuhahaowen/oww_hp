import React from 'react';
import BaseCard from '../BaseCard';
import { mdiAccountGroup, mdiHome, mdiWalk, mdiAccount } from '@mdi/js';
import { useEntity } from '@hakit/core';
import Icon from '@mdi/react';
import { useTheme } from '../../theme/ThemeContext';
import './style.css';
function FamilyCard({ config }) {
  const titleVisible = config.titleVisible;
  const hassUrl = localStorage.getItem('hass_url');
  
  const { theme } = useTheme();

  const renderPerson = (person, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const entity = useEntity(person.entity_id);
    const isHome = entity?.state === 'home';
    const personIcon = entity?.attributes?.entity_picture 
      ? `${hassUrl}${entity.attributes.entity_picture}`
      : null;

    return (
      <div className="family-person" key={`${person.entity_id}-${index}`}>
        <div className="person-avatar">
          {personIcon ? (
            <img src={personIcon} alt={person.name} />
          ) : (
            <div className="default-avatar" >
            <Icon 
              path={mdiAccount} 
              size={42} 
              color="white"
            />
            </div>
          )}
          <div className="status-indicator">
            <Icon 
              path={isHome ? mdiHome : mdiWalk} 
              size={9} 
              color={theme === 'dark' ? 'white' : 'black'}
            />
          </div>
        </div>
        <div className="person-name">
          {entity?.attributes?.friendly_name}
        </div>
      </div>
    );
  };

  return (
    <BaseCard
      title={config.title}
      titleVisible={titleVisible}
      icon={mdiAccountGroup}
    >
      <div className="family-members-container">
        <div className={`family-members members-${config.persons?.length || 0}`}>
          {config.persons?.map((person, index) => renderPerson(person, index))}
        </div>
      </div>
     
    </BaseCard>
  );
}

export default FamilyCard;
