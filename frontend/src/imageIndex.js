// Lanhu Project Image Asset Management
// 统一管理蓝湖项目的图片资源

// 使用动态导入来安全地加载图片资源
const loadImage = (path) => {
    try {
        const baseUrl = process.env.PUBLIC_URL || '';
        const fullPath = `${baseUrl}${path}`;
       // console.log('fullPath', fullPath);
        //return require(path);
        return fullPath;
    } catch (error) {
        console.warn(`Image not found: ${path}`);
        return null;
    }
};




const imageAssets = {
    // 控制面板通用图标
    common: {
        xiaLa:loadImage('/kongzhimianban/xiaLa.png'),
        cykg:loadImage('/kongzhimianban/cykg.png'),
        battery: loadImage('/kongzhimianban/FigmaDDSSlicePNG480d10dc6899ff1dadd00b5520a0f9da.png'),
        weather: loadImage('/kongzhimianban/FigmaDDSSlicePNG96d5f11adfaa916ac1dba9a287079af5.png'),
        separator: loadImage('/kongzhimianban/FigmaDDSSlicePNG047b070b351c7c552aa41a527129c68c.png'),
        background: loadImage('/kongzhimianban/FigmaDDSSlicePNGc3be0104e0f487b5b638225605b4bfef.png'),
        // 开关状态图标
        switchOn: loadImage('/kongzhimianban/switchOn.png'),
        switchOff: loadImage('/kongzhimianban/switchOff.png'),
        header: loadImage('/kongzhimianban/header@2.png'),
        controllerBackground: loadImage('/kongzhimianban/controllerBackground.png'),
    },
    lightMode: {
        CloseMode: loadImage('./lightMode/CloseMode.png'),
        DefaultMode: loadImage('./lightMode/DefaultMode.png'),
        GuestMode: loadImage('./lightMode/GuestMode.png'),
        NightMode: loadImage('./lightMode/NightMode.png'),
        TVMode: loadImage('./lightMode/TVMode.png'),
        PCMode: loadImage('./lightMode/PCMode.png'),
    },


    // 灯光控制相关
    lighting: {

        lightHigh: loadImage('./kongzhimianban/lightHigh.png'),
        lightLow: loadImage('./kongzhimianban/lightLow.png'),
        shakedownHigh: loadImage('./kongzhimianban/shakedownHigh.png'),
        shakedownLow: loadImage('./kongzhimianban/shakedownLow.png'),
        icon: loadImage('./kongzhimianban/FigmaDDSSlicePNG29f392c85d12da001aadf0b3cc75a3fd.png'),
        bulb: loadImage('./kongzhimianban/FigmaDDSSlicePNG76aae6377e21f93c31a199c0fcf261c9.png'),
        control: loadImage('./kongzhimianban/FigmaDDSSlicePNG00998bbc1f74ce25aaa5b3c3917aff3c.png'),
        allOn: loadImage('./kongzhimianban/allOn.png'),
        allOff: loadImage('./kongzhimianban/allOff.png'),
        // 各种灯光设备图标
        officeCeiling: loadImage('./kongzhimianban/FigmaDDSSlicePNGe6247428ea593a8fae70c5d167ff14a9.png'),
        sampleCeiling: loadImage('./kongzhimianban/FigmaDDSSlicePNG8f28da2c83d1ace388bad89560f02fa7.png'),
        corridorLight: loadImage('./kongzhimianban/FigmaDDSSlicePNGde60e0992956572b5a43421fbeb6211d.png'),
        livingRoomLight: loadImage('./kongzhimianban/FigmaDDSSlicePNG10bb2eb2201b63acc8c61d83838b9020.png'),
    },

    // 空调控制相关
    climate: {
        icon: loadImage('./kongzhimianban/climateIcon.png'),
        temperature: loadImage('./kongzhimianban/FigmaDDSSlicePNGf53ce440cc3bdcc3f2084da701a24b7a.png'),
        humidity: loadImage('./kongzhimianban/FigmaDDSSlicePNG0470bc6e2867c9ff80f8f4da52183b4e.png'),
        cooling: loadImage('./kongzhimianban/FigmaDDSSlicePNGf15aec2060a22b49752aaaa7cd869252.png'),
        swing: loadImage('./kongzhimianban/climateSwing.png'),
        fan: loadImage('./kongzhimianban/FigmaDDSSlicePNG03e3b08988cdad31c308238455b880c6.png'),
        // 温度调节
        tempUp: loadImage('./kongzhimianban/FigmaDDSSlicePNGaaffa9f698c1fa4a7249f2b26bba73e9.png'),
        tempDown: loadImage('./kongzhimianban/FigmaDDSSlicePNGc19968e636abc2266e6b40fdf6ac35b4.png'),
    },

    // 窗帘控制相关
    curtain: {
        icon: loadImage('./kongzhimianban/curtain-control.png'),
        up: loadImage('./kongzhimianban/FigmaDDSSlicePNGbef9065d9b40f3aa8945709a46ffdcd4.png'),
        stop: loadImage('./kongzhimianban/FigmaDDSSlicePNGe8b4091a44a3b9369c31d841b44df3d0.png'),
        down: loadImage('./kongzhimianban/FigmaDDSSlicePNGa6be58dc2ef5cb4acf92dc0d7feb159e.png'),
        pause: loadImage('./kongzhimianban/FigmaDDSSlicePNG7b28a01ca69445311315fde6c1ca8644.png'),
    },

    // 天气相关图标
    weather: {
        sunny: loadImage('./kongzhimianban/sunny.png'),
        cloudy: loadImage('./kongzhimianban/cloudy.png'),
        rainy: loadImage('./kongzhimianban/rainy.png'),
        snow: loadImage('./kongzhimianban/snow.png'),
        overcast: loadImage('./kongzhimianban/overcast.png'),
        weatherIcon: loadImage('./kongzhimianban/weatherIcon.png'),
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
        temperature: loadImage('./kongzhimianban/temperature.png'),
        humidity: loadImage('./kongzhimianban/humidity.png'),
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
    common: {
        xiaLa: getAsset('common', 'xiaLa'),
        cykg: getAsset('common', 'cykg'),
    },
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
        lightHigh:getAsset('lighting', 'lightHigh'),
        lightLow: getAsset('lighting', 'lightLow'),
        shakedownHigh: getAsset('lighting', 'shakedownHigh'),
        shakedownLow: getAsset('lighting', 'shakedownLow'),


    },

    climateControls: {
        icon: getAsset('climate', 'icon'),
        temperature: getAsset('climate', 'temperature'),
        humidity: getAsset('climate', 'humidity'),
        tempUp: getAsset('climate', 'tempUp'),
        tempDown: getAsset('climate', 'tempDown'),
    },

    curtainControls: {
        icon: getAsset('curtain', 'icon'),
        up: getAsset('curtain', 'up'),
        stop: getAsset('curtain', 'stop'),
        down: getAsset('curtain', 'down'),
        pause: getAsset('curtain', 'pause'),
    },

    switches: {
        on: getAsset('common', 'switchOn'),
        off: getAsset('common', 'switchOff'),
    },
    lightMode: {
        CloseMode: getAsset('lightMode', 'CloseMode') ,
        DefaultMode: getAsset('lightMode', 'DefaultMode'),
        GuestMode: getAsset('lightMode', 'GuestMode'),
        NightMode: getAsset('lightMode', 'NightMode'),
        TVMode: getAsset('lightMode', 'TVMode'),
        PCMode: getAsset('lightMode', 'PCMode'),
    },
};

export default imageAssets;