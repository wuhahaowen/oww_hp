import { 
    ScriptBase, 
    THREE, 
    TWEEN,
    GLBLoaderScript, 
    ShaderGlowMaterial, 
    createGradientAlphaMap, 
    loadTexture, 
    AnimationMaterial,
    CSS2DObject
} from './aether3d-engine.umd.js';
import {SetPBRDefaultOrHighlightMat} from "./utils.js";
/**
 * 窗帘设备配置接口
 * @typedef {Object} CurtainDeviceConfig
 * @property {string} name - 设备名称
 * @property {[number, number, number]} position - 位置坐标
 * @property {[number, number, number]} rotation - 旋转角度
 * @property {[number, number, number]} scale - 缩放比例
 * @property {string} type - 设备类型
 * @property {string} model - 模型路径
 * @property {boolean} [showLabels] - 是否显示标签，默认为true
 * @property {string} [labelContent] - 标签内容，默认为'窗帘'
 * @property {boolean} [clickableLabels] - 标签是否可点击，默认为true
 * @property {function} [onLabelClick] - 标签点击回调函数
 */

export class CurtainDeviceScript extends ScriptBase {
    constructor(loadModel, configs) {
        super();
        this.name = "CurtainDeviceScript";
        
        // 初始化属性
        this.loadModel = loadModel || null;
        this.configs = configs || null;
        this.loadedModels = new Map();
        this.meshLeft = null;
        this.meshRight = null;
        this.baiye = null;
        this.defaultMaterial = new Map();
        this.highlightMaterial = new Map();
        this.label = null; // 存储标签引用
        this.model = null;
        
        // 标签显示配置
        this.showLabels = true; // 默认显示标签
        this.labelContent = '窗帘'; // 默认标签内容
        this.clickableLabels = true; // 默认允许点击
        this.onLabelClick = null; // 标签点击回调函数

        // 动画相关
        this.meshLeftOpenTweens = null;
        this.meshRightOpenTweens = null;
        this.meshLeftCloseTweens = null;
        this.meshRightCloseTweens = null;
        this.meshShuttersOpenTweens = null;
        this.meshShuttersCloseTweens = null;

        // 存储原始状态
        this.originalLeftScale = null;
        this.originalRightScale = null;
        this.originalLeftPosition = null;
        this.originalRightPosition = null;
        this.originalShuttersScale = null;

        // 动画状态
        this.isPaused = false;
        this.isCurtainOpen = false;
        
        // 初始化标签配置
        if (configs) {
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

    /**
     * 启动脚本时调用
     */
    start() {
        if (this.loadModel) {
            // 加载所有配置的模型
            this.loadAllModels().then(() => {
                console.log('窗帘模型加载完成');
            }).catch(error => {
                console.error("CurtainDeviceScript: 模型加载失败", error);
            });
        } else {
            console.warn("CurtainDeviceScript: GLBLoaderScript实例未提供");
        }

        // // 监听鼠标交互事件
        // const engine = this.engine();
        // if (engine) {
        //     engine.on('mouse:objectSelected', (data) => {
        //         const object = data.object;

        //         if (object && object.name === '网格_1') {
        //             console.log('对象被选中:', object.name);
        //             this.highlightMaterial.forEach((material, object3D) => {
        //                 object3D.material = material;
        //             });
        //         }
        //     });
        // }
    }

    /**
     * 切换暂停状态
     */
    togglePause() {
        this.isPaused = !this.isPaused;
    }

    /**
     * 加载所有配置的模型
     */
    async loadAllModels() {
        if (!this.configs) {
            return;
        }
        try {
            await this.loadModelByConfig(this.configs);
        } catch (error) {
            console.error(`CurtainDeviceScript: 加载模型 "${this.configs.model}" 失败:`, error);
        }
    }

    /**
     * 根据配置加载单个模型
     * @param {CurtainAirDeviceConfig} config 天花板灯配置
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

        if (modelResult && modelResult.scene) {
            modelResult.scene.traverse((object) => {
                if (!object) return;
                if (config.type === 'Shutters') {
                    if (object.name === 'gan' && object.isMesh) {
                        const materials = SetPBRDefaultOrHighlightMat(object);
                        this.defaultMaterial.set(object, materials.defaultMat);
                        this.highlightMaterial.set(object, materials.highlightMat);
                        object.material = materials.defaultMat;
                        object.material.needsUpdate = true;
                    }
                    if (object.name === '网格_1' && object.isMesh) {
                        const geometry = object.geometry;
                        if (!geometry.attributes && !geometry.attributes.uv1) return;
                        this.baiye = object.parent;
                        this.originalShuttersScale = this.baiye.scale.clone();
                        this.model = object; // 设置model引用
                        const materials = SetPBRDefaultOrHighlightMat(object);
                        this.defaultMaterial.set(object, materials.defaultMat);
                        this.highlightMaterial.set(object, materials.highlightMat);
                        object.material = materials.defaultMat;
                        object.material.needsUpdate = true;

                        // 创建打开动画（百叶窗收缩）
                        const openScale = {
                            x: this.originalShuttersScale?.x || 1,
                            y: this.originalShuttersScale?.y || 1, // 收缩到较小的高度
                            z: 0.004
                        };

                        this.meshShuttersOpenTweens = new TWEEN.Tween(this.baiye.scale)
                            .to(openScale, 1200)
                            .easing(TWEEN.Easing.Exponential.Out);
                        // 创建关闭动画（百叶窗展开）
                        const closeScale = this.originalShuttersScale ? {
                            x: this.originalShuttersScale.x,
                            y: this.originalShuttersScale.y,
                            z: this.originalShuttersScale.z
                        } : { x: 1, y: 1, z: 1 };

                        this.meshShuttersCloseTweens = new TWEEN.Tween(this.baiye.scale)
                            .to(closeScale, 1200)
                            .easing(TWEEN.Easing.Exponential.Out);
                    }
                } else {
                    if (object.isMesh) {
                        const geometry = object.geometry;
                        if (!geometry.attributes && !geometry.attributes.uv1) return;
                        const materials = SetPBRDefaultOrHighlightMat(object);
                        this.defaultMaterial.set(object, materials.defaultMat);
                        this.highlightMaterial.set(object, materials.highlightMat);
                        object.material = materials.defaultMat;
                        object.material.needsUpdate = true;
                    }
                    if (!this.meshLeft && object.isMesh) {
                        this.meshLeft = object;
                        this.model = object; // 设置model引用为第一个网格
                    } else if (!this.meshRight && object.isMesh && object !== this.meshLeft) {
                        this.meshRight = object;
                    }

                    // 确保两个网格都已找到
                    if (this.meshLeft && this.meshRight) {
                        // 保存原始状态
                        this.originalLeftScale = this.meshLeft.scale.clone();
                        this.originalRightScale = this.meshRight.scale.clone();
                        this.originalLeftPosition = this.meshLeft.position.clone();
                        this.originalRightPosition = this.meshRight.position.clone();

                        // 创建打开动画（窗帘收缩）
                        const openScale = {
                            x: 0.04, // 几乎不可见
                            y: this.originalLeftScale?.y,
                            z: this.originalLeftScale?.z
                        };

                        this.meshLeftOpenTweens = new TWEEN.Tween(this.meshLeft.scale)
                            .to(openScale, 1200)
                            .easing(TWEEN.Easing.Exponential.Out);

                        this.meshRightOpenTweens = new TWEEN.Tween(this.meshRight.scale)
                            .to(openScale, 1200)
                            .easing(TWEEN.Easing.Exponential.Out);

                        // 创建关闭动画（窗帘展开）
                        this.meshLeftCloseTweens = new TWEEN.Tween(this.meshLeft.scale)
                            .to({
                                x: this.originalLeftScale?.x,
                                y: this.originalLeftScale?.y,
                                z: this.originalLeftScale?.z
                            }, 1200)
                            .easing(TWEEN.Easing.Exponential.Out);

                        this.meshRightCloseTweens = new TWEEN.Tween(this.meshRight.scale)
                            .to({
                                x: this.originalRightScale?.x,
                                y: this.originalRightScale?.y,
                                z: this.originalRightScale?.z
                            }, 1200)
                            .easing(TWEEN.Easing.Exponential.Out);
                    }
                }
            });
        } else {
            console.error("CurtainDeviceScript: 模型加载失败，没有返回有效的场景对象");
        }

        this.loadedModels.set(config.name, modelResult.scene);
        
        // 延迟创建标签，确保模型已加载完成
        setTimeout(() => {
            this.createModelLabel(config);
        }, 100);
    }

    /**
     * 为模型创建标签
     * @param {CurtainDeviceConfig} config 窗帘配置
     */
    createModelLabel(config) {
        // 检查是否应该显示标签
        const shouldShowLabels = config.showLabels !== undefined ? config.showLabels : this.showLabels;
        if (!shouldShowLabels) {
            console.log('[CurtainDeviceScript] 标签显示已禁用，跳过创建');
            return;
        }
        const labelPosition = new THREE.Vector3(
            10.2,
            0.15 + 4.5,
            5.5
        );

        // 创建标签容器元素
        const labelContainer = document.createElement('div');
        labelContainer.className = 'curtain-device-label-container';
        labelContainer.style.cssText = `
            position: relative;
            pointer-events: auto;
            user-select: none;
        `;

        // 创建标签内容
        const labelContent = document.createElement('div');
        labelContent.className = 'curtain-device-label-content';
        labelContent.style.cssText = `
            background: linear-gradient(135deg, rgba(156, 39, 176, 0.9) 0%, rgba(123, 31, 162, 0.9) 100%);
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
        
        // 使用配置中的标签内容或默认值，根据窗帘类型显示不同图标
        const labelText = config.labelContent || this.labelContent;
        const curtainIcon = config.type === 'Shutters' ? '🏛️' : '🚪';
        iconDiv.innerHTML = `<span>${curtainIcon}</span><span>${labelText}</span>`;

        // 创建状态显示区域
        const statusDiv = document.createElement('div');
        statusDiv.className = 'curtain-status-display';
        statusDiv.style.cssText = `
            font-size: 9px;
            opacity: 0.8;
            font-weight: 400;
            margin-left: 4px;
            padding: 1px 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 6px;
        `;
        statusDiv.textContent = this.isCurtainOpen ? '开' : '关';

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
                        isCurtainOpen: this.isCurtainOpen,
                        labelContent: this.labelContent,
                        model: this.model,
                        configs: this.configs
                    });
                } catch (error) {
                    console.error('[CurtainDeviceScript] 标签点击回调执行失败:', error);
                }
            }
            
            // 默认行为：切换窗帘状态
            if (this.isCurtainOpen) {
                this.Close();
            } else {
                this.Open();
            }
            
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
                statusSpan.textContent = this.isCurtainOpen ? '开' : '关';
            }
        } else if (this.label.statusElement) {
            // 处理正常标签
            this.label.statusElement.textContent = this.isCurtainOpen ? '开' : '关';
            
            // 添加状态切换动画效果
            if (this.label.content) {
                this.label.content.style.background = this.isCurtainOpen 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(67, 160, 71, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(156, 39, 176, 0.9) 0%, rgba(123, 31, 162, 0.9) 100%)';
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
                    console.log('[CurtainDeviceScript] 显示标签');
                    this.label.element.style.opacity = '1';
                });
            }
        } else if (this.label.object) {
            // 3D标签的渐变显示
            if (this.label.container) {
                this.label.container.style.opacity = '0';
                
                requestAnimationFrame(() => {
                     console.log('[CurtainDeviceScript] 显示标签');
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
     * 开启窗帘
     */
    Open() {
        console.log('CurtainDeviceScript.Open() 被调用');
        if (!this.configs) {
            console.warn('CurtainDeviceScript: configs为空，无法执行开启操作');
            return;
        }
        if (this.configs.type === 'Shutters') {
            console.log('执行百叶窗开启动画');
            if (this.meshShuttersOpenTweens) {
                this.meshShuttersOpenTweens.start();
            } else {
                console.warn('百叶窗开启动画未初始化');
            }
        } else {
            console.log('执行窗帘开启动画');
            // 停止可能正在运行的关闭动画
            if (this.meshLeftCloseTweens) {
                this.meshLeftCloseTweens.stop();
            }
            if (this.meshRightCloseTweens) {
                this.meshRightCloseTweens.stop();
            }

            // 启动打开动画
            if (this.meshLeftOpenTweens) {
                this.meshLeftOpenTweens.start();
                console.log('左侧窗帘开启动画已启动');
            } else {
                console.warn('左侧窗帘开启动画未初始化');
            }
            if (this.meshRightOpenTweens) {
                this.meshRightOpenTweens.start();
                console.log('右侧窗帘开启动画已启动');
            } else {
                console.warn('右侧窗帘开启动画未初始化');
            }
        }
        // 更新UI状态
        this.setState(true);
        // 更新标签状态
        this.updateLabelStatus();
        console.log('窗帘状态已设置为开启');
    }

    /**
     * 关闭窗帘
     */
    Close() {
        console.log('CurtainDeviceScript.Close() 被调用');
        if (!this.configs) {
            console.warn('CurtainDeviceScript: configs为空，无法执行关闭操作');
            return;
        }
        if (this.configs.type === 'Shutters') {
            console.log('执行百叶窗关闭动画');
            if (this.meshShuttersCloseTweens) {
                this.meshShuttersCloseTweens.start();
            } else {
                console.warn('百叶窗关闭动画未初始化');
            }
        } else {
            console.log('执行窗帘关闭动画');
            // 停止可能正在运行的打开动画
            if (this.meshLeftOpenTweens) {
                this.meshLeftOpenTweens.stop();
            }
            if (this.meshRightOpenTweens) {
                this.meshRightOpenTweens.stop();
            }
            // 启动关闭动画
            if (this.meshLeftCloseTweens) {
                this.meshLeftCloseTweens.start();
                console.log('左侧窗帘关闭动画已启动');
            } else {
                console.warn('左侧窗帘关闭动画未初始化');
            }
            if (this.meshRightCloseTweens) {
                this.meshRightCloseTweens.start();
                console.log('右侧窗帘关闭动画已启动');
            } else {
                console.warn('右侧窗帘关闭动画未初始化');
            }
        }
        // 更新状态
        this.setState(false);
        // 更新标签状态
        this.updateLabelStatus();
        console.log('窗帘状态已设置为关闭');
    }

    /**
     * 更新方法，在每一帧调用
     */
    update() {
        if (!this.configs || this.isPaused) {
            return;
        }
        if (this.configs.type === 'Shutters') {
            // 确保百叶窗动画得到更新
            if (this.meshShuttersOpenTweens) {
                this.meshShuttersOpenTweens.update();
            }
            if (this.meshShuttersCloseTweens) {
                this.meshShuttersCloseTweens.update();
            }
        } else {
            // 确保窗帘动画得到更新
            if (this.meshLeftOpenTweens) {
                this.meshLeftOpenTweens.update();
            }
            if (this.meshRightOpenTweens) {
                this.meshRightOpenTweens.update();
            }
            if (this.meshLeftCloseTweens) {
                this.meshLeftCloseTweens.update();
            }
            if (this.meshRightCloseTweens) {
                this.meshRightCloseTweens.update();
            }
        }
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
     * 获取窗帘当前状态
     * @returns {boolean} - true表示打开，false表示关闭
     */
    getState() {
        // 这里我们简单地返回一个状态值
        // 在实际应用中，您可能需要根据窗帘的实际位置来判断状态
        return this.isCurtainOpen || false;
    }

    /**
     * 设置窗帘状态
     * @param {boolean} isOpen - true表示打开，false表示关闭
     */
    setState(isOpen) {
        this.isCurtainOpen = isOpen;
    }

    /**
     * 设置标签点击回调函数
     * @param {function} callback 回调函数
     */
    setLabelClickCallback(callback) {
        if (typeof callback === 'function') {
            this.onLabelClick = callback;
            console.log('[CurtainDeviceScript] 标签点击回调已设置');
        } else {
            console.warn('[CurtainDeviceScript] 无效的回调函数');
        }
    }

    /**
     * 移除标签点击回调函数
     */
    removeLabelClickCallback() {
        this.onLabelClick = null;
        console.log('[CurtainDeviceScript] 标签点击回调已移除');
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
     * 销毁UI元素
     */
    destroyUI() {
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
            console.log('[CurtainDeviceScript] 备用标签清理成功');
        } else if (this.label.object) {
            // 清理正常标签
            const engine = this.engine();
            if (engine && engine.css2dLabelScript) {
                try {
                    engine.css2dLabelScript.removeLabel(this.label.object);
                    console.log('[CurtainDeviceScript] 标签资源清理成功');
                } catch (error) {
                    console.warn('[CurtainDeviceScript] 清理标签时出错:', error);
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

export default CurtainDeviceScript;