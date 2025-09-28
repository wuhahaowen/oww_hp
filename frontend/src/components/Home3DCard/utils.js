import { 
    THREE, 
    ShaderGlowMaterial, 
} from './aether3d-engine.umd.js';

/**
 * 设置PBR默认材质或高亮材质
 * @param {THREE.Object3D} object - 3D对象
 * @returns {{defaultMat: THREE.MeshStandardMaterial|null, highlightMat: ShaderGlowMaterial|null}} 材质对象
 */
export function SetPBRDefaultOrHighlightMat(object) {
    if (!object.isMesh) {
        return {defaultMat: null, highlightMat: null};
    }

    // 创建默认 PBR 材质
    const defaultMat = new THREE.MeshStandardMaterial({
        color: '#aeaeae',
        metalness: 0.01,
        roughness: 0.6,
        map: object.material.map,          // 使用原材质的贴图
        aoMap: object.material.aoMap,      // 建议使用专门的 aoMap，而非用 map 代替
        aoMapIntensity: 1,
        side: THREE.DoubleSide,
    });

    // 创建高亮发光材质
    const highlightMaterial = new ShaderGlowMaterial({
        map: object.material.map,
        aoMap: object.material.aoMap,     // AO贴图用于自发光
        glowColor: '#fffb00',             // 自发光颜色：黄色
        glowIntensity: 0.7,               // 自发光强度
        baseBrightness: 0.9,              // 基础亮度，避免过白
        side: THREE.DoubleSide,
    });

    // 返回两个材质对象
    return { defaultMat, highlightMat: highlightMaterial };
}
