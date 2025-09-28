import React,{useState} from 'react';
import './style.css';
import imageAssets from '../../imageIndex';
const HeaderNavbar = ({width}) => {

    const rooms = [
        "全部",
        "客厅",
        "厨房",
        "卫生间",
        "茶室",
        "书房",
        "棋牌室",
        "阳台",
        "洗衣室",
        "主卧",
    ];

    const [isVisible, setIsVisible] = useState(false);
    // 获取红色框覆盖层元素
    const onNavigateToOverview = () => {
        if(isVisible){
            setIsVisible(false)
        }else{
            setIsVisible(true)

        }


    };


    return (
        <div className="header-navbar-group flex-col justify-between" width ={width}>
            <div className="header-navbar-box flex-row">
                <span className="header-navbar-title" onClick={() => {
                    onNavigateToOverview()
                }}>全屋总览</span>
                <img
                    alt=""
                    className="header-navbar-arrow"
                    src={imageAssets.common.xiaLa}

                />

                {rooms.map((room, index) => {
                    if (room === "全部") {
                        return (
                            <div key={index} className="header-navbar-section flex-col justify-between">
                                <span className="header-navbar-room-active">{room}</span>
                                <img
                                    className="header-navbar-dropdown"
                                    src="https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNG8d69f92a3baa3ee1f610d26287a48372.png"
                                    alt="dropdown"
                                />
                            </div>
                        );
                    } else {
                        return (
                            <span key={index} className="header-navbar-room">{room}</span>
                        );
                    }
                })}

            </div>
            {/*{isVisible && (*/}
            {/*    <div className="header-navbar-floor-box flex-col">*/}
            {/*        <div className="header-navbar-floor-active flex-col">*/}
            {/*            <span className="header-navbar-floor-text">全屋总揽</span>*/}
            {/*        </div>*/}
            {/*        <div className="header-navbar-floor flex-col">*/}
            {/*            <span className="header-navbar-floor-number">B1</span>*/}
            {/*        </div>*/}
            {/*        <div className="header-navbar-floor flex-col">*/}
            {/*            <span className="header-navbar-floor-number">L1</span>*/}
            {/*        </div>*/}
            {/*        <div className="header-navbar-floor flex-col">*/}
            {/*            <span className="header-navbar-floor-number">L2</span>*/}
            {/*        </div>*/}
            {/*        <div className="header-navbar-floor flex-col">*/}
            {/*            <span className="header-navbar-floor-number">L3</span>*/}
            {/*        </div>*/}
            {/*        <div className="header-navbar-floor flex-col">*/}
            {/*            <span className="header-navbar-floor-number">L4</span>*/}
            {/*        </div>*/}
            {/*        /!* 添加底部模糊渐变效果 *!/*/}
            {/*        <div className="header-navbar-gradient-overlay"></div>*/}
            {/*    </div>*/}
            {/*)}*/}

        </div>
    );
};

export default HeaderNavbar;
