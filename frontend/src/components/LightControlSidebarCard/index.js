import React, {useState, useCallback, useMemo,useEffect} from 'react';
import './style.css';
import imageAssets from "../../imageIndex";
import {Switch} from "antd";

function LightControlSidebarCard({ config = {lights:[]}, onToggleAllLights }) {
    const [lightImg, setLightImg] = useState(imageAssets.lighting.allOff);
    const [lightStatus, setLightStatus] = useState("OFF");
    const [isAllLightsOn, setIsAllLightsOn] = useState(false);
    const [switchSize, setSwitchSize] = useState("small");
    const debugMode = localStorage.getItem('debugMode') === 'true';

    // 初始化默认值
    let isValidConfig = true;

    // 确保 config 是一个对象
    if (!config || typeof config !== 'object') {
        console.warn('LightControlSidebarCard: config is not an object or is null', config);
        isValidConfig = false;
    }
    // 检查 lights 是否存在且为对象
    if (isValidConfig && (!config.lights || typeof config.lights !== 'object')) {
        console.warn('LightControlSidebarCard: config.lights is not an object or is null', config.lights);
        isValidConfig = false;
    }
    
    // 使用 useMemo 计算 lightConfigs
    const { lightConfigs, hasLights } = useMemo(() => {
        if (!isValidConfig) {
            return { lightConfigs: [], hasLights: false };
        }
        
        const lightKeys = Object.keys(config.lights);
        if (lightKeys.length === 0) {
            console.warn('LightControlSidebarCard: config.lights is empty');
        }
        
        // 收集所有entity_id
        const lightConfigs = Object.entries(config.lights)
            .filter(([key, lightConfig]) => lightConfig && lightConfig.entity_id)
            .map(([key, lightConfig]) => ({key, entityId: lightConfig.entity_id, config: lightConfig}));

        const hasLights = lightConfigs.length > 0;
        
        return { lightConfigs, hasLights };
    }, [config, isValidConfig]);

    // 控制所有灯的开关
    const toggleAllLights = useCallback(async (turnOn) => {
        if (!isValidConfig) return;
        
        try {
            const newStatus = turnOn ? "ON" : "OFF";
            const newImage = turnOn ? imageAssets.lighting.allOn : imageAssets.lighting.allOff;

            // 更新UI状态
            setLightStatus(newStatus);
            setLightImg(newImage);
            setIsAllLightsOn(turnOn);

            console.log(`正在${turnOn ? '开启' : '关闭'}所有灯光...`);
            console.log('灯光配置列表:', lightConfigs);
            console.log('灯光数量:', lightConfigs.length);

            // 调用从props传入的控制函数
            if (onToggleAllLights) {
                await onToggleAllLights(turnOn, lightConfigs);
                console.log(`${turnOn ? '开启' : '关闭'}所有灯光操作已完成`);
                console.log('操作的灯光数量:', lightConfigs.length);
                
                // 添加确认信息
                if (!turnOn) {
                    console.log('✓ 已确认关闭所有灯光');
                } else {
                    console.log('✓ 已确认开启所有灯光');
                }
            } else {
                console.warn('灯光控制功能受限 - 未提供onToggleAllLights函数');
            }
        } catch (error) {
            if (debugMode) {
                console.error('开关所有灯光时出错:', error);
            }
        }
    }, [onToggleAllLights, lightConfigs, debugMode, isValidConfig]);

    const onChange = (checked) => {
        console.log('灯光开关状态改变:', checked ? '开启' : '关闭');
        console.log('当前开关状态:', checked);
        toggleAllLights(checked);
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
        return (
            <div className="home-light-control-card flex-row">
                <div className="home-light-info-section">
                    {/* 标题和状态容器 */}
                    <div className="home-light-title-container flex-row">
                        <span className="home-control-light-title">灯光</span>
                        <span className="home-light-status-text">加载中...</span>
                    </div>
                    {/* 房间信息 */}
                    <span className="home-light-room">全屋</span>
                    {/* 灯光开关控件 */}
                    <div className="flex-container">
                        <Switch className="home-light-switch"  size={"default"} checked={isAllLightsOn} onChange={onChange}
                                disabled={!hasLights}/>
                    </div>
                </div>
                <div className="home-light-image-section">
                    <img
                        alt=""
                        className="home-light-bulb-image"
                        referrerPolicy="no-referrer"
                        src={lightImg}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="home-light-control-card flex-row">
            <div className="home-light-info-section">
                {/* 标题和状态容器 */}
                <div className="home-light-title-container flex-row">
                    <span className="home-control-light-title">灯光</span>
                    <span className="home-light-status-text">{lightStatus}</span>
                </div>
                {/* 房间信息 */}
                <span className="home-light-room">全屋</span>
                {/* 灯光开关控件 */}
                {/*<div className="flex-container"></div>*/}
                    <Switch className="home-light-switch" size={switchSize} checked={isAllLightsOn} onChange={onChange}
                            disabled={!hasLights}/>

            </div>
            <div className="home-light-image-section">
                <img
                    alt=""
                    className="home-light-bulb-image"
                    referrerPolicy="no-referrer"
                    src={lightImg}
                />
            </div>
        </div>
    );
}

export default LightControlSidebarCard;