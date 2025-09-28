import { 
    ScriptBase, 
    THREE, 
    GLBLoaderScript, 
    ShaderGlowMaterial,
    CSS2DObject
} from './aether3d-engine.umd.js';
import {SetPBRDefaultOrHighlightMat} from "./utils.js";
/**
 * 洗衣机设备配置接口
 * @typedef {Object} WasherDeviceConfig
 * @property {string} name - 设备名称
 * @property {[number, number, number]} position - 位置坐标
 * @property {[number, number, number]} rotation - 旋转角度
 * @property {[number, number, number]} scale - 缩放比例
 * @property {string} model - 模型路径
 * @property {boolean} [showLabels] - 是否显示标签，默认为true
 * @property {string} [labelContent] - 标签内容，默认为'洗衣机'
 * @property {boolean} [clickableLabels] - 标签是否可点击，默认为true
 * @property {function} [onLabelClick] - 标签点击回调函数
 */

export class WasherDeviceScript extends ScriptBase {
    /**
     * 构造函数
     * @param {Object} loadModel - GLB模型加载器实例
     * @param {WasherDeviceConfig|WasherDeviceConfig[]} [configs] - 洗衣机设备配置
     */
    constructor(loadModel, configs) {
        super();
        this.name = "WasherDeviceScript";
        
        /** @type {Object|null} GLB模型加载器实例 */
        this.loadModel = loadModel || null;
        
        /** @type {WasherDeviceConfig[]} 洗衣机设备配置数组 */
        this.configs = [];
        
        /** @type {Map<string, THREE.Group>} 已加载的模型映射 */
        this.loadedModels = new Map();
        
        // 材质切换相关属性
        /** @type {boolean} 对象是否高亮 */
        this.isObjectHighlighted = false;
        
        /** @type {Map<THREE.Mesh, THREE.MeshStandardMaterial>} 默认材质映射 */
        this.defaultMaterial = new Map();
        
        /** @type {Map<THREE.Mesh, ShaderGlowMaterial>} 高亮材质映射 */
        this.highlightMaterial = new Map();
        
        /** @type {Object|null} 标签引用 */
        this.label = null;
        
        /** @type {THREE.Mesh|null} 模型引用 */
        this.model = null;
        
        // 标签显示配置
        /** @type {boolean} 默认显示标签 */
        this.showLabels = true;
        
        /** @type {string} 默认标签内容 */
        this.labelContent = '洗衣机';
        
        /** @type {boolean} 默认允许点击 */
        this.clickableLabels = true;
        
        /** @type {function|null} 标签点击回调函数 */
        this.onLabelClick = null;
        
        // 洗衣机状态
        /** @type {boolean} 洗衣机是否开启 */
        this.isWasherOn = false;
        
        if (configs) {
            if (Array.isArray(configs)) {
                this.configs = configs;
                // 使用配置中的标签设置
                if (configs[0] && configs[0].showLabels !== undefined) {
                    this.showLabels = configs[0].showLabels;
                }
                if (configs[0] && configs[0].labelContent !== undefined) {
                    this.labelContent = configs[0].labelContent;
                }
                if (configs[0] && configs[0].clickableLabels !== undefined) {
                    this.clickableLabels = configs[0].clickableLabels;
                }
                if (configs[0] && configs[0].onLabelClick && typeof configs[0].onLabelClick === 'function') {
                    this.onLabelClick = configs[0].onLabelClick;
                }
            } else {
                this.configs = [configs];
                // 使用配置中的标签设置
                if (configs.showLabels !== undefined) {
                    this.showLabels = configs.showLabels;
                }
                if (configs.labelContent !== undefined) {
                    this.labelContent = configs.labelContent;
                }
                if (configs.clickableLabels !== undefined) {
                    this.clickableLabels = configs.clickableLabels;
                }
                if (configs.onLabelClick && typeof configs.onLabelClick === 'function') {
                    this.onLabelClick = configs.onLabelClick;
                }
            }
        }
    }

    /**
     * 启动脚本时调用
     */
    start() {
        if (this.loadModel) {
            // 加载所有配置的模型
            this.loadAllModels().then(()=>{

            });
        } else {
            console.warn("WasherDeviceScript: GLBLoaderScript实例未提供");
        }
        // 监听鼠标交互事件
        this.engine()?.on('mouse:objectSelected', (data) => {
            const object = data.object;

            if (object && object.name === 'Obj3d66-341817-17-61') {
                console.log('对象被选中:', object.name);
                this.highlightMaterial.forEach((material, object3D) => {
                    object3D.material = material;
                });
            }
        });
    }

    /**
     * 加载所有配置的模型
     * @returns {Promise<void>}
     */
    async loadAllModels() {
        for (const config of this.configs) {
            try {
                await this.loadModelByConfig(config);
            } catch (error) {
                console.error(`WasherDeviceScript: 加载模型 "${config.model}" 失败:`, error);
            }
        }
    }

    /**
     * 根据配置加载单个模型
     * @param {WasherDeviceConfig} config - 洗衣机设备配置
     * @returns {Promise<void>}
     */
    async loadModelByConfig(config) {
        if (!this.loadModel) {
            throw new Error("GLBLoaderScript未初始化");
        }

        // 加载模型
        const modelResult = await this.loadModel.loadModel(config.model, {
            position: new THREE.Vector3(config.position[0], config.position[1], config.position[2]),
            rotation: new THREE.Euler(config.rotation[0], config.rotation[1], config.rotation[2]),
            scale: new THREE.Vector3(config.scale[0], config.scale[1], config.scale[2]),
            addToScene: true
        });

        this.scene.traverse((object) => {
            if (!object) return;
            if (object.name === 'Obj3d66-341817-17-61' && object.isMesh) {
                const geometry = object.geometry;
                if (!geometry.attributes && !geometry.attributes.uv1) return;

                const materials = SetPBRDefaultOrHighlightMat(object);
                this.defaultMaterial.set(object, materials.defaultMat);
                this.highlightMaterial.set(object, materials.highlightMat);
                object.material = materials.defaultMat;
                object.material.needsUpdate = true;
                this.model = object; // 设置model引用
            }
            if (object.name === 'dimianshow' && object.isMesh) {
                const geometry = object.geometry;
                if (!geometry.attributes && !geometry.attributes.uv1) return;

                // 定义自定义着色器
                const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `;

                                const fragmentShader = `
                uniform sampler2D map; // 颜色贴图
                uniform sampler2D aoMap; // AO贴图
                uniform float aoIntensity; // 控制AO对透明度的影响强度
                varying vec2 vUv;
                
                void main() {
                    vec4 texelColor = texture2D(map, vUv);
                    float aoValue = texture2D(aoMap, vUv).r; // 假设AO贴图是单通道或取红色通道
                
                    // 自定义透明度计算逻辑
                    // 示例1: 直接使用AO值作为alpha (AO越暗->alpha越低->越透明)
                    // float alpha = aoValue;
                
                    // 示例2: 反转AO值作为alpha (AO越暗->(1.0 - aoValue)越高->越不透明)
                    float alpha = 1.0 - aoValue;
                
                    // 示例3: 使用强度参数进行混合或阈值处理
                    // float alpha = smoothstep(0.0, aoIntensity, aoValue); // 需要一个基准值和强度来控制
                
                    // 如果完全透明，则丢弃该片段以优化性能
                    if (alpha < 0.01) {
                        discard;
                    }
                
                    gl_FragColor = vec4(texelColor.rgb, alpha);
                }
                `;

                object.material = new THREE.ShaderMaterial({
                    uniforms: {
                        map: { value: object.material.map }, // 传入你的颜色贴图
                        aoMap: { value: object.material.map },
                        aoIntensity: { value: 1 }, // 可以调整这个值
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    transparent: true
                });
                this.engine()?.disableSelection(object.name);
            }
        });

        this.loadedModels.set(config.name, modelResult.scene);
        
        // 延迟创建标签，确保模型已加载完成
        setTimeout(() => {
            this.createModelLabel(config);
        }, 100);
    }

    /**
     * 为模型创建标签
     * @param {WasherDeviceConfig} config 洗衣机配置
     */
    createModelLabel(config) {
        // 检查是否应该显示标签
        const shouldShowLabels = config.showLabels !== undefined ? config.showLabels : this.showLabels;
        if (!shouldShowLabels) {
            console.log('[WasherDeviceScript] 标签显示已禁用，跳过创建');
            return;
        }
    
        const labelPosition = new THREE.Vector3(
            config.position[0],
            config.position[1] + 4.5,
            config.position[2]
        );

        // 创建标签容器元素
        const labelContainer = document.createElement('div');
        labelContainer.className = 'washer-device-label-container';
        labelContainer.style.cssText = `
            position: relative;
            pointer-events: auto;
            user-select: none;
        `;

        // 创建标签内容
        const labelContent = document.createElement('div');
        labelContent.className = 'washer-device-label-content';
        labelContent.style.cssText = `
            background: linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(30, 136, 229, 0.9) 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 500;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            min-width: 70px;
            cursor: pointer;
            transition: all 0.25s ease;
            transform-origin: center center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        `;

        // 创建图标和文字区域
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = `
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
        `;
        
        // 使用配置中的标签内容或默认值
        const labelText = config.labelContent || this.labelContent;
        iconDiv.innerHTML = `<span>📦</span><span>${labelText}</span>`;

        // 创建状态显示区域
        const statusDiv = document.createElement('div');
        statusDiv.className = 'washer-status-display';
        statusDiv.style.cssText = `
            font-size: 9px;
            opacity: 0.8;
            font-weight: 400;
            margin-left: 4px;
            padding: 1px 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 6px;
        `;
        statusDiv.textContent = this.isWasherOn ? '开' : '关';

        // 组装标签结构
        labelContent.appendChild(iconDiv);
        labelContent.appendChild(statusDiv);
        labelContainer.appendChild(labelContent);

        // 根据配置决定是否添加交互事件
        const isClickable = config.clickableLabels !== undefined ? config.clickableLabels : this.clickableLabels;
        if (isClickable) {
            this.addLabelInteractions(labelContainer, labelContent);
            labelContent.style.cursor = 'pointer';
        } else {
            labelContent.style.cursor = 'default';
        }

        let labelObject = new CSS2DObject(labelContainer);
        labelObject.position.copy(labelPosition);
        labelObject.visible = true;
        this.scene.add(labelObject);
        // 存储标签引用
        this.label = {
            object: labelObject,
            container: labelContainer,
            content: labelContent,
            statusElement: statusDiv,
            position: labelPosition
        };
        this.hideLabel();
    }

    /**
     * 为标签添加交互效果
     * @param {HTMLElement} container 标签容器
     * @param {HTMLElement} content 标签内容
     */
    addLabelInteractions(container, content) {
        // 点击事件
        container.addEventListener('click', (event) => {
            event.stopPropagation();
            this.highlightMaterial.forEach((material, object3D) => {
                object3D.material = material;
            });
            // 调用回调函数（如果存在）
            if (this.onLabelClick && typeof this.onLabelClick === 'function') {
                try {
                    this.onLabelClick({
                        device: this,
                        event: event,
                        isWasherOn: this.isWasherOn,
                        labelContent: this.labelContent,
                        model: this.model,
                    });
                } catch (error) {
                    console.error('[WasherDeviceScript] 标签点击回调执行失败:', error);
                }
            }
            
            // 默认行为：切换洗衣机状态
            this.toggle();
            
            // 添加点击动画效果
            content.style.transform = 'scale(0.95)';
            setTimeout(() => {
                content.style.transform = 'scale(1.0)';
            }, 150);
        });

        // 悬停进入效果
        container.addEventListener('mouseenter', () => {
            content.style.transform = 'scale(1.1) translateY(-2px)';
            content.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
        });
        
        // 悬停离开效果
        container.addEventListener('mouseleave', () => {
            content.style.transform = 'scale(1.0) translateY(0px)';
            content.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        });

        // 防止事件冒泡
        container.addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });
    }

    /**
     * 更新标签状态
     */
    updateLabelStatus() {
        if (!this.label) return;
        
        if (this.label.fallback) {
            // 处理备用标签
            const statusSpan = this.label.element.querySelector('span:last-child');
            if (statusSpan) {
                statusSpan.textContent = this.isWasherOn ? '开' : '关';
            }
        } else if (this.label.statusElement) {
            // 处理正常标签
            this.label.statusElement.textContent = this.isWasherOn ? '开' : '关';
            
            // 添加状态切换动画效果
            if (this.label.content) {
                this.label.content.style.background = this.isWasherOn 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(67, 160, 71, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(30, 136, 229, 0.9) 100%)';
            }
        }
    }

    /**
     * 显示标签
     */
    showLabel() {
        if (!this.label) return;
        
        if (this.label.fallback) {
            if (this.label.element) {
                // 确保元素可见，然后添加渐变显示效果
                this.label.element.style.display = 'flex';
                this.label.element.style.opacity = '0';

                // 使用 requestAnimationFrame 确保 DOM 更新后再添加动画
                requestAnimationFrame(() => {
                    console.log('[WasherDeviceScript] 显示标签');
                    this.label.element.style.opacity = '1';
                });
            }
        } else if (this.label.object) {
            // 3D标签的渐变显示
            if (this.label.container) {
                this.label.container.style.opacity = '0';
                
                requestAnimationFrame(() => {
                     console.log('[WasherDeviceScript] 显示标签');
                    this.label.container.style.opacity = '1';
                });
            }
            this.label.object.visible = true;
        }
    }

    /**
     * 隐藏标签
     */
    hideLabel() {
        if (!this.label) return;
        
        if (this.label.fallback) {
            if (this.label.element) {
                // 添加渐变隐藏效果
                this.label.element.style.opacity = '0';
                
                // 动画结束后隐藏元素
                setTimeout(() => {
                    if (this.label.element) {
                        this.label.element.style.display = 'none';
                    }
                }, 300);
            }
        } else if (this.label.object) {
            // 3D标签的渐变隐藏
            if (this.label.container) {
                this.label.container.style.opacity = '0';
                
                // 动画结束后隐藏3D对象
                setTimeout(() => {
                    if (this.label.object) {
                        this.label.object.visible = false;
                    }
                }, 300);
            } else {
                this.label.object.visible = false;
            }
        }
    }

    /**
     * 检查标签是否可见
     * @returns {boolean} 标签是否可见
     */
    isLabelVisible() {
        if (!this.label) return false;
        
        if (this.label.fallback) {
            return this.label.element && 
                   this.label.element.style.display !== 'none' && 
                   this.label.element.style.opacity !== '0';
        } else if (this.label.object) {
            return this.label.object.visible;
        }
        
        return false;
    }

    /**
     * 切换标签显示状态
     */
    toggleLabel() {
        if (this.isLabelVisible()) {
            this.hideLabel();
        } else {
            this.showLabel();
        }
    }

    /**
     * 获取标签
     * @returns {Object|null}
     */
    getLabel() {
        return this.label;
    }

    /**
     * 开启洗衣机
     */
    turnOn() {
        this.isWasherOn = true;
        // 更新标签状态
        this.updateLabelStatus();
        console.log("WasherDeviceScript: 洗衣机已开启");
    }

    /**
     * 关闭洗衣机
     */
    turnOff() {
        this.isWasherOn = false;
        // 更新标签状态
        this.updateLabelStatus();
        console.log("WasherDeviceScript: 洗衣机已关闭");
    }

    /**
     * 切换洗衣机开关状态
     */
    toggle() {
        if (this.isWasherOn) {
            this.turnOff();
        } else {
            this.turnOn();
        }
    }

    /**
     * 获取洗衣机开关状态
     * @returns {boolean} 洗衣机是否开启
     */
    isOn() {
        return this.isWasherOn;
    }

    /**
     * 设置标签点击回调函数
     * @param {function} callback 回调函数
     */
    setLabelClickCallback(callback) {
        if (typeof callback === 'function') {
            this.onLabelClick = callback;
            console.log('[WasherDeviceScript] 标签点击回调已设置');
        } else {
            console.warn('[WasherDeviceScript] 无效的回调函数');
        }
    }

    /**
     * 移除标签点击回调函数
     */
    removeLabelClickCallback() {
        this.onLabelClick = null;
        console.log('[WasherDeviceScript] 标签点击回调已移除');
    }

    /**
     * 设置默认材质
     */
    SetDefaultMaterial() {
        this.defaultMaterial.forEach((material, object3D) => {
            object3D.material = material;
        });
    }

    /**
     * 清理标签资源
     */
    dispose() {
        if (!this.label) return;
        
        if (this.label.fallback) {
            // 清理备用标签
            if (this.label.element && this.label.element.parentNode) {
                this.label.element.parentNode.removeChild(this.label.element);
            }
            console.log('[WasherDeviceScript] 备用标签清理成功');
        } else if (this.label.object) {
            // 清理正常标签
            const engine = this.engine();
            if (engine && engine.css2dLabelScript) {
                try {
                    engine.css2dLabelScript.removeLabel(this.label.object);
                    console.log('[WasherDeviceScript] 标签资源清理成功');
                } catch (error) {
                    console.warn('[WasherDeviceScript] 清理标签时出错:', error);
                }
            }
            
            // 清理DOM元素
            if (this.label.container && this.label.container.parentNode) {
                this.label.container.parentNode.removeChild(this.label.container);
            }
        }
        
        this.label = null;
    }
}
