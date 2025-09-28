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
        xiaLa:loadImage('/kongzhimianban/xiaLa.svg'),
        cykg:loadImage('/kongzhimianban/cykg.svg'),
        battery: loadImage('/light/ceiling-light.svg'),
        weather: loadImage('/kongzhimianban/xx.png'),
        separator: loadImage('/kongzhimianban/xx.png'),
        background: loadImage('/kongzhimianban/back.jpg'),
        // 开关状态图标
        switchOn: loadImage('/kongzhimianban/switchOn.png'),
        switchOff: loadImage('/kongzhimianban/switchOff.png'),
        header: loadImage('/kongzhimianban/header.svg'),
        controllerBackground: loadImage('/kongzhimianban/controllerBackground.png'),
        home:loadImage('./kongzhimianban/home.svg')
    },
    lightMode: {
        CloseMode: loadImage('./lightMode/CloseMode.svg'),
        DefaultMode: loadImage('./lightMode/DefaultMode.svg'),
        GuestMode: loadImage('./lightMode/GuestMode.svg'),
        NightMode: loadImage('./lightMode/NightMode.svg'),
        TVMode: loadImage('./lightMode/TVMode.svg'),
        PCMode: loadImage('./lightMode/PCMode.svg'),
    },


    // 灯光控制相关
    lighting: {

        lightHigh: loadImage('./kongzhimianban/lightHigh.svg'),
        lightLow: loadImage('./kongzhimianban/lightLow.svg'),
        shakedownHigh: loadImage('./kongzhimianban/lightHigh.svg'),
        shakedownLow: loadImage('./kongzhimianban/shakedownLow.svg'),
        icon: loadImage('./kongzhimianban/xx.png'),
        bulb: loadImage('./kongzhimianban/xx.png'),
        control: loadImage('./kongzhimianban/xx.png'),
        allOn: loadImage('./kongzhimianban/allOn.svg'),
        allOff: loadImage('./kongzhimianban/allOff.svg'),
        // 各种灯光设备图标
        officeCeiling: loadImage('./kongzhimianban/xx.png'),
        sampleCeiling: loadImage('./kongzhimianban/xx.png'),
        corridorLight: loadImage('./kongzhimianban/xx.png'),
        livingRoomLight: loadImage('./kongzhimianban/xx.png'),
    },

    // 空调控制相关
    climate: {
        icon: loadImage('./kongzhimianban/climateIcon.svg'),
        temperature: loadImage('./kongzhimianban/xx.png'),
        humidity: loadImage('./kongzhimianban/xx.png'),
        cooling: loadImage('./kongzhimianban/xx.png'),
        swing: loadImage('./kongzhimianban/climateSwing.svg'),
        fan: loadImage('./kongzhimianban/xx.png'),
        // 温度调节
        tempUp: loadImage('./kongzhimianban/xx.png'),
        tempDown: loadImage('./kongzhimianban/xx.png'),
    },

    // 窗帘控制相关
    curtain: {
        icon: loadImage('./kongzhimianban/curtain-control.svg'),
        up: loadImage('./kongzhimianban/xx.png'),
        stop: loadImage('./kongzhimianban/xx.png'),
        down: loadImage('./kongzhimianban/xx.png'),
        pause: loadImage('./kongzhimianban/xx.png'),
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
        home: loadImage('./kongzhimianban/xx.png'),
        away: loadImage('./kongzhimianban/xx.png'),
        movie: loadImage('./kongzhimianban/xx.png'),
        sleep: loadImage('./kongzhimianban/xx.png'),
    },

    // 传感器图标
    sensors: {
        light: loadImage('./kongzhimianban/xx.png'),
        motion: loadImage('./kongzhimianban/xx.png'),
        temperature: loadImage('./kongzhimianban/temperature.svg'),
        humidity: loadImage('./kongzhimianban/humidity.svg'),
    },

    // 全屋总览相关
    overview: {
        icon: loadImage('./quanwuzonglanbangongqu/xx.png'),
        dropdown: loadImage('./quanwuzonglanbangongqu/xx.png'),
        controlPanel: loadImage('./kongzhimianban/xx.png'),
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
        home:getAsset('common','home'),
        background:getAsset('common','background')
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