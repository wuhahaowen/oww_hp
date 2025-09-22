// import React, { useState } from 'react';
//
// function IconGenerator() {
//     // 初始图标数据
//     const [icons, setIcons] = useState({
//         prefix: 'custom',
//         icons: {
//             my_image: {
//                 body: `<image href='/light/dingdeng_yuan.png' width="24" height="24"/>`,
//                 width: 24,
//                 height: 24
//             },
//             icon: {
//                 body: `<image href='${process.env.PUBLIC_URL}/light/mdiSnowflake.svg' width="48" height="48"/>`,
//                 width: 48,
//                 height: 48,
//             }
//         }
//     });
//
//     // 使用循环生成图标数据
//     const generateIconsWithLoop = () => {
//         const iconNames = ['home', 'user', 'settings', 'search', 'notification'];
//         const newIcons = {
//             prefix: 'custom',
//             icons: {}
//         };
//
//         // 使用for循环生成图标数据
//         for (let i = 0; i < iconNames.length; i++) {
//             const name = iconNames[i];
//             newIcons.icons[name] = {
//                 body: `<image href='${process.env.PUBLIC_URL}/icons/${name}.svg' width="24" height="24"/>`,
//                 width: 24,
//                 height: 24
//             };
//         }
//
//         return newIcons;
//     };
//
//     // 使用map生成图标数据
//     const generateIconsWithMap = () => {
//         const iconNames = ['document', 'image', 'video', 'audio', 'download'];
//
//         const iconsMap = iconNames.map(name => ({
//             [name]: {
//                 body: `<image href='${process.env.PUBLIC_URL}/icons/${name}.svg' width="32" height="32"/>`,
//                 width: 32,
//                 height: 32
//             }
//         }));
//
//         const newIcons = {
//             prefix: 'custom',
//             icons: Object.assign({}, ...iconsMap)
//         };
//
//         return newIcons;
//     };
//
//
//
//     return (
//         <div className="icon-generator">
//
//         </div>
//     );
// }
//
// export default IconGenerator;