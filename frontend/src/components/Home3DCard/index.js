import React, { useRef, useState } from 'react';
// 3D画布组件 - 负责渲染3D场景和设备模型
import Canvas3D from './Canvas3D.js';
// 灯光控制面板组件 - 处理灯光设备的控制界面
import Light3DCard from '../Light3DCard/index.js';
// 样式文件
import './style.css';

/**
 * Home3DCard - 3D智能家居控制界面主组件
 * 
 * 功能概述：
 * 1. 集成3D场景渲染（Canvas3D）
 * 2. 提供设备控制面板切换（灯光控制、设备管理）
 * 3. 处理3D设备标签点击事件和回调
 * 4. 管理不同控制模式之间的状态切换
 * 5. 实现响应式布局和用户交互界面
 * 
 * @param {Object} props - 组件属性
 * @param {React.Ref} ref - 组件引用，用于父组件访问子组件方法
 * @returns {JSX.Element} 3D智能家居控制界面
 */
function Home3DCard(props, ref) {
  const canvas3DRef = useRef(null);
  // 当前活动模式：'overview'(概览) | 'lights'(灯光) | 'control'(设备控制)
  const [activeMode, setActiveMode] = useState('overview');
  // 灯光控制面板显示状态
  const [showLightPanel, setShowLightPanel] = useState(false);
  // 当前选中的设备信息
  const [selectedDevice, setSelectedDevice] = useState(null);

    // 设置设备选择回调
  React.useEffect(() => {
    if (canvas3DRef.current && canvas3DRef.current.selectionLightDeviceCallback) {
      canvas3DRef.current.selectionLightDeviceCallback(selectionLightDeviceCallback);
    }
  }, []);


  /**
   * 灯光管理模式处理函数
   * 调用Canvas3D的handleLightManagement方法切换到灯光控制模式
   */
  const onLightManagement = () => {
    canvas3DRef.current?.handleLightManagement();
    setActiveMode('lights');
    setShowLightPanel(true);
  };

  /**
   * 设备选择回调处理函数
   * 当3D场景中的设备被选中时触发
   */
  const selectionLightDeviceCallback = (uuid, device) => { 
    console.log('设备被选中:', { uuid, device });
  };

  /**
   * 关闭灯光控制面板
   */
  const handleCloseLightPanel = () => {
    setShowLightPanel(false);
    setActiveMode('overview');
    setSelectedDevice(null);
  };

  /**
   * 设备管理模式处理函数
   * 调用Canvas3D的handleDeviceManagement方法切换到设备控制模式
   */
  const onDeviceManagement = () => { 
    canvas3DRef.current?.handleDeviceManagement();
    setActiveMode('control');
  };

  return (
    <div id="canvas-container" className="home3d-card">
      <Canvas3D ref={canvas3DRef} />

      {/* 灯光控制面板 */}
      {showLightPanel && (
        <div className="light-panel-overlay">
          <Light3DCard  selectedDevice={selectedDevice} onClose={handleCloseLightPanel}/>
        </div>
      )}
      
      <div className="sidebar-control-panel">
        <div className="control-buttons-container">
          {/* 灯光控制 */}
          <button className={`mode-button ${activeMode === 'overview' || activeMode === 'lights' ? 'active' : ''}`} onClick={() => {onLightManagement();}}>
            <div className="button-content">
              <span className="button-icon"> 🏠 </span>
              <span className="button-text"> 灯光控制 </span>
            </div>
          </button>

          {/* 设备管理 */}
          <button className={`mode-button ${activeMode === 'control' ? 'active' : ''}`} onClick={() => {onDeviceManagement();}}>
            <div className="button-content">
              <span className="button-icon">⚙️</span>
              <span className="button-text">设备控制</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(Home3DCard);