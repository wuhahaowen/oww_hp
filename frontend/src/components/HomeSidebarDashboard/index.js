import React, {useState} from 'react';
import './style.css';
import imageAssets from '../../imageIndex';

const HomeSidebarDashboard = ({onNavigateToOverview, onNavigateToControl}) => {

    const [activeTab, setActiveTab] = useState('overview'); // 默认为全屋总览

    const handleOverviewClick = () => {
        setActiveTab('overview');
        if (onNavigateToOverview) {
            onNavigateToOverview();
        }
    };

    const handleControlClick = () => {
        setActiveTab('control');
        if (onNavigateToControl) {
            onNavigateToControl();
        }
    };

    return (
        <div className="Home_sidebar_dashboard flex-row justify-between">
            <div
                className={`Home_sidebar_dashboard_overview_group flex-row ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={handleOverviewClick}
            >
                <div className="Home_sidebar_dashboard_overview_box flex-row justify-between">
                    <img alt=""
                         className="Home_sidebar_dashboard_overview_icon"
                         src={
                             imageAssets.common.home
                         }
                    />
                    <span className="Home_sidebar_dashboard_overview_text">全屋总览</span>
                </div>
            </div>
            <div
                className={`Home_sidebar_dashboard_control_group  flex-col ${activeTab === 'control' ? 'active' : ''}`}
                onClick={handleControlClick}
            >
                <span className="Home_sidebar_dashboard_control_text">控制面板</span>
            </div>
        </div>
    );
};

export default HomeSidebarDashboard;