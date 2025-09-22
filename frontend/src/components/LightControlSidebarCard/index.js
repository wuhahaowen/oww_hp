import React, {useState,useMemo,useRef} from 'react';
import './style.css';
import {useEntity} from '@hakit/core';
import imageAssets from "../../imageIndex";
import {Switch} from "antd";
import {useLanguage} from "../../i18n/LanguageContext";
import {renderText} from "./LightControlItem";


function LightControlSidebarCard({lightControlConfig=[]}) {
    const {t} = useLanguage();
    const debugMode = process.env.NODE_ENV === 'development';
    let checkAll = false;


    // 确保 config 是一个对象
    if (!lightControlConfig || typeof lightControlConfig !== 'object') {
        return null;
    }

    const lightEntities = Object.entries(lightControlConfig).reduce((acc, [key, lightConfig]) => {
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
           const entity = useEntity(lightConfig.entity_id);
           acc[key] = {
               ...lightConfig,
               entity,
               isLight: lightConfig.entity_id.startsWith('light.')
           };

            return acc;
        } catch (error) {
            // if (debugMode) {
            //     notification.error({
            //         message: t('lightStatus.loadError'),
            //         description: t('lightStatus.loadErrorDesc') + (lightConfig.name || lightConfig.entity_id) + ' - ' + error.message,
            //         placement: 'topRight',
            //         duration: 3,
            //         key: 'LightStatusCard',
            //     });
            // }
            return acc;
        }
    }, {});
  // console.log(lightEntities)

    // Calculate light states
    const activeLights = Object.values(lightEntities).filter(light => light.entity.state === 'on').length;
    const totalLights = Object.keys(lightEntities).length;
    const allLightsOn = activeLights === totalLights;
    const allLightsOff = activeLights === 0;

    const onLights = Object.values(lightEntities).filter(light => light.entity.state === 'on');

    const offLights = Object.values(lightEntities).filter(light => light.entity.state === 'off');


    const onChange = (checked) => {
        if (checked) {
            console.log("checkAll",{checkAll})
            toggleLight("turn_on").then(r=>{
              //  lightStatus = getAsset('lighting', 'allOn');
              // setLightStatus("ON");
                checkAll = true;
            });


        } else {
            toggleLight("turn_off").then(r=>{
              //  setLightImg(getAsset('lighting', 'allOff'));
              //  setLightStatus("OFF");
                checkAll = false;
            });

        }
    };

    const toggleLight = async (param) => {
        try {
            if (param === 'turn_on') {
                Object.values(lightEntities).map( (light) => {
                    console.log(`Turning on light: ${light}`)
                    if (light.entity) {

                        try {
                             light.entity.service.callService('light', param, {
                                entity_id: light.entity_id
                            });
                        } catch (error) {
                            if (debugMode) {
                                console.warn(`Failed to ${param} light ${light.name}:`, error);
                            }
                        }
                    }
                })
            } else {
                Object.values(lightEntities).map( (light) => {
                    if (light.entity) {
                        try {
                             light.entity.service.callService('light', param, {
                                entity_id: light.entity_id
                            });
                        } catch (error) {
                            if (debugMode) {
                                console.warn(`Failed to ${param} light ${light.name}:`, error);
                            }
                        }
                    }
                })
            }
        } catch (error) {
        }
    };

    return (
        <div className="home-light-control-card flex-row">
            <div className="home-light-info-section flex-col">
                <span className="home-control-light-title">灯光</span>
                <span className="home-light-room">全屋</span>
                <Switch className="home-light-switch" size="small"  />
            </div>
            <span className="home-light-status-text">OFF</span>
            <img
                alt=""
                className="home-light-bulb-image"
                referrerPolicy="no-referrer"
                src={imageAssets.lighting.allOff}
            />
        </div>

    //
    // <div className="home-light-control-card flex-row">
    //     <div className="home-light-info-section flex-col">
    //         <span className="home-control-light-title">灯光</span>
    //         <span className="home-light-room">全屋</span>
    //         <Switch className="home-light-switch" size="small" onChange={onChange}/>
    //     </div>
    //     <img
    //         alt=""
    //         className="home-light-bulb-image"
    //         referrerPolicy="no-referrer"
    //     />
    // </div>
)
    ;
}

export default LightControlSidebarCard;