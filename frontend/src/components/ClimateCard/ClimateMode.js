import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import './ClimateMode.css';
import {useEntity} from '@hakit/core';
import Modal from '../Modal';
import LightControl from '../LightOverviewCard/LightControl';
import { notification,Image } from 'antd';
import BaseCard from '../BaseCard';
import { mdiLightbulbGroup } from '@mdi/js';
import {renderIcon} from '../../common/SvgIndex';
import imageAssets from '../../imageIndex';

// 修正函数签名，使用正确的props解构
function ClimateMode({ climateEntity, climateName, onClose, visible }) {
    // 确保climateEntity存在
    if (!climateEntity) {
        return <div>加载中...</div>;
    }

    return (
        <div className="group_39 ">
            <div className="block_20 flex-row justify-between">
                <span className="text_55">{climateName || '空调'}</span>
                <img
                    className="label_10"
                    src={
                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG538a5cd209d2253af60b7be0eac1ab9f.png"
                    }
                />
            </div>
            <div className="block_21 flex-row justify-between">
                <img
                    className="image_13"
                    src={
                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG24ba83fbb57bd965d921c3fbef7e54dd.png"
                    }
                />
                <div className="box_16 flex-col">
                    <div className="section_13 flex-row justify-between">
                        <div className="box_17 flex-row">
                            <div className="image-text_25 flex-row justify-between">
                                <img
                                    className="label_11"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGf53ce440cc3bdcc3f2084da701a24b7a.png"
                                    }
                                />
                                <div className="text-group_25 flex-col justify-between">
                                    <span className="text_56">当前温度</span>
                                    <span className="text_57">22.0</span>
                                </div>
                            </div>
                            <span className="text_58">℃</span>
                        </div>
                        <div className="box_18 flex-row">
                            <div className="image-text_26 flex-row justify-between">
                                <img
                                    className="label_12"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG0470bc6e2867c9ff80f8f4da52183b4e.png"
                                    }
                                />
                                <div className="text-group_26 flex-col justify-between">
                                    <span className="text_59">当前湿度</span>
                                    <div className="text-wrapper_5 flex-row justify-between">
                                        <span className="text_60">70</span>
                                        <span className="text_61">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="text_62">功能选择</span>
                    <div className="section_14 flex-row justify-between">
                        <div className="group_40 flex-row">
                            <div className="image-text_27 flex-col justify-between">
                                <img
                                    className="label_13"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG5bcda0b5d0b17b8bcf40ee72fd9aeab2.png"
                                    }
                                />
                                <span className="text-group_27">节能</span>
                            </div>
                        </div>
                        <div className="group_41 flex-row">
                            <div className="image-text_28 flex-col justify-between">
                                <img
                                    className="label_14"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG77d35e92fc2129881b4228b4d04c21bd.png"
                                    }
                                />
                                <span className="text-group_28">睡眠</span>
                            </div>
                        </div>
                        <div className="group_42 flex-row">
                            <div className="image-text_29 flex-col justify-between">
                                <img
                                    className="label_15"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG6d1015d8bc740c319dd2d1709b97c304.png"
                                    }
                                />
                                <span className="text-group_29">辅热</span>
                            </div>
                        </div>
                        <div className="group_43 flex-row">
                            <div className="image-text_30 flex-col justify-between">
                                <img
                                    className="label_16"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG3cf07f0f1bfe380a2b60804c0820094c.png"
                                    }
                                />
                                <span className="text-group_30">防直吹</span>
                            </div>
                        </div>
                        <div className="group_44 flex-row">
                            <div className="image-text_31 flex-col justify-between">
                                <img
                                    className="label_17"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG406622852ce25f0ffe4b575710085ef2.png"
                                    }
                                />
                                <span className="text-group_31">新风</span>
                            </div>
                        </div>
                    </div>
                    <div className="section_15 flex-row justify-between">
                        <div className="box_19 flex-row">
                            <div className="image-text_32 flex-row justify-between">
                                <img
                                    className="label_18"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG8ceee248cee8791e2afda245e46ae95d.png"
                                    }
                                />
                                <div className="text-group_32 flex-col justify-between">
                                    <span className="text_63">运行模式</span>
                                    <span className="text_64">制冷</span>
                                </div>
                            </div>
                        </div>
                        <div className="box_20 flex-row">
                            <div className="image-text_33 flex-row justify-between">
                                <img
                                    className="label_19"
                                    src={
                                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGf5289a83da70a224d0619f96f3437079.png"
                                    }
                                />
                                <div className="text-group_33 flex-col justify-between">
                                    <span className="text_65">摆动模式</span>
                                    <span className="text_66">关闭</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="block_22 flex-row">
                <img
                    className="label_20"
                    src={
                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGba825782ffde5346a04e7750e6173e0a.png"
                    }
                />
                <div className="box_21 flex-col justify-between">
                    <div className="image-text_34 flex-col justify-between">
                        <img
                            className="image_14"
                            src={
                                "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG819b97c1730b7e6ac1a5b3121d45b35e.png"
                            }
                        />
                        <div className="text-group_34 flex-row">
                            <span className="text_67">16.0</span>
                            <span className="text_68">℃</span>
                            <span className="text_69">22.0</span>
                            <span className="text_70">℃</span>
                            <span className="text_71">30.0</span>
                            <span className="text_72">℃</span>
                        </div>
                    </div>
                    <div className="box_22 flex-row justify-between">
                        <div className="image-wrapper_3 flex-col">
                            <img
                                className="label_21"
                                src={
                                    "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGace127cb616f57d7d9d78599d463d95e.png"
                                }
                            />
                        </div>
                        <div className="image-wrapper_4 flex-col">
                            <img
                                className="label_22"
                                src={
                                    "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGb2ca24ea874283bd7e30d510d8ef6c1c.png"
                                }
                            />
                        </div>
                        <div className="image-wrapper_5 flex-col">
                            <img
                                className="label_23"
                                src={
                                    "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGc31cada7f54cba482e209107ebe6eea6.png"
                                }
                            />
                        </div>
                    </div>
                </div>
                <img
                    className="label_24"
                    src={
                        "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGadd8ee6d0ca7729dedf41064c341783f.png"
                    }
                />
                <div className="box_23 flex-col justify-between">
                    <span className="text_73">风扇模式：1档</span>
                    <div className="box_24 flex-row justify-between">
                        <div className="image-wrapper_6 flex-col">
                            <img
                                className="label_25"
                                src={
                                    "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG4fc6c47a7d44a98a0a8d3a77b2f3fdc6.png"
                                }
                            />
                        </div>
                        <div className="image-text_35 flex-col justify-between">
                            <img
                                className="image_15"
                                src={
                                    "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGe57626e9e3fb6d5bcd946ab62952e146.png"
                                }
                            />
                            <div className="text-group_35 flex-row justify-between">
                                <span className="text_74">1档</span>
                                <span className="text_75">2档</span>
                                <span className="text_76">3档</span>
                                <span className="text_77">4档</span>
                                <span className="text_78">5档</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box_25 flex-col justify-between">
                    <img
                        className="label_26"
                        src={
                            "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGf22f42bc18ada6435813110e0b859758.png"
                        }
                    />
                    <div className="image-wrapper_7 flex-col">
                        <img
                            className="label_27"
                            src={
                                "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG617b3989dba5d25ffafa825ab0b739b2.png"
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClimateMode;