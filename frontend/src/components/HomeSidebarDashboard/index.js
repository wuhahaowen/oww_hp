import React, {useState} from 'react';
import './style.css';

const HomeSidebarDashboard = () => {

    return (
        <div className="Home_sidebar_dashboard flex-row justify-between">
            <div className="Home_sidebar_dashboard_overview_group flex-row">
                <div className="Home_sidebar_dashboard_overview_box flex-row justify-between">
                    <img
                        className="Home_sidebar_dashboard_overview_icon"
                        src={
                            "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG1efab2a06bf3938426a31e7cf8d3b079.png"
                        }
                    />
                    <span className="Home_sidebar_dashboard_overview_text">全屋总览</span>
                </div>
            </div>
            <div className="Home_sidebar_dashboard_control_group  flex-col">
                <span className="Home_sidebar_dashboard_control_text">控制面板</span>
            </div>
        </div>
    );
};

export default HomeSidebarDashboard;