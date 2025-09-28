import React, { useState } from 'react';
import {Switch} from "antd";
import './style.css';

function Light3DSetCard({ clickedDevice, onClose }) {
  // 模拟的灯光数据
  const lights = [
    { id: 1, name: '吊灯01', status: 'ON', time: '04时20分', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG6ce8162fa403906592c709e0f97383fc.png' },
    { id: 2, name: '吊灯02', status: 'ON', time: '04时20分', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG6ce8162fa403906592c709e0f97383fc.png' },
    { id: 3, name: '吊灯03', status: 'ON', time: '02时16分', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG6ce8162fa403906592c709e0f97383fc.png' },
    { id: 4, name: '吊灯04', status: 'ON', time: '02时16分', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG6ce8162fa403906592c709e0f97383fc.png' },
    { id: 5, name: '吊灯05', status: 'OFF', time: '', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG679dcbc289638eb6dce47bde62b91efd.png' },
    { id: 6, name: '吊灯06', status: 'OFF', time: '', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG679dcbc289638eb6dce47bde62b91efd.png' },
    { id: 7, name: '吊灯07', status: 'ON', time: '02时16分', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG6ce8162fa403906592c709e0f97383fc.png' },
    { id: 8, name: '吊灯08', status: 'OFF', time: '', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG679dcbc289638eb6dce47bde62b91efd.png' },
    { id: 9, name: '吊灯09', status: 'OFF', time: '', image: 'https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG679dcbc289638eb6dce47bde62b91efd.png' },
  ];

  // 计算开启的灯光数量
  const onLights = lights.filter(light => light.status === 'ON').length;
  const totalLights = lights.length;

  // 切换灯光状态
  const toggleLightStatus = (id) => {
    console.log(`切换灯光 ID: ${id}`);
    // 这里可以添加实际的灯光控制逻辑
  };

  // 将灯光数组按两个为一组分组
  const groupLights = (lights) => {
    const groups = [];
    for (let i = 0; i < lights.length; i += 2) {
      groups.push(lights.slice(i, i + 2));
    }
    return groups;
  };

  const lightGroups = groupLights(lights);

  return (
    <div className="section_11 flex-col">
        {/* 顶部标题区域 */}
        <div className="box_7 flex-row justify-between">
          <span className="light3d-title"> {clickedDevice ? `${clickedDevice.labelContent || '设备'}控制` : '灯光控制'} </span>
          <button className="light3d-control-close" onClick={onClose}>
            <img
              className="thumbnail_8"
              src="https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG5f29f7e25349fa6ae0c999c088f41fd5.png"
              alt="灯光控制图标"
            />
          </button>
        </div>

        {/* 统计信息 */}
        <span className="text-light-info">共计{totalLights}台灯，{onLights}台开着</span>

        {/* 分隔线 */}
        <div className="divider-line"></div>

      </div>
  );
}

export default Light3DSetCard;