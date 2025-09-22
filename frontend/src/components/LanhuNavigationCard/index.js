import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAsset } from '../../assets/lanhu';
import './style.css';

const LanhuNavigationCard = () => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: '智能控制面板',
      description: '全屋设备控制中心',
      path: '/control-panel',
      icon: getAsset('common', 'home')
    },
    {
      title: '全屋总览',
      description: '设备状态一览',
      path: '/house-overview', 
      icon: getAsset('overview', 'icon')
    }
  ];

  return (
    <div className="lanhu-navigation-card">
      <div className="nav-header">
        <h3>蓝湖智能面板</h3>
        <p>基于原型设计的智能家居控制系统</p>
      </div>
      
      <div className="nav-items">
        {navigationItems.map((item, index) => (
          <div 
            key={index}
            className="nav-item"
            onClick={() => navigate(item.path)}
          >
            <div className="nav-icon">
              <img src={item.icon} alt={item.title} />
            </div>
            <div className="nav-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div className="nav-arrow">→</div>
          </div>
        ))}
      </div>
      
      <div className="nav-footer">
        <small>基于蓝湖原型设计 · React 19 架构</small>
      </div>
    </div>
  );
};

export default LanhuNavigationCard;