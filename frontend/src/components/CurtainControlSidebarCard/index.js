import React, {useState, useCallback, useMemo, useEffect} from 'react';
import './style.css';
import {Switch} from "antd";
import imageAssets from "../../imageIndex";

// 窗帘控制侧边栏卡片组件
function CurtainControlSidebarCard({ curtainControlSidebarConfig = { curtains: [], globalControl: true }, onControlAllCurtains }) {
  // 状态变量定义
  const [curtainsStatus, setCurtainsStatus] = useState("OFF"); // 窗帘状态
  const [isAllCurtainsOpen, setIsAllCurtainsOpen] = useState(false); // 窗帘开关状态
  const debugMode = localStorage.getItem('debugMode') === 'true'; // 调试模式
  const [switchSize, setSwitchSize] = useState("small");
  // 初始化默认值
  let isValidConfig = true;

  // 确保 curtainControlSidebarConfig 是一个对象
  if (!curtainControlSidebarConfig || typeof curtainControlSidebarConfig !== 'object') {
    console.warn('CurtainControlSidebarCard: curtainControlSidebarConfig is not an object or is null', curtainControlSidebarConfig);
    isValidConfig = false;
  }
  
  // 检查 curtains 是否存在且为对象
  if (isValidConfig && (!curtainControlSidebarConfig.curtains || typeof curtainControlSidebarConfig.curtains !== 'object')) {
    console.warn('CurtainControlSidebarCard: curtainControlSidebarConfig.curtains is not an object or is null', curtainControlSidebarConfig.curtains);
    isValidConfig = false;
  }
  
  // 使用 useMemo 计算 curtainConfigs
  const { curtainConfigs, hasCurtains } = useMemo(() => {
    if (!isValidConfig) {
      return { curtainConfigs: [], hasCurtains: false };
    }
    
    const curtainKeys = Object.keys(curtainControlSidebarConfig.curtains);
    if (curtainKeys.length === 0) {
      console.warn('CurtainControlSidebarCard: curtainControlSidebarConfig.curtains is empty');
    }
    
    // 收集所有entity_id
    const curtainConfigs = Object.entries(curtainControlSidebarConfig.curtains)
        .filter(([key, curtainConfig]) => curtainConfig && curtainConfig.entity_id)
        .map(([key, curtainConfig]) => ({key, entityId: curtainConfig.entity_id, config: curtainConfig}));

    const hasCurtains = curtainConfigs.length > 0;
    
    return { curtainConfigs, hasCurtains };
  }, [curtainControlSidebarConfig, isValidConfig]);
  
  // 控制所有窗帘的开关
  const controlAllCurtains = useCallback(async (open) => {
    if (!isValidConfig) return;
    
    try {
      const newStatus = open ? "ON" : "OFF";
      const newImage = open ? imageAssets.curtain.open : imageAssets.curtain.closed;

      // 更新UI状态
      setCurtainsStatus(newStatus);
      setIsAllCurtainsOpen(open);

      console.log(`正在${open ? '打开' : '关闭'}所有窗帘...`);
      console.log('窗帘配置列表:', curtainConfigs);
      console.log('窗帘数量:', curtainConfigs.length);

      // 调用从props传入的控制函数
      if (onControlAllCurtains) {
        await onControlAllCurtains(open ? "open" : "close", curtainConfigs);
        console.log(`${open ? '打开' : '关闭'}所有窗帘操作已完成`);
        console.log('操作的窗帘数量:', curtainConfigs.length);
        
        // 添加确认信息
        if (!open) {
          console.log('✓ 已确认关闭所有窗帘');
        } else {
          console.log('✓ 已确认打开所有窗帘');
        }
      } else {
        console.warn('窗帘控制功能受限 - 未提供onControlAllCurtains函数');
      }
    } catch (error) {
      if (debugMode) {
        console.error('开关所有窗帘时出错:', error);
      }
    }
  }, [onControlAllCurtains, curtainConfigs, debugMode, isValidConfig]);

  // 开关状态改变处理函数
  const onChange = (checked) => {
    console.log('窗帘开关状态改变:', checked ? '打开' : '关闭');
    console.log('当前开关状态:', checked);
    controlAllCurtains(checked);
  };

  useEffect(() => {
    function handleResize() {
      // 获取当前窗口的宽度
      const width = window.innerWidth;
      // 根据窗口宽度设置图片的宽度
      if (width < 1440) {
        // 移动设备
        setSwitchSize("small");
      } else {
        // PC设备
        setSwitchSize("default");
      }
    }
    handleResize();

    //监听页面大小
    window.addEventListener('resize', handleResize)
  })


  // 如果配置无效，返回null
  if (!isValidConfig) {
    return null;
  }

  return (
      // 窗帘控制卡片容器
      <div className="home-curtain-control-card flex-row">
          {/* 窗帘信息区域 */}
          <div className="home-curtain-info-section">
              {/* 标题和状态容器 */}
              <div className="home-curtain-title-container flex-row">
                  <span className="home-control-curtain-title">窗帘</span>
                  <span className="home-curtain-status-text">{curtainsStatus}</span>
              </div>
              {/* 房间信息 */}
              <span className="home-curtain-room">全屋</span>
              {/* 窗帘开关控件 */}
             {/*<div className="curtain-flex-container"> </div>*/}
                <Switch  size={switchSize} style={{width: '3.56vw',height: '5.56vw',margin:"0 1.66vw 2.84vw 0"}} checked={isAllCurtainsOpen} onChange={onChange} disabled={!hasCurtains} />

          </div>
          {/* 窗帘图片区域 */}
          <div className="home-curtain-image-section">
              <div className="curtain-animation-container">
                  <img
                      className={`home-curtain-image ${isAllCurtainsOpen ? 'curtain-open' : 'curtain-closed'}`}
                      src={imageAssets.curtain.icon}
                      alt="窗帘控制"
                  />
                  {/* 窗帘开启时的动画效果 */}
                  {isAllCurtainsOpen && (
                      <div className="curtain-animation-overlay curtain-opening"></div>
                  )}
              </div>
          </div>
      </div>
  );
}

export default CurtainControlSidebarCard;