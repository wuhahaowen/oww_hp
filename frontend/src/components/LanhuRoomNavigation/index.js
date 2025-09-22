import React, { useState } from 'react';
import { getAsset } from '../../imageIndex';
import './style.css';

const RoomNavigation = ({ 
  rooms = ['客厅', '厨房', '卫生间', '茶室', '书房', '棋牌室', '阳台', '洗衣房', '主卧'],
  selectedRoom = '全部',
  onRoomChange 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleRoomSelect = (room) => {
    onRoomChange?.(room);
    setIsDropdownOpen(false);
  };

  return (
    <div className="lanhu-room-navigation">
      <span className="room-nav-title">全屋总览</span>
      <img 
        className="overview-icon" 
        src={getAsset('overview', 'icon')} 
        alt="overview" 
      />
      
      <div className="room-dropdown">
        <div 
          className="dropdown-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="selected-room">{selectedRoom}</span>
          <img 
            className="dropdown-arrow" 
            src={getAsset('overview', 'dropdown')} 
            alt="dropdown" 
          />
        </div>
        
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {rooms.map((room, index) => (
              <div 
                key={index}
                className="dropdown-item"
                onClick={() => handleRoomSelect(room)}
              >
                {room}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="room-tabs">
        {rooms.slice(0, 6).map((room, index) => (
          <span 
            key={index}
            className={`room-tab ${selectedRoom === room ? 'active' : ''}`}
            onClick={() => handleRoomSelect(room)}
          >
            {room}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoomNavigation;