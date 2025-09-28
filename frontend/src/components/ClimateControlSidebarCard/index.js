import React, { useState, useMemo,useRef,useEffect } from 'react';
import { useEntity } from '@hakit/core';
import './style.css';
import  {notification, Switch,ConfigProvider } from "antd";
import imageAssets, {getAsset} from "../../imageIndex";


// 空调控制侧边栏卡片组件
function ClimateControlSidebarCard({ climateControlSidebarConfig = { climates: [], globalControl: true } }) {
  // 状态变量定义
  const [selectedMode, setSelectedMode] = useState('auto'); // 选中的模式
  const debugMode = process.env.NODE_ENV === 'development'; // 调试模式
  const [climateImg, setClimateImg] = useState(""); // 空调图片状态
  const [climateStatus, setClimateStatus] = useState(""); // 空调状态
  const switchRef = useRef(null);
  const [switchSize, setSwitchSize] = useState("small");

  // 主题配置
  const theme ={
    token:{
      handleSize: 58
    }
  }
  
  // 提取空调实体配置
  const climateEntities = useMemo(() => {
    const { climates = [] } = climateControlSidebarConfig;
    return climates.map((climate, index) => ({
      key: climate.entity_id || `climate_${index}`,
      entity_id: climate.entity_id || `climate.${index}`,
      name: climate.name || `空调 ${index + 1}`,
      area: climate.area || 'Unknown'
    }));
  }, [climateControlSidebarConfig]);

  // 提取实体ID用于Hook调用
  const entityIds = useMemo(() => {
    return climateEntities.map(climate => climate.entity_id);
  }, [climateEntities]);

  // 在组件顶层使用实体 - 创建动态hook调用
  const entities = {};

  // 由于实体数量是动态的，我们需要采用不同的方法
  const maxEntities = 20; // hook的合理限制
  const limitedEntityIds = entityIds.slice(0, maxEntities);

  // 在顶层为每个实体调用hook - 始终调用相同数量的hook
  const entity0 = useEntity(entityIds[0] || 'climate.dummy_0', { returnNullIfNotFound: true });
  const entity1 = useEntity(entityIds[1] || 'climate.dummy_1', { returnNullIfNotFound: true });
  const entity2 = useEntity(entityIds[2] || 'climate.dummy_2', { returnNullIfNotFound: true });
  const entity3 = useEntity(entityIds[3] || 'climate.dummy_3', { returnNullIfNotFound: true });
  const entity4 = useEntity(entityIds[4] || 'climate.dummy_4', { returnNullIfNotFound: true });
  const entity5 = useEntity(entityIds[5] || 'climate.dummy_5', { returnNullIfNotFound: true });
  const entity6 = useEntity(entityIds[6] || 'climate.dummy_6', { returnNullIfNotFound: true });
  const entity7 = useEntity(entityIds[7] || 'climate.dummy_7', { returnNullIfNotFound: true });
  const entity8 = useEntity(entityIds[8] || 'climate.dummy_8', { returnNullIfNotFound: true });
  const entity9 = useEntity(entityIds[9] || 'climate.dummy_9', { returnNullIfNotFound: true });

  // 将实体映射回它们的ID
  const entityArray = [entity0, entity1, entity2, entity3, entity4, entity5, entity6, entity7, entity8, entity9];
  entityIds.forEach((entityId, index) => {
    if (index < maxEntities && entityArray[index] && entityId) {
      entities[entityId] = entityArray[index];
    }
  });

  // 处理空调数据
  const activeClimateDevices = useMemo(() => {
    return climateEntities
      .filter(climate => entities[climate.entity_id])
      .map(climate => ({
        ...climate,
        entity: entities[climate.entity_id]
      }));
  }, [climateEntities, entityIds]);

  // 计算统计信息
  const totalClimateDevices = climateEntities.length; // 空调设备总数
  const onClimateDevices = Object.entries(climateEntities).filter(climate =>
    climate.entity?.state !== 'off'
  ).length; // 开启的空调设备数

  // 计算平均目标温度
  const avgTargetTemp = useMemo(() => {
    const temps = Object.entries(climateEntities)
      .filter(climate => climate.entity?.attributes?.temperature)
      .map(climate => parseFloat(climate.entity.attributes.temperature));

    if (temps.length === 0) return 0;
    return temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
  }, [climateEntities]);

  // 切换所有空调设备
  const toggleAllClimate = async () => {
    // 根据当前状态确定操作类型
    const action = onClimateDevices === totalClimateDevices ? 'turn_off' : 'turn_on';

    // 为每个实体创建操作Promise
    const promises = Object.entries(climateEntities).map(async (climate) => {
      try {
        await climate.entity.service.callService('climate', action, {
          entity_id: climate.entity_id
        });
      } catch (error) {
        if (debugMode) {
          console.warn(`切换空调失败 ${climate.name}:`, error);
        }
      }
    });

    try {
      // 等待所有操作完成
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn(`切换空调设备失败:`, error);
      }
    }
  };

  // 更改所有设备的模式
  const handleModeChange = async (mode) => {
    setSelectedMode(mode); // 更新选中的模式

    // 为每个开启的设备创建模式设置Promise
    const promises = Object.entries(climateEntities)
      .filter(climate => climate.entity?.state !== 'off')
      .map(async (climate) => {
        try {
          await climate.entity.service.callService('climate', 'set_hvac_mode', {
            entity_id: climate.entity_id,
            hvac_mode: mode
          });
        } catch (error) {
          if (debugMode) {
            console.warn(`设置空调模式失败 ${climate.name}:`, error);
          }
        }
      });

    try {
      // 等待所有操作完成
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn('设置空调模式失败:', error);
      }
    }
  };

  // 调整温度
  const handleTempAdjust = async (delta) => {
    // 计算新温度，限制在16-32度之间
    const newTemp = Math.max(16, Math.min(32, avgTargetTemp + delta));

    // 为每个开启的设备创建温度设置Promise
    const promises = Object.entries(climateEntities)
      .filter(climate => climate.entity?.state !== 'off')
      .map(async (climate) => {
        try {
          await climate.entity.service.callService('climate', 'set_temperature', {
            entity_id: climate.entity_id,
            temperature: newTemp
          });
        } catch (error) {
          if (debugMode) {
            console.warn(`设置空调温度失败 ${climate.name}:`, error);
          }
        }
      });

    try {
      // 等待所有操作完成
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn('设置空调温度失败:', error);
      }
    }
  };

  // 开关状态改变处理函数
  const onChange = (checked) => {
    alert(window.innerWidth+"---"+window.innerHeight);
    if(checked){
      // 开启所有空调
      toggleAllClimate().then(r=>{
        setClimateImg(getAsset('lighting', 'allOn'))
        setClimateStatus("ON")
      })
    }else{
      // 关闭所有空调
      toggleAllClimate().then(r=>{
        setClimateImg(getAsset('lighting', 'allOff'))
        setClimateStatus("OFF")
      })
    }
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


  return (
      // 空调控制卡片容器
      <div className="home-climate-control-card flex-row">
          {/* 空调信息区域 */}
          <div className="home-climate-info-section">
              {/* 标题和状态容器 */}
              <div className="home-climate-title-container flex-row">
                  <span className="home-control-climate-title">空调</span>
                  <span className="home-climate-status-text">{climateStatus?climateStatus:"OFF"}</span>
              </div>
              {/* 房间信息 */}
              <span className="home-climate-room">全屋</span>
              {/*<div className="flex-container" ></div>*/}
                {/* 空调开关控件 */}
                <Switch  ref={switchRef}  size={switchSize} style={{width: '3.56vw',height: '5.56vw',margin:"0 1.66vw 2.84vw 0"}} checked={climateStatus === "ON"} onChange={onChange} />

            
          </div>
          {/* 空调图片区域 */}
          <div className="home-climate-image-section">
              <img
                  className="home-climate-image"
                  src={imageAssets.climate.icon}
                  alt="空调控制"
              />
          </div>
      </div>
  );
}

export default ClimateControlSidebarCard;