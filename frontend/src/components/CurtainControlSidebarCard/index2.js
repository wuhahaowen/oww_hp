import React, {useMemo, useState} from 'react';
import {useEntities, useEntity} from '@hakit/core';
import './style.css';
import {Switch} from "antd";
import imageAssets, {getAsset} from "../../imageIndex";

function CurtainControlSidebarCard({ curtainControlSidebarConfig = { curtains: [], globalControl: true } }) {
 // const [showControl, setShowControl] = useState(false);
 // const [selectedLight, setSelectedLight] = useState(null);
  const debugMode = process.env.NODE_ENV === 'development';
 // const [curtainsImg, setCurtainsImg] = useState("");
 // const [curtainsStatus, setCurtainsStatus] = useState("");

  // 提取窗帘实体
  if (!curtainControlSidebarConfig || typeof curtainControlSidebarConfig !== 'object') {
    return null;
  }
  const curtainEntities = Object.entries(curtainControlSidebarConfig.curtains).reduce((acc, [key, lightConfig]) => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const entity = useEntity(lightConfig.entity_id);
      acc[key] = {
        ...lightConfig,
        entity,
        isLight: lightConfig.entity_id.startsWith('cover.')
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

  console.log(curtainEntities)

  // const curtainEntities = useMemo(() => {
  //   const { curtains = [] } = curtainControlSidebarConfig;
  //   return curtains.map((curtain, index) => ({
  //     key: curtain.entity_id || `curtain_${index}`,
  //     entity_id: curtain.entity_id || `cover.${index}`,
  //     name: curtain.name || `窗帘 ${index + 1}`,
  //     area: curtain.area || 'Unknown'
  //   }));
  // }, [curtainControlSidebarConfig]);
  //
  // // // 提取实体ID用于Hook调用
  // const entityIds = useMemo(() => {
  //   return curtainEntities.map(curtain => curtain.entity_id).filter(b);
  // }, [curtainEntities]);
  // //
  // // // 使用useEntities一次性获取所有实体，避免在循环中调用useEntity
  //  const entities = useEntities(entityIds, { returnNullIfNotFound: true });
  //
  // // 处理窗帘数据
  // const activeCurtainDevices = useMemo(() => {
  //   return curtainEntities
  //       .map((curtain, index) => {
  //         const entity = entities[index];
  //         if (!entity) return null;
  //         return {
  //           ...curtain,
  //           entity: entity
  //         };
  //       })
  //       .filter(curtain => curtain !== null);
  // }, [curtainEntities, entities]);

  // // 计算统计数据
  // const totalCurtains = activeCurtainDevices.length;
  // const openCurtains = activeCurtainDevices.filter(curtain =>
  //     curtain.entity?.state === 'open'
  // ).length;
  // const closedCurtains = activeCurtainDevices.filter(curtain =>
  //     curtain.entity?.state === 'closed'
  // ).length;

  // const avgPosition = useMemo(() => {
  //   const positions = activeCurtainDevices
  //       .filter(curtain => curtain.entity?.attributes?.current_position !== undefined)
  //       .map(curtain => curtain.entity.attributes.current_position);
  //
  //   if (positions.length === 0) return 0;
  //   return positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
  // }, [activeCurtainDevices]);

  // 控制所有窗帘
  const controlAllCurtains = async (action) => {
    const serviceMap = {
      'open': 'open_cover',
      'close': 'close_cover',
      'stop': 'stop_cover'
    };

    const service = serviceMap[action];
    if (!service) return;

    const promises = curtainEntities.map(async (curtain) => {
      try {
       // eslint-disable-next-line react-hooks/rules-of-hooks
       // const  newCurtain =useEntity(curtain.entity_id);
        await  curtain.entity.service.callService('cover', service, {
          entity_id: curtain.entity_id
        });
      } catch (error) {
        if (debugMode) {
          console.warn(`控制窗帘失败 ${action} ${curtain.name}:`, error);
        }
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      if (debugMode) {
        console.warn(`控制所有窗帘失败 ${action}:`, error);
      }
    }
  };

  const onChange = (checked) => {
    if(checked){
    //  setCurtainsImg(getAsset('curtain', 'icon'));
    //  setCurtainsStatus("ON");
      controlAllCurtains("open");
    }else{
      //setCurtainsImg(getAsset('curtain', 'icon'));
    //  setCurtainsStatus("OFF");
      controlAllCurtains("close");
    }
  };

  // 控制单个窗帘
  const controlIndividualCurtain = async (curtain, action) => {
    const serviceMap = {
      'open': 'open_cover',
      'close': 'close_cover',
      'stop': 'stop_cover'
    };

    const service = serviceMap[action];
    if (!service) return;

    try {
      await curtain.entity.service.callService('cover', service, {
        entity_id: curtain.entity_id
      });
    } catch (error) {
      if (debugMode) {
        console.warn(`控制窗帘失败 ${action} ${curtain.name}:`, error);
      }
    }
  };

  return (
      <div className="curtain-control-group flex-row">
        <div className="curtain-control-info flex-col">
          <span className="curtain-control-title">窗帘</span>
          <span className="curtain-control-area">全屋</span>
          <Switch className="curtain-control-switch"  size ="small"  onChange={onChange} />
        </div>
        <span className="curtain-control-status">{"OFF"}</span>
        <div className="curtain-control-image-wrapper flex-col">
          <img
              className="curtain-control-image"
              src={imageAssets.curtain.icon}
          />
        </div>
      </div>
  );
}

export default CurtainControlSidebarCard;