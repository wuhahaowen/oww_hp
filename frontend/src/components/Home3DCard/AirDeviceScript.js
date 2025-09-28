import { 
    Aether3d, 
    ScriptBase, 
    THREE, 
    GLBLoaderScript, 
    ShaderGlowMaterial, 
    createGradientAlphaMap, 
    loadTexture, 
    AnimationMaterial,
    CSS2DObject
} from './aether3d-engine.es.js';
import {SetPBRDefaultOrHighlightMat} from "./utils.js";

/**
 * 空调设备配置接口
 * @typedef {Object} AirDeviceConfig
 * @property {string} name - 设备名称
 * @property {[number, number, number]} position - 位置坐标
 * @property {[number, number, number]} rotation - 旋转角度
 * @property {[number, number, number]} scale - 缩放比例
 * @property {string} model - 模型路径
 * @property {number} [windSpeed] - 风速，默认为1
 * @property {string} [windColor] - 风效颜色，默认为'#ff8800'
 * @property {boolean} [showLabels] - 是否显示标签，默认为true
 * @property {string} [labelContent] - 标签内容，默认为'空调'
 * @property {boolean} [clickableLabels] - 标签是否可点击，默认为true
 * @property {function} [onLabelClick] - 标签点击回调函数
 */

export class AirDeviceScript extends ScriptBase {
    constructor(loadModel, configs) {
        super();
        this.name = "AirDeviceScript";
        
        // 初始化属性
        this.loadModel = loadModel || null;
        this.configs = [];
        this.loadedModels = new Map();
        this.animationMaterial = null;
        this.defaultMaterial = new Map();
        this.highlightMaterial = new Map();
        this.label = null; // 存储标签引用
        this.model = null;
        // 标签显示配置
        this.showLabels = true; // 默认显示标签
        this.labelContent = '空调'; // 默认标签内容
        this.clickableLabels = true; // 默认允许点击
        this.onLabelClick = null; // 标签点击回调函数
        
        // 风效控制相关属性
        this.isWindOn = true; // 风效默认开启
        this.baseWindSpeed = 0.06; // 基础风速
        this.windSpeed = 0.06; // 当前风速（可调节）
        this.windColor = '#ff8800'; // 当前风效颜色

        if (configs) {
            if (Array.isArray(configs)) {
                this.configs = configs;
                // 使用配置中的风速和颜色
                if (configs[0] && configs[0].windSpeed !== undefined) {
                    this.windSpeed = this.baseWindSpeed * configs[0].windSpeed;
                }
                if (configs[0] && configs[0].windColor !== undefined) {
                    this.windColor = configs[0].windColor;
                }
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
            } else {
                this.configs = [configs];
                // 使用配置中的风速和颜色
                if (configs.windSpeed !== undefined) {
                    this.windSpeed = this.baseWindSpeed * configs.windSpeed;
                }
                if (configs.windColor !== undefined) {
                    this.windColor = configs.windColor;
                }
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
        console.log('[AirDeviceScript] 开始启动...');
        
        if (this.loadModel) {
            // 加载所有配置的模型
            this.loadAllModels();
        } else {
            console.warn("AirDeviceScript: GLBLoaderScript实例未提供");
        }
        // 加载纹理
        loadTexture('/ao/6803941_cd79024943f4faaf1ce25d8b31af9bcc.png').then(texture => {
            // 创建渐变alpha贴图
            const alphaMap = createGradientAlphaMap();
            this.animationMaterial = new AnimationMaterial({
                color: '#05a7ff',
                texture: texture,
                alphaMap: alphaMap,
                transparent: true,
                opacity: 1,
                doubleSided: true,
                depthWrite: false,
                uvOffset: new THREE.Vector2(0, 0),
                uvScale: new THREE.Vector2(1, 1)
            });
        });
        // // 监听鼠标交互事件
        // const engine = this.engine();
        // if (engine) {
        //     engine.on('mouse:objectSelected', (data) => {
        //         const object = data.object;

        //         if (object && object.name === 'kongtiao') {
        //             console.log('对象被选中:', object.name);
        //             this.highlightMaterial.forEach((material, object3D) => {
        //                 object3D.material = material;
        //             });
        //         }
        //     });
        // }
    }

    /**
     * 加载所有配置的模型
     */
    async loadAllModels() {
        for (const config of this.configs) {
            try {
                await this.loadModelByConfig(config);
            } catch (error) {
                console.error(`AirDeviceScript: 加载模型 "${config.model}" 失败:`, error);
            }
        }
    }

    /**
     * 根据配置加载单个模型
     * @param {AirDeviceConfig} config 空调配置
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
            if (object.name === 'kongtiao' && object.isMesh) {
                const geometry = object.geometry;
                if (!geometry.attributes && !geometry.attributes.uv1) return;

                const materials = SetPBRDefaultOrHighlightMat(object);
                // 检查材质是否成功创建
                if (materials.defaultMat && materials.highlightMat) {
                    this.defaultMaterial.set(object, materials.defaultMat);
                    this.highlightMaterial.set(object, materials.highlightMat);
                    object.material = materials.defaultMat;
                    object.material.needsUpdate = true;
                }
                this.model = object;
            }

            if (object.name === 'Arc001' && object.isMesh) {
                // 检查 animationMaterial 是否已加载
                if (this.animationMaterial) {
                    object.material = this.animationMaterial;
                    object.material.needsUpdate = true;
                }
                const engine = this.engine();
                if (engine) {
                    engine.disableSelection(object.name);
                }
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
     * @param {AirDeviceConfig} config 空调配置
     */
    createModelLabel(config) {
        // 检查是否应该显示标签
        const shouldShowLabels = config.showLabels !== undefined ? config.showLabels : this.showLabels;
        if (!shouldShowLabels) {
            console.log('[AirDeviceScript] 标签显示已禁用，跳过创建');
            return;
        }
    
        const labelPosition = new THREE.Vector3(
            config.position[0],
            config.position[1] + 4.5,
            config.position[2]
        );

        // 创建标签容器元素
        const labelContainer = document.createElement('div');
        labelContainer.className = 'air-device-label-container';
        labelContainer.style.cssText = `
            position: relative;
            pointer-events: auto;
            user-select: none;
        `;

        // 创建标签内容
        const labelContent = document.createElement('div');
        labelContent.className = 'air-device-label-content';
        labelContent.style.cssText = `
            background: linear-gradient(135deg, rgba(5, 167, 255, 0.9) 0%, rgba(0, 123, 255, 0.9) 100%);
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
        iconDiv.innerHTML = `<span>🌬️</span><span>${labelText}</span>`;

        // 创建状态显示区域
        const statusDiv = document.createElement('div');
        statusDiv.className = 'air-status-display';
        statusDiv.style.cssText = `
            font-size: 9px;
            opacity: 0.8;
            font-weight: 400;
            margin-left: 4px;
            padding: 1px 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 6px;
        `;
        statusDiv.textContent = this.isWindOn ? '开' : '关';

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
                        isWindOn: this.isWindOn,
                        labelContent: this.labelContent,
                        model: this.model,
                    });
                } catch (error) {
                    console.error('[AirDeviceScript] 标签点击回调执行失败:', error);
                }
            }
            
            // 默认行为：切换风效状态
            this.toggleWind();
            this.updateLabelStatus();
            
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
                statusSpan.textContent = this.isWindOn ? '开' : '关';
            }
        } else if (this.label.statusElement) {
            // 处理正常标签
            this.label.statusElement.textContent = this.isWindOn ? '开' : '关';
            
            // 添加状态切换动画效果
            if (this.label.content) {
                this.label.content.style.background = this.isWindOn 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(67, 160, 71, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(5, 167, 255, 0.9) 0%, rgba(0, 123, 255, 0.9) 100%)';
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
                    console.log('[AirDeviceScript] 显示标签');
                    this.label.element.style.opacity = '1';
                });
            }
        } else if (this.label.object) {
            // 3D标签的渐变显示
            if (this.label.container) {
                this.label.container.style.opacity = '0';
                
                requestAnimationFrame(() => {
                     console.log('[AirDeviceScript] 显示标签1111111');
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

    fixedUpdate() {
    }

    /**
     * 更新方法，在每一帧调用
     */
    update() {
        if (this.animationMaterial)
        {
            this.animationMaterial.scrollUV(0, 1 * 0.06);
        }
    }

    /**
     * 开启风效
     */
    turnOnWind() {
        this.isWindOn = true;
        // 更新标签状态
        this.updateLabelStatus();
        console.log("AirDeviceScript: 风效已开启");
    }

    /**
     * 关闭风效
     */
    turnOffWind() {
        this.isWindOn = false;
        // 更新标签状态
        this.updateLabelStatus();
        console.log("AirDeviceScript: 风效已关闭");
    }

    /**
     * 切换风效开关状态
     */
    toggleWind() {
        if (this.isWindOn) {
            this.turnOffWind();
        } else {
            this.turnOnWind();
        }
    }

    /**
     * 获取风效开关状态
     * @returns {boolean} 风效是否开启
     */
    isWindOnStatus() {
        return this.isWindOn;
    }

    /**
     * 设置风速
     * @param {number} speed 速度倍率 (0.0 - 5.0)
     */
    setWindSpeed(speed) {
        const clampedSpeed = Math.max(0, Math.min(5, speed));
        this.windSpeed = this.baseWindSpeed * clampedSpeed;
    }

    /**
     * 获取当前风速
     * @returns {number} 当前速度倍率
     */
    getWindSpeed() {
        return this.windSpeed / this.baseWindSpeed;
    }

    /**
     * 增加风速
     * @param {number} increment 增量
     */
    increaseWindSpeed(increment = 0.5) {
        this.setWindSpeed(this.getWindSpeed() + increment);
    }

    /**
     * 减少风速
     * @param {number} decrement 减量
     */
    decreaseWindSpeed(decrement = 0.5) {
        this.setWindSpeed(this.getWindSpeed() - decrement);
    }

    /**
     * 设置风效颜色
     * @param {string} color 颜色值 (如 '#ff0000')
     */
    setWindColor(color) {
        this.windColor = color;
    }

    /**
     * 获取当前风效颜色
     * @returns {string} 当前颜色值
     */
    getWindColor() {
        return this.windColor;
    }

    /**
     * 获取指定名称的模型
     * @param {string} name 模型名称
     * @returns {THREE.Group|undefined}
     */
    getModelByName(name) {
        return this.loadedModels.get(name);
    }

    /**
     * 获取所有加载的模型
     * @returns {Map<string, THREE.Group>}
     */
    getAllModels() {
        return this.loadedModels;
    }

    /**
     * 设置标签点击回调函数
     * @param {function} callback 回调函数
     */
    setLabelClickCallback(callback) {
        if (typeof callback === 'function') {
            this.onLabelClick = callback;
            console.log('[AirDeviceScript] 标签点击回调已设置');
        } else {
            console.warn('[AirDeviceScript] 无效的回调函数');
        }
    }

    /**
     * 移除标签点击回调函数
     */
    removeLabelClickCallback() {
        this.onLabelClick = null;
        console.log('[AirDeviceScript] 标签点击回调已移除');
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
            console.log('[AirDeviceScript] 备用标签清理成功');
        } else if (this.label.object) {
            // 清理正常标签
            const engine = this.engine();
            if (engine && engine.css2dLabelScript) {
                try {
                    engine.css2dLabelScript.removeLabel(this.label.object);
                    console.log('[AirDeviceScript] 标签资源清理成功');
                } catch (error) {
                    console.warn('[AirDeviceScript] 清理标签时出错:', error);
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
