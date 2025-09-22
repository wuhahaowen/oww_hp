// import React, {useState, useEffect, useMemo} from 'react';
// import {useEntity, useEntities} from '@hakit/core';
// import './style.css';
// import {useTheme} from '../../theme/ThemeContext';
// import {getAsset} from "../../imageIndex";
// import {notification, Switch} from "antd";
// import {useLanguage} from "../../i18n/LanguageContext";
//
// function LightControlSidebarCard({lightControlConfig}) {
//     const debugMode = process.env.NODE_ENV === 'development';
//     const {t} = useLanguage();
//     const [lightImg, setLightImg] = useState("");
//     const [lightStatus, setLightStatus] = useState("");
//
//     // 确保 config 是一个对象，但不要在这里提前返回
//     const isValidConfig = lightControlConfig && typeof lightControlConfig === 'object';
//
//     // 使用 useMemo 计算灯光状态，避免在条件语句中调用 Hook
//     const activeLights = useMemo(() => {
//         if (!isValidConfig) return 0;
//         return Object.values(lightControlConfig.lights).filter(light => light.entity?.state === 'on').length;
//     }, [lightControlConfig, isValidConfig]);
//
//     const totalLights = useMemo(() => {
//         if (!isValidConfig) return 0;
//         return Object.keys(lightControlConfig.lights).length;
//     }, [lightControlConfig, isValidConfig]);
//
//     const allLightsOn = activeLights === totalLights;
//     const allLightsOff = activeLights === 0;
//
//     const onLights = useMemo(() => {
//         if (!isValidConfig) return [];
//         return Object.values(lightControlConfig.lights).filter(light => light.entity?.state === 'on');
//     }, [lightControlConfig, isValidConfig]);
//
//     const offLights = useMemo(() => {
//         if (!isValidConfig) return [];
//         return Object.values(lightControlConfig.lights).filter(light => light.entity?.state === 'off');
//     }, [lightControlConfig, isValidConfig]);
//
//     const onChange = (checked) => {
//         if (checked) {
//             toggleLight("turn_on").then(() => {
//                 setLightImg(getAsset('lighting', 'allOn'));
//                 setLightStatus("ON");
//             });
//         } else {
//             toggleLight("turn_off").then(() => {
//                 setLightImg(getAsset('lighting', 'allOff'));
//                 setLightStatus("OFF");
//             });
//         }
//     };
//
//     const toggleLight = async (param) => {
//         try {
//             if (param === 'turn_on') {
//                 Object.values(lightControlConfig.lights).forEach(light => {
//                     light.entity?.service[param]();
//                     console.log(`Turning on light: ${light.entity_id}`);
//                 });
//             } else {
//                 Object.values(lightControlConfig.lights).forEach(light => {
//                     light.entity?.service[param]();
//                     console.log(`Turning off light: ${light.entity_id}`);
//                 });
//             }
//         } catch (error) {
//             if (debugMode) {
//                 console.error("Toggle light error:", error);
//             }
//         }
//         return Promise.resolve();
//     };
//
//     // 使用 useEffect 更新 UI，确保每次渲染时都调用
//     useEffect(() => {
//         if (allLightsOn) {
//             setLightImg(getAsset('lighting', 'allOn'));
//             setLightStatus("ON");
//         } else if (allLightsOff) {
//             setLightImg(getAsset('lighting', 'allOff'));
//             setLightStatus("OFF");
//         } else {
//             setLightImg(getAsset('lighting', 'allOff'));
//             setLightStatus("部分开启");
//         }
//     }, [allLightsOn, allLightsOff]);
//
//     // 返回组件内容，如果配置无效则返回空
//     if (!isValidConfig) {
//         return null;
//     }
//
//     return (
//         <div className="home-light-control-card flex-row">
//             <div className="home-light-info-section flex-col">
//                 <span className="home-control-light-title">灯光</span>
//                 <span className="home-light-room">全屋</span>
//                 <Switch className="home-light-switch" size ="small"    onChange={onChange}/>
//             </div>
//             <span className="home-light-status-text">{lightStatus ? lightStatus : "OFF"}</span>
//             <img
//                 alt=""
//                 className="home-light-bulb-image"
//                 referrerPolicy="no-referrer"
//                 src={lightImg ? lightImg : getAsset('lighting', 'allOff')}
//             />
//         </div>
//     );
// }
//
// export default LightControlSidebarCard;