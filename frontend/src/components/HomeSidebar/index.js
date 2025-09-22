import React from 'react';
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
                         activeButton = ""
                     }) {
    return (
        <aside className="home-sidebar flex-col">
            {/* Time and Weather Section */}
            <TimeWeatherSidebarCard
                currentTime={currentTime}
                timeCardConfig={timeCardConfig}
                weatherConfig={weatherConfig}
            />

            {/* Light Status Section */}
            <LightStatusSidebarCard
                allLights={allLights}
            />

            <div className="home_switch_group flex-row justify-between">
                <span className="home_switch_text">常用开关</span>
                <img
                    className="home_switch_icon"
                    src={imageAssets.common.cykg}
                />
            </div>

            {/* Light Control Section */}
            <LightControlSidebarCard
                lightControlConfig={lightControlConfig}
            />


            {/* Climate Control Section */}
            <ClimateControlSidebarCard
                climateControlSidebarConfig={climateControlSidebarConfig}
            />

            {/* Curtain Control Section */}
            <CurtainControlSidebarCard
                curtainControlSidebarConfig={curtainControlSidebarConfig}
            />

            {/* Bottom Navigation */}
            <HomeSidebarDashboard />

        </aside>
    );
}

export default HomeSidebar;