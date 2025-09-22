import React, { useState, useRef } from 'react';
import Icon from '@mdi/react';
import { 
  mdiPower,
  mdiBrightness6,
  mdiThermometer,
  mdiCreationOutline
} from '@mdi/js';
import { Popup, List } from 'antd-mobile';
import { useEntity } from '@hakit/core';
import { useLanguage } from '../../i18n/LanguageContext';
import './LightControl.css';
import imageAssets from '../../imageIndex';
import {renderIcon} from "../../common/SvgIndex";

function LightControl({ lightEntity,lightName ,onClose }) {
  const { t } = useLanguage();
  const entity = useEntity(lightEntity.entity_id);
  const isDraggingRef = useRef(false);
  const isDraggingTempRef = useRef(false);
  const sliderRef = useRef(null);
  const tempSliderRef = useRef(null);
  const [showEffectPopup, setShowEffectPopup] = useState(false);
  
  

  // const handleColorTempChange = (e) => {
  //   const value = e.target.value;
  //   const min = entity.attributes?.min_mireds || 175;
  //   const max = entity.attributes?.max_mireds || 333;
  //   const percent = ((value - min) / (max - min)) * 100;
  //   const container = e.target.parentElement;
  //   container.style.setProperty('--value-percent', `${percent}%`);
  //   entity.service.turn_on({ serviceData: { color_temp: parseInt(value) } });
  // };

  const handleEffectChange = (effect) => {
    entity.service.turn_on({ serviceData: { effect } });
    setShowEffectPopup(false);
  };

  const updateBrightnessFromX = (x, width, updateService = true) => {
    console.log('Updating brightness, x:', x, 'width:', width);
    const boundedX = Math.min(Math.max(0, x), width);
    const percent = ( boundedX / width) * 100;
    const brightness = Math.round((percent / 100) * 255);
    
    console.log('Setting brightness to:', brightness, 'percent:', percent);
    sliderRef.current.style.setProperty('--value-percent', `${percent}%`);
    
    if (updateService) {
      entity.service.turn_on({ serviceData: { brightness } });
    }
    return brightness;
  };

  // 鼠标事件处理
  const handleSliderMouseDown = (e) => {
    const isTouchEvent = e.type === 'touchstart';
    console.log('Event type:', e.type, 'isTouchEvent:', isTouchEvent);
    
    const eventData = isTouchEvent ? e.touches[0] : e;
    console.log('Event data:', eventData);
    
    const target = isTouchEvent 
      ? document.elementFromPoint(eventData.clientX, eventData.clientY)
      : e.target;
    
    console.log('Target:', target);
    const isHandle = target?.classList.contains('light-control-slider-handle');
    console.log('Is handle:', isHandle);
    
    if (isHandle) {
      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = eventData.clientX - rect.left;
      updateBrightnessFromX(x, rect.width);
      return;
    }
    
    if (isTouchEvent) {
      e.preventDefault();
    }
    
    console.log('Starting drag');
    isDraggingRef.current = true;
    sliderRef.current.classList.add('dragging');

    const handleMove = (moveEvent) => {
      console.log('Move event type:', moveEvent.type);
      if (!isDraggingRef.current || !sliderRef.current) {
        console.log('Move ignored - isDragging:', isDraggingRef.current);
        return;
      }
      
      const moveData = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0] 
        : moveEvent;
      
      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = moveData.clientX - rect.left;
      console.log('Moving to x:', x);
      updateBrightnessFromX(x, rect.width, false);
    };

    const handleEnd = (endEvent) => {
      console.log('End event type:', endEvent.type);
      if (isDraggingRef.current && sliderRef.current) {
        const endData = endEvent.type === 'touchend'
          ? endEvent.changedTouches[0]
          : endEvent;
        
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const x = endData.clientX - rect.left;
        console.log('Final x:', x);
        updateBrightnessFromX(x, rect.width, true);
      }
      
      isDraggingRef.current = false;
      sliderRef.current?.classList.remove('dragging');
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    if (isTouchEvent) {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    } else {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    }
  };

  const updateColorTempFromX = (x, width, updateService = true) => {
    const boundedX = Math.min(Math.max(0, x), width);
    const percent =  (boundedX / width) * 100;

    const minK = entity.attributes?.min_color_temp_kelvin || 2700;
    const maxK = entity.attributes?.max_color_temp_kelvin || 6500;
    const kelvin = Math.round(minK + (percent * (maxK - minK)) / 100);

    tempSliderRef.current.style.setProperty('--value-percent', `${percent}%`);

    if (updateService) {
      entity.service.turn_on({
        serviceData: {
          color_temp_kelvin: kelvin
        }
      });
    }
    return kelvin;
  };

  // 色温控制的鼠标事件
  const handleTempMouseDown = (e) => {
    const isTouchEvent = e.type === 'touchstart';
    const eventData = isTouchEvent ? e.touches[0] : e;
    
    const target = isTouchEvent 
      ? document.elementFromPoint(eventData.clientX, eventData.clientY)
      : e.target;
    
    const isHandle = target?.classList.contains('light-control-slider-handle');
    
    if (!isHandle) {
      const slider = tempSliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = eventData.clientX - rect.left;
      updateColorTempFromX(x, rect.width);
      return;
    }
    
    if (isTouchEvent) {
      e.preventDefault();
    }
    
    isDraggingTempRef.current = true;
    tempSliderRef.current.classList.add('dragging');

    const handleMove = (moveEvent) => {
      if (!isDraggingTempRef.current || !tempSliderRef.current) return;
      
      const moveData = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0] 
        : moveEvent;
      
      const slider = tempSliderRef.current;
      const rect = slider.getBoundingClientRect();
      const x = moveData.clientX - rect.left;
      updateColorTempFromX(x, rect.width, false);
    };

    const handleEnd = (endEvent) => {
      if (isDraggingTempRef.current && tempSliderRef.current) {
        const endData = endEvent.type === 'touchend'
          ? endEvent.changedTouches[0]
          : endEvent;
        
        const slider = tempSliderRef.current;
        const rect = slider.getBoundingClientRect();
        const x = endData.clientX - rect.left;
        updateColorTempFromX(x, rect.width, true);
      }
      
      isDraggingTempRef.current = false;
      tempSliderRef.current?.classList.remove('dragging');
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    if (isTouchEvent) {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    } else {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    }
  };
  // console.log(entity.attributes)
  React.useEffect(() => {
    const brightnessPercent = ((entity.attributes?.brightness || 0) / 255) * 100;
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--value-percent', `${brightnessPercent}%`);
    }

    if (tempSliderRef.current && entity.attributes?.color_temp_kelvin) {
      const minK = entity.attributes?.min_color_temp_kelvin || 2700;
      const maxK = entity.attributes?.max_color_temp_kelvin || 6500;
      const percent = ((maxK - entity.attributes.color_temp_kelvin) / (maxK - minK)) * 100;
     // const percent = ((entity.attributes.color_temp_kelvin - minK) / (maxK - minK)) * 100;
      tempSliderRef.current.style.setProperty('--value-percent', `${percent}%`);
    }
  }, [
    entity
  ]);

  // Calculate current values for display
  const brightnessPercent = Math.round(((entity.attributes?.brightness || 0) / 255) * 100);
  const currentColorTemp = entity.attributes?.color_temp_kelvin || 3500;
  const minK = entity.attributes?.min_color_temp_kelvin || 2700;
  const maxK = entity.attributes?.max_color_temp_kelvin || 6500;
  const colorTempPercent = Math.round(((maxK - currentColorTemp) / (maxK - minK)) * 100);

  const getLightImg = (effect) => {
    const iconMap = {
      '无模式': imageAssets.lightMode.DefaultMode,
      '日光':imageAssets.lightMode.DefaultMode,
      '月光（夜间）模式': imageAssets.lightMode.NightMode,
      '温馨': imageAssets.lightMode.DefaultMode,
      '电视模式（影院模式）':imageAssets.lightMode.TVMode,
      '阅读模式': imageAssets.lightMode.DefaultMode,
      '电脑模式':imageAssets.lightMode.PCMode,
      '助眠': imageAssets.lightMode.DefaultMode,
      '唤醒': imageAssets.lightMode.DefaultMode,
      '关闭': imageAssets.lightMode.CloseMode,
    };
    return iconMap[effect] || imageAssets.lightMode.DefaultMode;


  };


  return (
      <div className="light-control-container flex-col">
        <div className="light-control-header flex-row justify-between">
          <span className="light-control-title">{lightName}</span>
        </div>
        <span className="light-control-brightness-label">亮度调节</span>
        <div className="light-control-brightness-wrapper flex-row justify-between">
          <img
              alt=""
              className="light-control-brightness-icon-left"
              src={imageAssets.lighting.lightLow}
          />

          <div
              ref={sliderRef}
              className="light-control-custom-slider brightness-slider"
              onMouseDown={entity.state === 'on' ?handleSliderMouseDown: undefined}
              onTouchStart={entity.state === 'on' ?handleSliderMouseDown: undefined}
              onTouchMove={(e) => e.preventDefault()}
          >
            <div className="light-control-slider-track">
              <div className="light-control-slider-fill brightness-fill"></div>
            </div>
            <div className="light-control-slider-handle" ></div>
          </div>

          <img
              alt=""
              className="light-control-brightness-icon-right"
              src={imageAssets.lighting.lightHigh}
          />
        </div>

        <div className="light-control-brightness-value flex-row justify-between">
          <span className="light-control-brightness-number">{brightnessPercent} </span>
          <span className="light-control-brightness-percent">%</span>
        </div>


        <span className="light-control-temp-label">色温调节</span>
        <div className="light-control-temp-wrapper flex-row justify-between">
          <img
              className="light-control-temp-icon-left"
              src={imageAssets.lighting.shakedownLow}
          />

          <div
              ref={tempSliderRef}
              className="light-control-custom-slider temp-slider"
              onMouseDown={entity.state === 'on' ? handleTempMouseDown : undefined}
              onTouchStart={entity.state === 'on' ? handleTempMouseDown : undefined}
              onTouchMove={(e) => e.preventDefault()}
          >
            <div className="light-control-slider-track">
              <div className="light-control-slider-fill temp-fill"></div>
            </div>
            <div className="light-control-slider-handle"></div>
          </div>

          <img
              className="light-control-temp-icon-right"
              src={imageAssets.lighting.shakedownHigh}
          />
        </div>

          <span className="light-control-temp-value">{colorTempPercent}</span>

        {entity.attributes?.effect_list?.length > 0 && (
            <span className="light-control-effects-label">灯光效果</span>

        )}
        <div className="light-control-effects-wrapper">
          {entity.attributes?.effect_list?.map((effect,index) => (
                <div className= {`light-control-effect-item ${entity.attributes?.effect === effect ? 'active' : ''}`}  key={index} onClick={()=> handleEffectChange(effect)}>
                  <div className="light-control-effect-content">
                    <img
                        className="light-control-effect-icon"
                        src={
                          getLightImg(effect)
                        }
                    />
                    <span className="light-control-effect-text">{effect.length>4?effect.slice(0,4)+'.':effect}</span>
                  </div>
                </div>
          ))}
        </div>

              <div className= {`light-control-divider flex-col ${entity.state === 'on'  ? 'active' : ''}`} onClick={() => entity.service.toggle() }>
                <img
                    className="light-control-divider-icon"
                    src={
                      getLightImg('关闭')
                    }
                />
              </div>
              {/*<div className="light-control-bottom flex-col">*/}
              {/*  <div className="light-control-bottom-section flex-col"/>*/}
              {/*</div>*/}
            </div>
        );
        }

        export default LightControl;