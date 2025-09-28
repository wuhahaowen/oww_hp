import { 
    ScriptBase, 
    THREE, 
    GLBLoaderScript, 
    RectAreaLightConfig, 
    RectAreaLightScript, 
} from './aether3d-engine.umd.js';

/**
 * 智能家居设备配置接口
 * @typedef {Object} SmartHomeDeviceConfig
 * @property {string} name - 设备名称
 * @property {[number, number, number]} position - 位置坐标
 * @property {[number, number, number]} rotation - 旋转角度
 * @property {[number, number, number]} scale - 缩放比例
 * @property {string} model - 模型路径
 */

/**
 * 灯光控制接口
 * @typedef {Object} SmartHomeSceneInterface
 * @property {function} addLight - 添加灯光
 * @property {function} removeLight - 移除灯光
 * @property {function} getLight - 通过键获取灯光
 * @property {function} hasLight - 检查灯光是否存在
 * @property {function} getAllLights - 获取所有灯光
 * @property {function} toggleAllLightLabels - 显示或隐藏所有灯的标签
 * @property {function} showAllLightLabels - 显示所有灯的标签
 * @property {function} hideAllLightLabels - 隐藏所有灯的标签
 */

export class SmartHomeScene extends ScriptBase {
    constructor(modelLoader, configs) {
        super();
        this.name = "SmartHomeScene";
        // 初始化属性
        this.modelLoader = modelLoader || null;
        this.configs = configs || null;
        this.loadedModels = new Map();
        this.lights = new Map();
        this.selectionLightDeviceCallbackRef = null;;
    }

    start() {
        if (this.modelLoader) {
            // 加载所有配置的模型
            this.loadAllModels().then();
            this.addLight('学习房',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 2.5,
                height: 2.5,
                position: [-4, 4.5, 3],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '学习房',
                clickableLabels: true
            });
            

            this.addLight('数字展厅',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 2.5,
                height: 2.5,
                position: [12, 4.5, 3],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '数字展厅',
                clickableLabels: true
            });
            this.addLight('多功能房',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 2.5,
                height: 2.5,
                position: [4, 4.5, 3],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '多功能房',
                clickableLabels: true
            });
            this.addLight('医疗房',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 4,
                height: 1.5,
                position: [-4, 4.5, -4],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '医疗房',
                clickableLabels: true
            });
            this.addLight('产品展示厅',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 1.5,
                height: 7,
                position: [-10, 4.5, 0],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '产品展示厅',
                clickableLabels: true
            });
            this.addLight('客厅',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 6,
                height: 1.5,
                position: [5, 4.5, -4],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '客厅',
                clickableLabels: true
            });
            this.addLight('卧室',{
                enabled: true,
                color: new THREE.Color('#ffffff'),
                intensity: 35,
                width: 3,
                height: 1.5,
                position: [14.5, 4.5, -4],  // 调整位置以照射地面
                rotation: [-Math.PI / 2, 0, 0],  // 调整旋转以向下照射
                showLightHelpers: false,
                showLabels: true,
                labelContent: '卧室',
                clickableLabels: true
            });
        } else {
            console.warn("CeilingLightScript: GLBLoaderScript实例未提供");
        }
    }

    setCallback(callback)
    {
        this.selectionLightDeviceCallbackRef = callback;
    }

    /**
     * 添加灯光
     * @param {string|number} key - 灯光键值
     * @param {Object} lightConfig - 灯光配置
     */
    addLight(key, lightConfig) {
        const light = new RectAreaLightScript(lightConfig);
        if (!this.lights.has(key)) {
            this.addScript(light);
            this.lights.set(key, light);
            light.turnOff();
            light.setOnToggle((isEnabled, script) => {
                this.selectionLightDeviceCallbackRef(light.uuid,isEnabled);
            });
        }
    }

    /**
     * 移除灯光
     * @param {string|number} key - 灯光键值
     */
    removeLight(key) {
        if (this.lights.has(key)) {
            this.lights.delete(key);
        }
    }

    /**
     * 通过键获取灯光
     * @param {string|number} key - 灯光键值
     * @returns {RectAreaLightScript|undefined}
     */
    getLight(key) {
        return this.lights.get(key);
    }

    /**
     * 检查灯光是否存在
     * @param {string|number} key - 灯光键值
     * @returns {boolean}
     */
    hasLight(key) {
        return this.lights.has(key);
    }

    /**
     * 获取所有灯光
     * @returns {RectAreaLightScript[]}
     */
    getAllLights() {
        return Array.from(this.lights.values());
    }

    /**
     * 显示或隐藏所有灯的标签
     * @param {boolean} visible - 是否可见
     */
    toggleAllLightLabels(visible) {
        this.lights.forEach((light) => {
            light.setShowLabels(visible);
        });
    }

    /**
     * 显示所有灯的标签
     */
    showAllLightLabels() {
        this.toggleAllLightLabels(true);
    }

    /**
     * 隐藏所有灯的标签
     */
    hideAllLightLabels() {
        this.toggleAllLightLabels(false);
    }

    async loadAllModels() {
        if (this.configs && this.modelLoader)
            await this.loadModelByConfig(this.configs);
    }

    /**
     * 根据配置加载单个模型
     * @param {SmartHomeDeviceConfig} config 智能家居设备配置
     */
    async loadModelByConfig(config) {
        if (!this.modelLoader) {
            throw new Error("GLBLoaderScript未初始化");
        }

        // 加载模型
        const modelResult = await this.modelLoader.loadModel(config.model, {
            position: new THREE.Vector3(config.position[ 0 ], config.position[ 1 ], config.position[ 2 ]),
            rotation: new THREE.Euler(config.rotation[ 0 ], config.rotation[ 1 ], config.rotation[ 2 ]),
            scale: new THREE.Vector3(config.scale[ 0 ], config.scale[ 1 ], config.scale[ 2 ]),
            addToScene: true
        });

        // 确保场景和模型结果都存在
        if (!this.scene || !modelResult || !modelResult.scene) {
            console.warn("场景或模型加载失败");
            return;
        }

        // 设置模型接收和投射阴影
        modelResult.scene.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        if (this.scene) {
            this.scene.traverse((object) => {
                if (!object) return;
                if (object.name === 'qiang' && object.isMesh) {
                    const geometry = object.geometry;
                    if(!geometry.attributes && !geometry.attributes.uv1) return;
                    object.material = new THREE.MeshStandardMaterial({
                        color: '#6b828a',
                        metalness: 0.2,
                        roughness: 0.9,
                        transparent: true,
                        aoMap : object.material.map,
                        opacity: 0.6,
                        aoMapIntensity : 0.9,
                        depthWrite: true,
                        depthTest: true,
                        blending: THREE.CustomBlending,
                    });
                    object.material.map = null;
                    object.material.needsUpdate = true;
                }

                if (object.name === 'dimian' && object.isMesh) {
                    const geometry = object.geometry;
                    if(!geometry.attributes && !geometry.attributes.uv1) return;
                    if (!object.material) return;
                    object.material = new THREE.MeshStandardMaterial({
                        color: '#57677a',
                        metalness: 0.1,
                        roughness: 0.9,
                        transparent: false,
                        aoMap : object.material.map,
                        aoMapIntensity : 0.4,
                    });
                    object.material.map = null;
                    object.material.needsUpdate = true;
                }

                if (object.name === 'pingmian' && object.isMesh) {
                    const geometry = object.geometry;
                    if(!geometry.attributes && !geometry.attributes.uv1) return;
                    if (!object.material) return;
                    object.material = new THREE.MeshStandardMaterial({
                        color: '#1c253c',
                        metalness: 0.1,
                        roughness: 0.9,
                        transparent: false,
                        aoMap : object.material.map,
                        aoMapIntensity : 1,
                    });
                    object.material.map = null;
                    object.material.needsUpdate = true;
                }

                if (object.name === 'ding' && object.isMesh) {
                    const geometry = object.geometry;
                    if(!geometry.attributes && !geometry.attributes.uv1) return;
                    if (!object.material) return;
                    object.material = new THREE.MeshStandardMaterial({
                        color: '#939393',
                        metalness: 0.1,
                        roughness: 0.9,
                        transparent: false,
                        aoMap : object.material.map,
                        aoMapIntensity : 1,
                        side: THREE.DoubleSide,
                    });
                    object.material.map = null;
                    object.material.needsUpdate = true;
                }
            });
        }
        this.loadedModels.set(config.name, modelResult.scene);
    }
}
