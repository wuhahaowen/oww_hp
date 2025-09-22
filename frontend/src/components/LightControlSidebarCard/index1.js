// import React, {useState,useEffect, useMemo} from 'react';
// import {useEntity,useEntities} from '@hakit/core';
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
//     // 确保 config 是一个对象
//     if (!lightControlConfig || typeof lightControlConfig !== 'object') {
//         return null;
//     }
//     // 计算灯光状态
//     const activeLights = Object.values(lightControlConfig.lights).filter(light => light.entity?.state === 'on').length;
//     const totalLights = Object.keys(lightControlConfig.lights).length;
//     const allLightsOn = activeLights === totalLights;
//     const allLightsOff = activeLights === 0;
//
//     const onLights = Object.values(lightControlConfig.lights).filter(light => light.entity?.state === 'on');
//     const offLights = Object.values(lightControlConfig.lights).filter(light => light.entity?.state === 'off');
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
//                 offLights.forEach(light => {
//                     console.log(`Turning on light: ${light.entity_id}`);
//                 });
//             } else {
//                 onLights.forEach(light => {
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
//     // 根据实际灯光状态更新UI
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
//
//     // const onChange = (checked) => {
//     //     if (checked) {
//     //         toggleLight("turn_on").then(r => {
//     //             setLightImg(getAsset('lighting', 'allOn'));
//     //             setLightStatus("ON");
//     //         });
//     //     } else {
//     //         toggleLight("turn_off").then(r => {
//     //             setLightImg(getAsset('lighting', 'allOff'));
//     //             setLightStatus("OFF");
//     //         });
//     //
//     //     }
//     // };
//
//     // const toggleLight = async (param) => {
//     //     try {
//     //         if (param === 'turn_on') {
//     //             offLights.map(light => light.entity.service.callService('light', param, {entity_id: light.entity_id}))
//     //         } else {
//     //             onLights.map(async (light) => {
//     //                 if (light.entity) {
//     //                     try {
//     //                         await light.entity.service.callService('light', param, {
//     //                             entity_id: light.entity_id
//     //                         });
//     //                     } catch (error) {
//     //                         if (debugMode) {
//     //                             console.warn(`Failed to ${param} light ${light.name}:`, error);
//     //                         }
//     //                     }
//     //                 }
//     //             })
//     //         }
//     //     } catch (error) {
//     //     }
//     // };
//
//     return (
//         <div className="home-light-control-card flex-row">
//             <div className="home-light-info-section flex-col">
//                 <span className="home-control-light-title">灯光</span>
//                 <span className="home-light-room">全屋</span>
//                 <Switch className="home-light-switch" size="small" onChange={onChange}/>
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