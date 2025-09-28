import React, { useCallback } from 'react';
import {useNavigate} from 'react-router-dom';
import {useLanguage} from '../../i18n/LanguageContext';
import {useTheme} from '../../theme/ThemeContext';
import imageAssets from '../../imageIndex';
import {
    TimeWeatherSidebarCard,
    LightStatusSidebarCard,
    LightControlSidebarCard,
    ClimateControlSidebarCard,
    CurtainControlSidebarCard,
    HomeSidebarDashboard
} from '../index';

import './style.css';

function HomeSidebar({
                         currentTime,
                         timeCardConfig,
                         allLights,
                         lightControlConfig,
                         climateControlSidebarConfig = {climates: [], globalControl: true},
                         curtainControlSidebarConfig = {curtains: [], globalControl: true},
                         weatherConfig = {entity_id: 'weather.home'},
                         onNavigateToOverview,
                         onNavigateToControl,
                         activeButton = "",
                         onToggleAllLights, // 灯光控制函数
                         onControlAllCurtains // 窗帘控制函数
                     }) {
    // 构造传递给 LightControlSidebarCard 的配置对象，使其与 LightStatusCard 的配置结构一致
    const lightControlCardConfig = {
        lights: allLights.reduce((acc, light, index) => {
            // 确保 light 对象存在且有 entity_id
            if (light && light.entity_id) {
                acc[`light_${index}`] = light;
            }
            return acc;
        }, {})
    };

    return (
        <div className="home-sidebar flex-col">
            {/* 时间和天气部分 - 显示当前时间和天气信息 */}
            <TimeWeatherSidebarCard
                currentTime={currentTime}
                timeCardConfig={timeCardConfig}
                weatherConfig={weatherConfig}
            />

            {/* 灯光状态部分 - 显示家中灯光的总体状态 */}
            <LightStatusSidebarCard
                allLights={allLights}
            />

            {/* 常用开关标题区域 - 居中对齐与其他控件保持一致 */}
            <div className="home_switch_group flex-row justify-between">
                <span className="home_switch_text">常用开关</span>
                <img
                    className="home_switch_icon"
                    src={imageAssets.common.cykg}
                />
            </div>

            {/* 灯光控制部分 - 提供全局灯光控制功能，居中对齐 */}
            <LightControlSidebarCard
                config={lightControlCardConfig}
                onToggleAllLights={onToggleAllLights} // 传递灯光控制函数
            />

            {/* 空调控制部分 - 提供全局空调控制功能，样式与灯光控制保持一致，居中对齐 */}
            <ClimateControlSidebarCard
                climateControlSidebarConfig={climateControlSidebarConfig}
            />

            {/* 窗帘控制部分 - 提供全局窗帘控制功能，样式与灯光控制保持一致，居中对齐 */}
            <CurtainControlSidebarCard
                curtainControlSidebarConfig={curtainControlSidebarConfig}
                onControlAllCurtains={onControlAllCurtains} // 传递窗帘控制函数
            />

            {/* 底部导航区域 - 提供页面导航功能 */}
            <HomeSidebarDashboard />

        </div>
    );
}

export default HomeSidebar;