// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTheme } from '../../theme/ThemeContext';
// import { useLanguage } from '../../i18n/LanguageContext';
// import LanhuStatusBar from '../../components/LanhuStatusBar';
// import LanhuControlCard from '../../components/LanhuControlCard';
// import LanhuRoomNavigation from '../../components/LanhuRoomNavigation';
// import { getAsset, assetGroups } from '../../imageIndex';
// import './style.css';
//
// const ControlPanel = () => {
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const { t } = useLanguage();
//   const [selectedRoom, setSelectedRoom] = useState('全部');
//
//   // 控制设备状态
//   const [deviceStates, setDeviceStates] = useState({
//     lighting: { isOn: false, status: 'OFF' },
//     climate: { isOn: true, status: 'ON' },
//     curtain: { isOn: false, status: 'OFF' }
//   });
//
//   const handleDeviceToggle = (deviceType) => {
//     setDeviceStates(prev => ({
//       ...prev,
//       [deviceType]: {
//         isOn: !prev[deviceType].isOn,
//         status: !prev[deviceType].isOn ? 'ON' : 'OFF'
//       }
//     }));
//   };
//
//   const handleModeSelect = (mode) => {
//     console.log('Selected mode:', mode);
//     // 这里可以添加模式切换逻辑
//   };
//
//   const getCurrentTime = () => {
//     const now = new Date();
//     return now.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     });
//   };
//
//   const getCurrentDate = () => {
//     const now = new Date();
//     return now.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
//
//   return (
//     <div className="lanhu-control-panel">
//       {/* 背景图片 */}
//       <div
//         className="panel-background"
//         style={{
//           backgroundImage: `url(${getAsset('common', 'background')})`
//         }}
//       >
//         <div className="panel-content">
//           {/* 状态栏 */}
//           <LanhuStatusBar
//             time={getCurrentTime()}
//             date={getCurrentDate()}
//             batteryLevel="100%"
//           />
//
//           <div className="main-layout">
//             {/* 左侧控制面板 */}
//             <div className="left-panel">
//               {/* 头部信息 */}
//               <div className="home-header">
//                 <img
//                   className="home-icon"
//                   src={getAsset('common', 'home')}
//                   alt="home"
//                 />
//                 <span className="home-title">阳先生的家</span>
//               </div>
//
//               {/* 时间和天气 */}
//               <div className="time-weather">
//                 <span className="current-time">{getCurrentTime()}</span>
//                 <img
//                   className="weather-icon"
//                   src={getAsset('weather', 'sunny')}
//                   alt="weather"
//                 />
//               </div>
//
//               <div className="weather-info">
//                 <span className="date-info">2025-08-13 Web</span>
//                 <img
//                   className="weather-detail-icon"
//                   src={getAsset('sensors', 'temperature')}
//                   alt="temp"
//                 />
//                 <span className="temperature">32℃</span>
//                 <img
//                   className="humidity-icon"
//                   src={getAsset('sensors', 'humidity')}
//                   alt="humidity"
//                 />
//                 <span className="humidity">70%</span>
//               </div>
//
//               {/* 灯光状态 */}
//               <div className="lighting-status">
//                 <div className="status-header">
//                   <span className="status-title">灯光</span>
//                   <img
//                     className="lighting-icon"
//                     src={getAsset('lighting', 'icon')}
//                     alt="lighting"
//                   />
//                 </div>
//                 <div className="status-info">
//                   <span className="status-text">
//                     当前：0<span className="status-divider">/ 54</span> 个灯开启
//                   </span>
//                   <img
//                     className="bulb-icon"
//                     src={getAsset('lighting', 'bulb')}
//                     alt="bulb"
//                   />
//                 </div>
//               </div>
//
//               {/* 常用开关 */}
//               <div className="common-controls">
//                 <div className="controls-header">
//                   <span className="controls-title">常用开关</span>
//                 </div>
//
//                 <div className="control-items">
//                   <LanhuControlCard
//                     type="light"
//                     title="灯光"
//                     subtitle="全屋"
//                     status={deviceStates.lighting.status}
//                     isOn={deviceStates.lighting.isOn}
//                     onClick={() => handleDeviceToggle('lighting')}
//                     backgroundImage={getAsset('lighting', 'control')}
//                   />
//
//                   <LanhuControlCard
//                     type="climate"
//                     title="空调"
//                     subtitle="全屋"
//                     status={deviceStates.climate.status}
//                     isOn={deviceStates.climate.isOn}
//                     onClick={() => handleDeviceToggle('climate')}
//                     backgroundImage={getAsset('climate', 'icon')}
//                   />
//
//                   <LanhuControlCard
//                     type="curtain"
//                     title="窗帘"
//                     subtitle="全屋"
//                     status={deviceStates.curtain.status}
//                     isOn={deviceStates.curtain.isOn}
//                     onClick={() => handleDeviceToggle('curtain')}
//                     backgroundImage={getAsset('curtain', 'stop')}
//                   />
//                 </div>
//               </div>
//
//               {/* 分隔线 */}
//               <img
//                 className="separator"
//                 src={getAsset('common', 'separator')}
//                 alt="separator"
//               />
//
//               {/* 导航 */}
//               <div className="navigation">
//                 <span className="nav-title">全屋总览</span>
//                 <div
//                   className="control-panel-nav"
//                   onClick={() => navigate('/control-overview')}
//                 >
//                   <img
//                     className="nav-icon"
//                     src={getAsset('overview', 'controlPanel')}
//                     alt="control-panel"
//                   />
//                   <span className="nav-text">控制面板</span>
//                 </div>
//               </div>
//             </div>
//
//             {/* 右侧面板 */}
//             <div className="right-panel">
//               {/* 房间导航 */}
//               <LanhuRoomNavigation
//                 selectedRoom={selectedRoom}
//                 onRoomChange={setSelectedRoom}
//               />
//
//               <div className="right-content">
//                 {/* 每日一言 */}
//                 <div className="daily-quote">
//                   <h3>每日一言</h3>
//                   <p>如果你是一批千里马，那么请做自己的伯乐。</p>
//                   <span className="quote-source">-《马说》</span>
//                 </div>
//
//                 {/* 功能模式 */}
//                 <div className="function-modes">
//                   <h3>功能模式</h3>
//                   <div className="mode-grid">
//                     {[
//                       { key: 'home', name: '回家模式', icon: getAsset('modes', 'home') },
//                       { key: 'away', name: '离家模式', icon: getAsset('modes', 'away') },
//                       { key: 'movie', name: '观影模式', icon: getAsset('modes', 'movie') },
//                       { key: 'sleep', name: '睡眠模式', icon: getAsset('modes', 'sleep') }
//                     ].map((mode, index) => (
//                       <div
//                         key={index}
//                         className="mode-item"
//                         onClick={() => handleModeSelect(mode.key)}
//                       >
//                         <img src={mode.icon} alt={mode.name} />
//                         <span>{mode.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//
//                 {/* 天气面板 */}
//                 <div className="weather-panel">
//                   <div className="weather-header">
//                     <img
//                       src={getAsset('weather', 'weatherIcon')}
//                       alt="weather-icon"
//                     />
//                     <span>天气</span>
//                   </div>
//                   <div className="weather-location">
//                     <span>湖南·长沙</span>
//                     <span>2025-08-13 09:20 星期三</span>
//                   </div>
//                   <div className="weather-suggestion">
//                     <span>穿衣指数</span>
//                     <span>建议穿着凉爽透气的夏季服装</span>
//                   </div>
//                   <div className="weather-data">
//                     <span>39.8℃</span>
//                     <span>70%</span>
//                     <span>1006.5hPa</span>
//                     <span>东南风 3级</span>
//                   </div>
//                   <div className="weather-labels">
//                     <span>温度</span>
//                     <span>湿度</span>
//                     <span>气压</span>
//                     <span>风况</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ControlPanel;