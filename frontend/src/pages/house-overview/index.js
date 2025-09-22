// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTheme } from '../../theme/ThemeContext';
// import { useLanguage } from '../../i18n/LanguageContext';
// import LanhuStatusBar from '../../components/LanhuStatusBar';
// import LanhuRoomNavigation from '../../components/LanhuRoomNavigation';
// //import { getAsset } from '../../assets/lanhu';
// import { getAsset } from '../../imageIndex';
// import './style.css';
//
// const HouseOverview = () => {
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const { t } = useLanguage();
//   const [selectedRoom, setSelectedRoom] = useState('全部');
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
//   const lightingDevices = [
//     { name: '办公吊灯', isOn: true },
//     { name: '样板间吊灯', isOn: false },
//     { name: '走廊灯', isOn: true },
//     { name: '客餐厅灯', isOn: false },
//     { name: '医疗区灯', isOn: true },
//     { name: '病房灯', isOn: false },
//     { name: '问诊室灯', isOn: true },
//     { name: '卧室1灯', isOn: false },
//     { name: '数字展厅灯', isOn: true },
//     { name: '门头', isOn: false },
//     { name: '厨房灯', isOn: true },
//     { name: '卧室吊灯', isOn: false }
//   ];
//
//   const handleLightToggle = (deviceName) => {
//     console.log(`Toggle light: ${deviceName}`);
//   };
//
//   const handleAllLightsOn = () => {
//     console.log('Turn on all lights');
//   };
//
//   const handleAllLightsOff = () => {
//     console.log('Turn off all lights');
//   };
//
//   return (
//     <div className="lanhu-house-overview">
//       <div
//         className="overview-background"
//         style={{
//           backgroundImage: `url(${getAsset('common', 'background')})`
//         }}
//       >
//         <div className="overview-content">
//           {/* 状态栏 */}
//           <LanhuStatusBar
//             time={getCurrentTime()}
//             date={getCurrentDate()}
//             batteryLevel="100%"
//           />
//
//           <div className="overview-layout">
//             {/* 左侧控制信息 */}
//             <div className="left-info-panel">
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
//               {/* 返回按钮 */}
//               <div
//                 className="back-button"
//                 onClick={() => navigate('/control-panel')}
//               >
//                 <img
//                   src={getAsset('overview', 'controlPanel')}
//                   alt="back"
//                 />
//                 <span>返回控制面板</span>
//               </div>
//             </div>
//
//             {/* 主要内容区域 */}
//             <div className="main-overview-panel">
//               {/* 房间导航 */}
//               <LanhuRoomNavigation
//                 selectedRoom={selectedRoom}
//                 onRoomChange={setSelectedRoom}
//               />
//
//               {/* 灯光控制面板 */}
//               <div className="lighting-control-panel">
//                 <div className="lighting-header">
//                   <div className="lighting-info">
//                     <span className="lighting-title">灯光面板</span>
//                     <span className="lighting-status">共计：7 / 54 个开启</span>
//                   </div>
//                   <div className="lighting-controls">
//                     <button
//                       className="control-button all-on"
//                       onClick={handleAllLightsOn}
//                     >
//                       <img
//                         src={getAsset('lighting', 'allOn')}
//                         alt="all-on"
//                       />
//                       <span>全开</span>
//                     </button>
//                     <button
//                       className="control-button all-off"
//                       onClick={handleAllLightsOff}
//                     >
//                       <img
//                         src={getAsset('lighting', 'allOff')}
//                         alt="all-off"
//                       />
//                       <span>全关</span>
//                     </button>
//                   </div>
//                 </div>
//
//                 {/* 灯光设备网格 */}
//                 <div className="lighting-grid">
//                   {lightingDevices.map((device, index) => (
//                     <div
//                       key={index}
//                       className={`lighting-device ${device.isOn ? 'device-on' : 'device-off'}`}
//                       onClick={() => handleLightToggle(device.name)}
//                     >
//                       <div className="device-icon">
//                         <img
//                           src={device.isOn
//                             ? getAsset('lighting', 'bulb')
//                             : getAsset('lighting', 'allOff')
//                           }
//                           alt={device.name}
//                         />
//                       </div>
//                       <span className="device-name">{device.name}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//
//               {/* 系统状态信息 */}
//               <div className="system-status">
//                 {/* 光照传感器 */}
//                 <div className="sensor-group">
//                   <h3>光照传感器</h3>
//                   <div className="sensor-grid">
//                     {[
//                       { name: '西南照明', value: '3,618,098,240', unit: 'lux' },
//                       { name: '东北照明', value: '2,496,013,803', unit: 'lux' },
//                       { name: '西北照明', value: '1,951,938,533', unit: 'lux' },
//                       { name: '东南照明', value: '3,875,492,212', unit: 'lux' }
//                     ].map((sensor, index) => (
//                       <div key={index} className="sensor-item">
//                         <div className="sensor-info">
//                           <span className="sensor-name">{sensor.name}</span>
//                           <span className="sensor-value">{sensor.value}</span>
//                         </div>
//                         <span className="sensor-unit">{sensor.unit}</span>
//                         <img
//                           className="sensor-icon"
//                           src={getAsset('sensors', 'light')}
//                           alt="light-sensor"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//
//                 {/* 人体传感器 */}
//                 <div className="sensor-group">
//                   <h3>人体传感器</h3>
//                   <div className="motion-sensor-grid">
//                     {[
//                       { name: '样板间', count: '10', hasMotion: true },
//                       { name: '卧室', count: '无', hasMotion: false },
//                       { name: '教学区', count: '无', hasMotion: false },
//                       { name: '客厅', count: '无', hasMotion: false },
//                       { name: '医疗区', count: '无', hasMotion: false },
//                       { name: '卫生间', count: '无', hasMotion: false },
//                       { name: '产品展示', count: '无', hasMotion: false },
//                       { name: '展厅', count: '无', hasMotion: false },
//                       { name: '走廊', count: '无', hasMotion: false }
//                     ].map((sensor, index) => (
//                       <div key={index} className="motion-sensor-item">
//                         <div className="motion-info">
//                           <span className="motion-name">{sensor.name}</span>
//                           <span className="motion-count">{sensor.count}</span>
//                         </div>
//                         <span className="motion-unit">人</span>
//                         <img
//                           className="motion-icon"
//                           src={getAsset('sensors', 'motion')}
//                           alt="motion-sensor"
//                         />
//                         <div className={`motion-status ${sensor.hasMotion ? 'has-motion' : 'no-motion'}`} />
//                       </div>
//                     ))}
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
// export default HouseOverview;