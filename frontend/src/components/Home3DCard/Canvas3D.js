// eslint-disable-next-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState, forwardRef } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import { Aether3d, THREE, OrbitControlsScript, EnvironmentMapScript, GLBLoaderScript, CSS2DLabelScript, FPSOptimizerScript } from './aether3d-engine.umd.js';
import { SmartHomeScene } from './SmartHomeScene.js';
import { PunkahDeviceScript } from './PunkahDeviceScript.js';
import { AirDeviceScript } from './AirDeviceScript.js';
import { CurtainDeviceScript } from './CurtainDeviceScript.js';
import { WasherDeviceScript } from './WasherDeviceScript.js';

const Canvas3D = forwardRef((props, ref) => {
  /** 引擎实例引用 */
  const engineRef = useRef(null);
  /** 配置对象 */
  const [error, setError] = useState(null);
  /** FPS优化脚本实例引用 */
  const fpsOptimizerScriptRef = useRef(null);
  /** 场景相机 */
  const orbitControlsScriptRef = useRef(null);
  /** 环境贴图脚本实例引用 */
  const environmentMapScriptRef = useRef(null);
  /** 已加载的模型对象引用 */
  const glbLoaderScriptRef = useRef(null);
  /** CSS2D标签脚本实例引用 */
  const css2dLabelScriptRef = useRef(null);
  /** 空调脚本实例引用 */
  const airDeviceRef = useRef(null);
  /** 智能家场景脚本实例引用 */
  const smartHomeSceneRef = useRef(null);
  /** 智能家场景对象引用 */
  const objectSelected = useRef(null);
  /** 风扇设备脚本实例引用 */
  const fanDeviceRef = useRef(null);
  /** 智能窗帘设备脚本实例引用 */
  const curtainDeviceRef = useRef(null);
  /** 智能洗衣机设备脚本实例引用 */
  const washerDeviceRef = useRef(null);
  /** 选择灯光设备的回调函数 */
  const selectionLightDeviceCallbackRef = useRef(null);


  useEffect(() => {
    let engine = null;
    let resizeHandler = null;
    
    // 更简单的错误处理函数
    const handleError = (error, context) => {
      // 添加调试信息
      console.log('handleError called with:', {
        error: error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        context: context
      });
      
      console.error(`[${context}] 发生错误:`, error);
      
      let errorMsg = '未知错误';
      if (error && error.message) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else {
        errorMsg = '系统错误';
      }
      
      setError(`${context}: ${errorMsg}`);
    };
    
    const initializeEngine = async () => {
      try {
        console.log('开始初始化3D引擎...');

        if (typeof THREE === 'undefined') {
          throw new Error('THREE.js库未能正确加载');
        }

        console.log('引擎文件加载成功');

        // 创建容器和 canvas
        const container = document.getElementById('canvas-container');
        console.log('📁 容器查找结果:', container);
        if (!container) {
          console.error('❌ Canvas容器未找到，跳过初始化');
          return;
        }
        
        // 检查容器是否已经有canvas
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
          console.log('⚠️ 容器中已存在canvas，先清理');
          existingCanvas.remove();
        }
        
        // 获取容器尺寸 - 使用视口尺寸确保3D场景覆盖全屏
        const canvas = document.createElement('canvas');        
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
        // 配置视口
        const config = {
            element: canvas,
            dpr: new THREE.Vector2(window.innerWidth, window.innerHeight),
            antialias: true,
            factor: 1,
            distance: 5,
            alpha:false,
            aspect: window.innerWidth / window.innerHeight,
            enablePostProcessing: false,
            enableLogarithmicDepthBuffer: false,
            enablePerformanceMonitoring: false,
            backgroundColor: '#485163',
            // 添加鼠标交互配置
            mouseInteraction: {
              interactionMode: 'both',
              enabled: true
            }
        };
        // 创建引擎实例
        console.log('正在创建引擎实例...', config);
        
        try {
          engine = new Aether3d(config);
          engineRef.current = engine;
          const fog = new THREE.Fog('#000000', 0, 40);  //创建雾效
          engine.scene.fog = fog;
          engine.camera.position.set(11.154575612004217, 16.958249890869915, 12.493937172563147);
          engine.camera.lookAt(0, 0, 0);
          // 设置场景背景
          engine.scene.background = new THREE.Color(0x222222);

          // 创建轨道控制器脚本
          orbitControlsScriptRef.current = new OrbitControlsScript({
            enableDamping: true,
            dampingFactor: 0.05,
            rotateSpeed: 0.5,
            zoomSpeed: 1.2,
            minPolarAngle: THREE.MathUtils.degToRad(45), // 固定45度角度
            maxPolarAngle: THREE.MathUtils.degToRad(45), // 固定45度角度，不允许上下旋转
            minDistance: 3,
            maxDistance: 20,
            enableRotate: true,
            enableZoom: false,
            enablePan:false,
          });
          // 设置默认相机位置和目标点
          orbitControlsScriptRef.current.setDefaultCameraPosition(
            new THREE.Vector3(11.154575612004217, 16.958249890869915, 12.493937172563147),
            new THREE.Vector3(0, 0, 0)
          );
          engine.addScript(orbitControlsScriptRef.current);
          engine.disableSelections(['Reflection','Mesh1687','feng','guanyun','dimian','qiang','pingmian','ding']);
          // 创建环境贴图脚本
          environmentMapScriptRef.current = new EnvironmentMapScript({
            hdrPath: '/hdr/0a200fbabae59dc8151768d9cc4c1c96.hdr',
            envPreset: 'hdr',
            enabled: true,
            envMapIntensity: 1,
            toneMapping: 'ACESFilmic',
            toneMappingExposure: 1.0,
            backgroundBlurriness: 1,
            backgroundIntensity: 1.0,
            environmentIntensity: 1.5,
            showBackground: false
          });
          engine.addScript(environmentMapScriptRef.current);

          fpsOptimizerScriptRef.current = new FPSOptimizerScript({
            enabled: true,
            targetFPS: 60,
            minFrameTime: 0.016,
            maxFrameTime: 0.033,
            useRequestAnimationFrame: true,
            adaptiveOptimization: true,
            maxObjects: 1000000,
          });
          engine.addScript(fpsOptimizerScriptRef.current);
          console.log('✅ fps', );
          // 创建GLB模型加载脚本
          glbLoaderScriptRef.current = new GLBLoaderScript({
            enableDraco: true,
            autoAddToScene: true
          });
          engine.addScript(glbLoaderScriptRef.current);

          // 创建CSS2D标签脚本
          css2dLabelScriptRef.current = new CSS2DLabelScript({
            container: canvas.parentElement || document.body,
            autoResize: true,
            zIndex: 1000,
            enabled: true
          });
          engine.addScript(css2dLabelScriptRef.current);

          smartHomeSceneRef.current = new SmartHomeScene(glbLoaderScriptRef.current, {model: '/ao/changjing.glb',
            name: 'HomeScript',
            position: [0,0.2, 0],
            rotation: [0, 0, 0],
            scale: [0.1, 0.1, 0.1]});
          smartHomeSceneRef.current.setCallback(selectionLightDeviceCallbackRef.current);
          engine.addScript(smartHomeSceneRef.current);

          airDeviceRef.current = new AirDeviceScript(glbLoaderScriptRef.current, {
            model: '/ao/lishikongtiao.glb',
            name: 'Air Device',
            position: [8.4, 0, 2],
            rotation: [0, Math.PI/2, 0],
            scale: [0.017, 0.017, 0.017],
            showLabels: true,
            labelContent: '空调设备',
            clickableLabels: true,
            onLabelClick: (data) => {
              orbitControlsScriptRef.current.focusOnObject(data.model);
              orbitControlsScriptRef.current.updateConfig({enableRotate: true, enableZoom: true});
              airDeviceRef.current.hideLabel();

            }
          });
          engine.addScript(airDeviceRef.current);

          fanDeviceRef.current = new PunkahDeviceScript(glbLoaderScriptRef.current, {model: '/ao/fengshang.glb',
            name: 'Punkah Device',
            position: [5,0.25, 3],
            rotation: [0, 0, 0],
            scale: [0.015, 0.015, 0.015],
            y:0.6,
            showLabels: true,
            labelContent: '风扇',
            clickableLabels: true,
            onLabelClick: (data) => {
              orbitControlsScriptRef.current.focusOnObject(data.model);
              orbitControlsScriptRef.current.updateConfig({enableRotate: true, enableZoom: true});
              fanDeviceRef.current.hideLabel();
            }
          });
          engine.addScript(fanDeviceRef.current);

          curtainDeviceRef.current = new CurtainDeviceScript(glbLoaderScriptRef.current, {model: '/ao/xialachuanglian.glb',
            name: 'Curtain DeviceScript',
            position: [0, 0.15,0],
            rotation: [0 , 0, 0],
            type:'Shutters',
            scale: [0.1, 0.1, 0.1],
            showLabels: true,
            labelContent: '百叶窗帘',
            clickableLabels: true,
            onLabelClick: (data) => {
              orbitControlsScriptRef.current.focusOnObject(data.model);
              orbitControlsScriptRef.current.updateConfig({enableRotate: true, enableZoom: true});
              curtainDeviceRef.current.hideLabel();
            }
          });
          engine.addScript(curtainDeviceRef.current);

          washerDeviceRef.current = new WasherDeviceScript(glbLoaderScriptRef.current, {model: '/ao/xiyiji.glb',
            name: 'Washer DeviceScript',
            position: [10.6, 0.910,-5.2],
            rotation: [0 , 0, 0],
            scale: [0.1, 0.1, 0.1],
            showLabels: true,
            labelContent: '洗衣机',
            clickableLabels: true,
            onLabelClick: (data) => {
              orbitControlsScriptRef.current.focusOnObject(data.model);
              orbitControlsScriptRef.current.updateConfig({enableRotate: true, enableZoom: true});
              washerDeviceRef.current.hideLabel();
            }
          });
          engine.addScript(washerDeviceRef.current);


        } catch (aetherError) {
          console.log('✅ 引擎创建失败...');
        }
  
        // 窗口大小调整处理
        resizeHandler = () => {
          if (engine && container) {
            engine.resize();
          }
        };

        window.addEventListener('resize', resizeHandler);

        engine.start();
        console.log('✅ 3D引擎启动成功');
      } catch (err) {
        handleError(err, '初始化3D引擎');
      }
    };

    // 延迟初始化
    const timeoutId = setTimeout(initializeEngine, 100);

    // 清理函数
    return () => {
      console.log('🧽 清理3D引擎资源');
      clearTimeout(timeoutId);
     
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      
      if (engine) {
        try {
          engine.dispose && engine.dispose();
          engine.stop && engine.stop();
        } catch (e) {
          console.warn('引擎销毁失败:', e);
        }
      }
      console.log('✅ 3D引擎资源清理完成，已重置初始化标志');
    };
  }, []);

  // 通过useImperativeHandle暴露方法给父组件
  React.useImperativeHandle(ref, () => ({
    handleLightManagement: () => {
      if (orbitControlsScriptRef.current) {
        objectSelected.current = null;
        smartHomeSceneRef.current?.showAllLightLabels();
        orbitControlsScriptRef.current.backLodPosition(new THREE.Vector3(11.154575612004217, 16.958249890869915, 12.493937172563147));
        orbitControlsScriptRef.current.updateConfig({
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          zoomSpeed: 1.2,
          minPolarAngle: THREE.MathUtils.degToRad(45),
          maxPolarAngle: THREE.MathUtils.degToRad(45),
          minDistance: 3,
          maxDistance: 20,
          enableRotate: true,
          enableZoom: false,
          enablePan: false,
        });
      }
      fanDeviceRef.current?.hideLabel();
      fanDeviceRef.current?.SetDefaultMaterial();
      airDeviceRef.current?.hideLabel();
      airDeviceRef.current?.SetDefaultMaterial();
      curtainDeviceRef.current?.hideLabel();
      curtainDeviceRef.current?.SetDefaultMaterial();
      washerDeviceRef.current?.hideLabel();
      washerDeviceRef.current?.SetDefaultMaterial();
    },
    handleDeviceManagement: () => {
      if (smartHomeSceneRef.current) {
        smartHomeSceneRef.current?.hideAllLightLabels();
      }
      airDeviceRef.current?.showLabel();
      fanDeviceRef.current?.showLabel();
      curtainDeviceRef.current?.showLabel();
      washerDeviceRef.current?.showLabel();
    },
    selectionLightDeviceCallback: (callback) => {
      selectionLightDeviceCallbackRef.current = callback;
    },
    // 可以添加其他需要暴露的方法
    curtainDevice: curtainDeviceRef.current,
    fanDevice: fanDeviceRef.current,
    airDevice: airDeviceRef.current,
    washerDevice: washerDeviceRef.current,
  }), []);

  // 显示错误界面
  if (error) {
    return (
      <div className="canvas3d-error-container">
        <div className="error-message">
          <h3>3D场景加载失败</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      </div>
    );
  }
  return null;
});

Canvas3D.displayName = 'Canvas3D';

// 使用React.memo记忆化组件，防止不必要的重新渲染
export default React.memo(Canvas3D);