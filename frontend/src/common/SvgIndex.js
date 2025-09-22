// 统一管理蓝湖项目的图片资源
// 使用动态导入来安全地加载图片资源
import {addCollection} from "@iconify/react";
import React, { useEffect } from 'react';
import { getMdiIcons } from '../utils/helper';
import {iconConfig} from "./json";


//获取所有的svg图标
const generateIconsWithLoop =  (any) => {
   // const response = await fetch(`${process.env.PUBLIC_URL}/folder-contents.json`);
   //  const data = await response.json();
    const iconList = [];

    if(iconConfig.length !== 0){
        iconConfig.map((item) => {

            const newIcons = {
                prefix:  item.path+"_mdi",
                icons: {}
            };
            item.files.forEach((file) => {
                const name = file.name.split('.')[0];
                newIcons.icons[name] = {
                    body: `<image href='${process.env.PUBLIC_URL}/${item.path}/${file.name}' width="48" height="48"/>`,
                    width: 48,
                    height: 48
                };

            })
            iconList.push(newIcons);
            // 添加到 Iconify
            addCollection(newIcons);

        })
    }


   return iconList;
};


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

