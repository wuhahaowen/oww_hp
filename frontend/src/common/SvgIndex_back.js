// 统一管理蓝湖项目的图片资源
// 使用动态导入来安全地加载图片资源
import {addCollection} from "@iconify/react";
import {iconConfig} from "./json";
import axios from 'axios';

const fetchIcons = async (svgPath) => {
    try {

       // const svgPath = `${process.env.PUBLIC_URL}/climate/add.svg`;

        const response = await axios.get(svgPath);
        // 创建临时DOM元素来解析SVG内容
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response.data, 'image/svg+xml');

        // 检查解析是否成功
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('SVG解析错误: ' + parserError.textContent);
        }
        const paths = Array.from(svgDoc.querySelectorAll('path'));

        return paths.map(path => ({
            d: path.getAttribute('d') || '',
            fill: path.getAttribute('fill') || 'currentColor',
            stroke: path.getAttribute('stroke') || 'none',
            strokeWidth: path.getAttribute('stroke-width') || '0',
            id: path.id || ''
        }));

    }catch ( error){
        console.error('Error fetching SVG:', error);
    }
}


const generateIconsWithLoop = async () => {
    const iconList = [];

    if (iconConfig.length !== 0) {
        // Use Promise.all for better async handling
        await Promise.all(iconConfig.map(async (item) => {
            const newIcons = {
                prefix: item.path + "_mdi",
                icons: {}
            };

            for (const file of item.files) {
                const svgPath = `${process.env.PUBLIC_URL}/${item.path}/${file.name}`;

                try {
                    // Add error handling for fetchIcons
                    const paths = await fetchIcons(svgPath);

                    // Check if paths is defined before using map
                    if (!paths || !Array.isArray(paths)) {
                        console.error(`No paths returned for ${svgPath}`);
                        continue; // Skip this file
                    }

                    const iconBody = paths.map(path =>
                        `<path d="${path.d}" ${path.fill ? `fill="${path.fill}"` : ''} ${path.stroke ? `stroke="${path.stroke}"` : ''} ${path.strokeWidth ? `stroke-width="${path.strokeWidth}"` : ''}/>`
                    ).join('');

                    const name = file.name.split(' ')[0]; // More robust name extraction
                    newIcons.icons[name] = {
                        body: iconBody,
                        width: 48,
                        height: 48
                    };
                } catch (error) {
                    console.error(`Error processing ${svgPath}:`, error);
                }
            }

            iconList.push(newIcons);
            addCollection(newIcons);
        }));
    }

    return iconList;
};

// //获取所有的svg图标
// const generateIconsWithLoop =  async (any) => {
//     const iconList = [];
//
//
//     if(iconConfig.length !== 0){
//         iconConfig.map(async (item) => {
//
//             const newIcons = {
//                 prefix: item.path + "_mdi",
//                 icons: {}
//             };
//             for (const file of item.files) {
//                 const svgPath = `${process.env.PUBLIC_URL}/`+item.path+'/'+file.name;
//                 const paths = await fetchIcons(svgPath)||[];
//                 const iconBody = paths.map(path =>
//                 `<path d="${path.d}" ${path.fill ? `fill="${path.fill}"` : ''} ${path.stroke ? `stroke="${path.stroke}"` : ''} ${path.strokeWidth ? `stroke-width="${path.strokeWidth}"` : ''}/>`
//             ).join('');
//                 const name = file.name.split('.')[0];
//                 newIcons.icons[name] = {
//                     // body: `<image href='${process.env.PUBLIC_URL}/${item.path}/${file.name}' width="100" height="100"/>`,
//                   body: iconBody,
//                     width: 48,
//                     height: 48
//                 };
//
//             }
//             iconList.push(newIcons);
//             // 添加到 Iconify
//             addCollection(newIcons);
//
//         })
//     }
//
//
//    return iconList;
// };


export  const  renderIcon =   (path,orgIcon) => {
    // 检查图标格式是否正确（应包含冒号）

    try {
        if(orgIcon.indexOf(':') === -1){
            const allIcons =  generateIconsWithLoop();
            const iconPath =  Object.values(allIcons).filter( item => item.prefix === path+"_mdi" );
            if (iconPath.length>0) {
                const isValidIcon = Object.keys(iconPath[0].icons).find(key => key === orgIcon);
                if(isValidIcon) {
                    return path+'_mdi:'+orgIcon
                }else{
                    if(path === 'light'){
                        return 'light_mdi:track-light'
                    }else if(path === 'weather'){
                        return 'weather_mdi:mdiWeatherCloudy'

                    }else if(path === 'climate'){
                        return 'climate_mdi:mdiLeaf'
                    }else{
                        return 'light_mdi:track-light'
                    }

                }
            }
        }else{
            const lightIcon = path+'_'+orgIcon;
            const [oldPrefix, name] = lightIcon.split(':');

            //检查分割后的部分是否有效
            if (!oldPrefix || !name) {
                return 'light_mdi:track-light';
            }
            const allIcons =  generateIconsWithLoop();
            const iconPath =  Object.values(allIcons).filter( item => item.prefix === oldPrefix );
            if (iconPath.length>0) {
                const isValidIcon = Object.keys(iconPath[0].icons).find(key => key === name);
                if(isValidIcon) {
                    return lightIcon
                }else{
                    return 'light_mdi:track-light'
                }
            }
        }
        return 'light_mdi:track-light'
    }catch (error) {
        console.error('Error processing icon:', error);
        return 'light mdi:track-light';
    }
};


//

