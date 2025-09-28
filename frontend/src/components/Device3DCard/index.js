import React, { useState } from 'react';
import './style.css';

function Device3DCard() {
  // 当前选中的模式：'lights' 或 'devices'
  const [activeMode, setActiveMode] = useState('lights');
  
  // 模拟的灯光数据
  const lights = [
    { id: 1, name: '客厅主灯', icon: '💡', status: true },
    { id: 2, name: '厨房灯', icon: '🔆', status: false },
    { id: 3, name: '卧室灯', icon: '💡', status: true },
    { id: 4, name: '阳台灯', icon: '🔅', status: false }
  ];
  
  // 模拟的设备数据
  const devices = [
    { id: 1, name: '空调', icon: '❄️', status: true },
    { id: 2, name: '风扇', icon: '🌪️', status: false },
    { id: 3, name: '窗帘', icon: '🪟', status: true },
    { id: 4, name: '洗衣机', icon: '🧺', status: false }
  ];
  
  // 切换设备状态
  const toggleItemStatus = (id, type) => {
    console.log(`切换${type} ID: ${id}`);
    // 这里可以添加实际的设备控制逻辑
  };
  
  return (
    <div className="device-3d-card">
      {/* 顶部切换按钮 */}
      <div className="mode-switch-container">
        <div className="mode-switch">
          <button 
            className={`mode-button ${activeMode === 'lights' ? 'active' : ''}`}
            onClick={() => setActiveMode('lights')}
          >
            {/* 图标在左，文字在右 */}
            <span className="mode-icon">💡</span>
            <span className="mode-text">灯光控制</span>
          </button>
          <button 
            className={`mode-button ${activeMode === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveMode('devices')}
          >
            {/* 图标在左，文字在右 */}
            <span className="mode-icon">🔧</span>
            <span className="mode-text">设备控制</span>
          </button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="content-area">
        {activeMode === 'lights' ? (
          <div className="lights-panel">
            <div className="panel-header">
              <h3>🏠 灯光管理</h3>
              <p>控制家中所有照明设备</p>
            </div>
            <div className="items-grid">
              {lights.map((light) => (
                <div key={light.id} className="control-item">
                  <div className="item-info">
                    {/* 图标在左，文字在右 */}
                    <span className="item-icon">{light.icon}</span>
                    <span className="item-name">{light.name}</span>
                  </div>
                  <div className="item-controls">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={light.status}
                        onChange={() => toggleItemStatus(light.id, 'light')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="devices-panel">
            <div className="panel-header">
              <h3>⚙️ 设备管理</h3>
              <p>控制家中所有智能设备</p>
            </div>
            <div className="items-grid">
              {devices.map((device) => (
                <div key={device.id} className="control-item">
                  <div className="item-info">
                    {/* 图标在左，文字在右 */}
                    <span className="item-icon">{device.icon}</span>
                    <span className="item-name">{device.name}</span>
                  </div>
                  <div className="item-controls">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={device.status}
                        onChange={() => toggleItemStatus(device.id, 'device')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 底部状态栏 */}
      <div className="status-bar">
        <div className="status-info">
          {activeMode === 'lights' ? (
            <span>💡 {lights.filter(l => l.status).length}/{lights.length} 灯光开启</span>
          ) : (
            <span>⚙️ {devices.filter(d => d.status).length}/{devices.length} 设备运行</span>
          )}
        </div>
        <div className="refresh-button">
          <button onClick={() => console.log('刷新状态')}>
            🔄 刷新
          </button>
        </div>
      </div>
    </div>
  );
}

export default Device3DCard;