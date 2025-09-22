// // // 统一管理蓝湖项目的图片资源
// // // 使用动态导入来安全地加载图片资源
//  import {addCollection} from "@iconify/react";
// // import React, { useState, useEffect } from 'react';
// //
// //
//  const iconUrl = process.env.PUBLIC_URL + '/light/chandelier.svg';
// //
// //
// // const [folderPath, setFolderPath] = useState('light');
// // const [files, setFiles] = useState([]);
// // const [isLoading, setIsLoading] = useState(false);
// // const [error, setError] = useState(null);
// // const [previewFile, setPreviewFile] = useState(null);
// //
// //
// // // 获取文件夹内容
// // const fetchFolderContents = async () => {
// //     setIsLoading(true);
// //     setError(null);
// //
// //     try {
// //         debugger
// //         // 使用 fetch API 获取文件夹内容
// //         const response = await fetch(`${process.env.PUBLIC_URL}/folder-contents.json`);
// //         const data = await response.json();
// //
// //         // 过滤出指定文件夹的内容
// //         const folderData = data.find(item => item.path === folderPath);
// //
// //         if (folderData) {
// //             setFiles(folderData.files);
// //         } else {
// //             setFiles([]);
// //             setError(`未找到文件夹: ${folderPath}`);
// //         }
// //     } catch (err) {
// //         setError('无法获取文件夹内容: ' + err.message);
// //         setFiles([]);
// //     } finally {
// //         setIsLoading(false);
// //     }
// // };
// //
// // // 当文件夹路径改变时重新获取内容
// // useEffect(() => {
// //     fetchFolderContents();
// // }, [folderPath]);
// //
// //
// //
// //
// // // 定义自定义图标集
// const customIcons = {
//     prefix: 'custom',
//     icons: {
//         my_image: {
//             body: `<image href='/light/dingdeng_yuan.png' width="24" height="24"/>`,
//             width: 24,
//             height: 24
//         },
//         icon: {
//             body: '<image href='+iconUrl+'>',
//             width: 48,
//             height: 48,
//         },
//
//     }
// }
// //
// //
// //
// // const repalceIcons = {
// //
// //
// //
// // }
// //
// //
// // // 添加到 Iconify
//  addCollection(customIcons);
// //
// //
