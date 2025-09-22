// Lanhu Project Image Asset Management
// 统一管理蓝湖项目的图片资源

// 使用动态导入来安全地加载图片资源
const loadImage = (path) => {
  try {
    return require(path);
  } catch (error) {
    console.warn(`Image not found: ${path}`);
    return null;
  }
};

const imageAssets = {
  // 控制面板通用图标
  common: {
    battery: loadImage('./kongzhimianban/FigmaDDSSlicePNG480d10dc6899ff1dadd00b5520a0f9da.png'),
    home: loadImage('./kongzhimianban/FigmaDDSSlicePNG760128ad9684f0e72df857244e352995.png'),
    weather: loadImage('./kongzhimianban/FigmaDDSSlicePNG96d5f11adfaa916ac1dba9a287079af5.png'),
    separator: loadImage('./kongzhimianban/FigmaDDSSlicePNG047b070b351c7c552aa41a527129c68c.png'),
    background: loadImage('./kongzhimianban/FigmaDDSSlicePNGc3be0104e0f487b5b638225605b4bfef.png'),
    // 开关状态图标
    switchOn: loadImage('./kongzhimianban/FigmaDDSSlicePNG242ac23827c6159d8038b7d4dbbc8937.png'),
    switchOff: loadImage('./kongzhimianban/FigmaDDSSlicePNGc221af57ac7bb4f4c68dfe478fdda7d1.png'),
  },
  
  // 灯光控制相关
  lighting: {
    icon: loadImage('./kongzhimianban/FigmaDDSSlicePNG29f392c85d12da001aadf0b3cc75a3fd.png'),
    bulb: loadImage('./kongzhimianban/FigmaDDSSlicePNG76aae6377e21f93c31a199c0fcf261c9.png'),
    control: loadImage('./kongzhimianban/FigmaDDSSlicePNG00998bbc1f74ce25aaa5b3c3917aff3c.png'),
    allOn: loadImage('./kongzhimianban/FigmaDDSSlicePNG5910008a128d122dce4b252e35d7e88a.png'),
    allOff: loadImage('./kongzhimianban/FigmaDDSSlicePNG352522bb76309931c7e17c0a5f851c35.png'),
    // 各种灯光设备图标
    officeCeiling: loadImage('./kongzhimianban/FigmaDDSSlicePNGe6247428ea593a8fae70c5d167ff14a9.png'),
    sampleCeiling: loadImage('./kongzhimianban/FigmaDDSSlicePNG8f28da2c83d1ace388bad89560f02fa7.png'),
    corridorLight: loadImage('./kongzhimianban/FigmaDDSSlicePNGde60e0992956572b5a43421fbeb6211d.png'),
    livingRoomLight: loadImage('./kongzhimianban/FigmaDDSSlicePNG10bb2eb2201b63acc8c61d83838b9020.png'),
  },
  
  // 空调控制相关
  climate: {
    icon: loadImage('./kongzhimianban/FigmaDDSSlicePNG3c73f3d1037e06bc6078d2161bce6e64.png'),
    temperature: loadImage('./kongzhimianban/FigmaDDSSlicePNGf53ce440cc3bdcc3f2084da701a24b7a.png'),
    humidity: loadImage('./kongzhimianban/FigmaDDSSlicePNG0470bc6e2867c9ff80f8f4da52183b4e.png'),
    cooling: loadImage('./kongzhimianban/FigmaDDSSlicePNGf15aec2060a22b49752aaaa7cd869252.png'),
    swing: loadImage('./kongzhimianban/FigmaDDSSlicePNG671d5795ed8c7199391435434cca871d.png'),
    fan: loadImage('./kongzhimianban/FigmaDDSSlicePNG03e3b08988cdad31c308238455b880c6.png'),
    // 温度调节
    tempUp: loadImage('./kongzhimianban/FigmaDDSSlicePNGaaffa9f698c1fa4a7249f2b26bba73e9.png'),
    tempDown: loadImage('./kongzhimianban/FigmaDDSSlicePNGc19968e636abc2266e6b40fdf6ac35b4.png'),
  },
  
  // 窗帘控制相关
  curtain: {
    up: loadImage('./kongzhimianban/FigmaDDSSlicePNGbef9065d9b40f3aa8945709a46ffdcd4.png'),
    stop: loadImage('./kongzhimianban/FigmaDDSSlicePNGe8b4091a44a3b9369c31d841b44df3d0.png'),
    down: loadImage('./kongzhimianban/FigmaDDSSlicePNGa6be58dc2ef5cb4acf92dc0d7feb159e.png'),
    pause: loadImage('./kongzhimianban/FigmaDDSSlicePNG7b28a01ca69445311315fde6c1ca8644.png'),
  },
  
  // 天气相关图标  
  weather: {
    sunny: loadImage('./kongzhimianban/FigmaDDSSlicePNG96d5f11adfaa916ac1dba9a287079af5.png'),
    cloudy: loadImage('./kongzhimianban/FigmaDDSSlicePNG18973bd3eaeeac88ca2ac17781c4a66d.png'),
    rainy: loadImage('./kongzhimianban/FigmaDDSSlicePNG209e1dfd36ed5b712a2a4e30852cc923.png'),
    snow: loadImage('./kongzhimianban/FigmaDDSSlicePNG1e4a3a1b85114bfb70289f08edf69069.png'),
    overcast: loadImage('./kongzhimianban/FigmaDDSSlicePNGda08ffdd4805175b356b6116e6129a4a.png'),
    weatherIcon: loadImage('./kongzhimianban/FigmaDDSSlicePNGcb9b146f5baf203c6d776e8504817648.png'),
  },
  
  // 功能模式图标
  modes: {
    home: loadImage('./kongzhimianban/FigmaDDSSlicePNG6cbebb392500eed27c4c053a2a10bd13.png'),
    away: loadImage('./kongzhimianban/FigmaDDSSlicePNG615c58d039053e31dd8794cef82585cb.png'),
    movie: loadImage('./kongzhimianban/FigmaDDSSlicePNG1235dc95e1f01abdab875390428742f3.png'),
    sleep: loadImage('./kongzhimianban/FigmaDDSSlicePNG352522bb76309931c7e17c0a5f851c35.png'),
  },
  
  // 传感器图标
  sensors: {
    light: loadImage('./kongzhimianban/FigmaDDSSlicePNG6957bc6deedcf53a73da27927a062d47.png'),
    motion: loadImage('./kongzhimianban/FigmaDDSSlicePNG3679b8084354c86c3f1c4d9ce0d69ec7.png'),
    temperature: loadImage('./kongzhimianban/FigmaDDSSlicePNG4351b3881f05a92ec358c5d0f28bfc10.png'),
    humidity: loadImage('./kongzhimianban/FigmaDDSSlicePNGbd7305edbcb0b7e6545ac9f5175143ea.png'),
  },
  
  // 全屋总览相关
  overview: {
    icon: loadImage('./quanwuzonglanbangongqu/FigmaDDSSlicePNGfea71540295d4cdc3a2e84a1ab17831b.png'),
    dropdown: loadImage('./quanwuzonglanbangongqu/FigmaDDSSlicePNG8d69f92a3baa3ee1f610d26287a48372.png'),
    controlPanel: loadImage('./kongzhimianban/FigmaDDSSlicePNGe1d1e45060aa165deaa7acb93bb093c6.png'),
  }
};

// 图片加载工具函数
export const getAsset = (category, name) => {
  try {
    return imageAssets[category]?.[name] || null;
  } catch (error) {
    console.warn(`Asset not found: ${category}.${name}`);
    return null;
  }
};

// 预定义的常用图片组合
export const assetGroups = {
  statusBar: {
    battery: getAsset('common', 'battery'),
    home: getAsset('common', 'home'),
    weather: getAsset('common', 'weather'),
  },
  
  lightingControls: {
    icon: getAsset('lighting', 'icon'),
    bulb: getAsset('lighting', 'bulb'),
    control: getAsset('lighting', 'control'),
    allOn: getAsset('lighting', 'allOn'),
    allOff: getAsset('lighting', 'allOff'),
  },
  
  climateControls: {
    icon: getAsset('climate', 'icon'),
    temperature: getAsset('climate', 'temperature'),
    humidity: getAsset('climate', 'humidity'),
    tempUp: getAsset('climate', 'tempUp'),
    tempDown: getAsset('climate', 'tempDown'),
  },
  
  curtainControls: {
    up: getAsset('curtain', 'up'),
    stop: getAsset('curtain', 'stop'),
    down: getAsset('curtain', 'down'),
    pause: getAsset('curtain', 'pause'),
  },
  
  switches: {
    on: getAsset('common', 'switchOn'),
    off: getAsset('common', 'switchOff'),
  }
};

export default imageAssets;