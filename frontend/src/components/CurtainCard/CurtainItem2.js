import React, {useRef, useEffect, useState} from 'react';
import {useIcon} from '@hakit/core';
import {useEntity} from '@hakit/core';
import {useLanguage} from '../../i18n/LanguageContext';
import './CurtainEffect.css';
function MdiArrowCollapseHorizontal() {
    const icon = useIcon('curtain_mdi:arrow-collapse-horizontal');
    return <div>{icon}</div>
}

function MdiArrowExpandHorizontal() {
    const icon = useIcon('curtain_mdi:arrow-expand-horizontal');
    return <div>{icon}</div>
}

function MdiStop() {
    const icon = useIcon('curtain_mdi:stop');
    return <div>{icon}</div>
}

function CurtainItem({entity_id, name}) {
    const {t} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const curtainLeftRef = useRef(null);
    const curtainRightRef = useRef(null);
    const containerRef = useRef(null);
    const [cellCount, setCellCount] = useState(0);
    let resizeObserver;

    // 初始化窗帘格子
    const initCurtainCells = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const newCellCount = Math.max(3, Math.floor(containerWidth / 100));
        setCellCount(newCellCount);
    };

    // 打开窗帘
    const openCurtain = () => {
        if (isOpen) return;

        setIsClosing(false);
        setIsOpen(true);

        const leftFills = document.querySelectorAll('.curtain-left .fill-animation');
        const rightFills = document.querySelectorAll('.curtain-right .fill-animation');

        // 右帘从左向右填充
        rightFills.forEach((fill, index) => {
            setTimeout(() => {
                fill.style.width = '100%';
            }, index * 300);
        });

        // 左帘从右向左填充（反向顺序）
        for (let i = leftFills.length - 1; i >= 0; i--) {
            setTimeout(() => {
                leftFills[i].style.width = '100%';
            }, (leftFills.length - 1 - i) * 300);
        }
    };

    // 关闭窗帘
    const closeCurtain = () => {
        if (!isOpen) return;

        setIsClosing(true);

        const leftFills = document.querySelectorAll('.curtain-left .fill-animation');
        const rightFills = document.querySelectorAll('.curtain-right .fill-animation');

        // 右帘从右向左关闭（反向顺序）
        for (let i = rightFills.length - 1; i >= 0; i--) {
            setTimeout(() => {
                rightFills[i].style.width = '0';
            }, (rightFills.length - 1 - i) * 300);
        }

        // 左帘从左向右关闭
        leftFills.forEach((fill, index) => {
            setTimeout(() => {
                fill.style.width = '0';
            }, index * 300);
        });

        // 动画完成后更新状态
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, (cellCount + 1) * 300);
    };

    // 重置窗帘
    const resetCurtain = () => {
        const fills = document.querySelectorAll('.fill-animation');
        fills.forEach(fill => {
            fill.style.width = '0';
        });
        setIsOpen(false);
        setIsClosing(false);
    };

    // 使用ResizeObserver监听元素大小变化的代码示例

    // 初始化ResizeObserver
    // function initObserver() {
    //     if (resizeObserver) {
    //         resizeObserver.disconnect();
    //     }
    //
    //     resizeObserver = new ResizeObserver(entries => {
    //         for (let entry of entries) {
    //             const { width, height } = entry.contentRect;
    //
    //             initCurtainCells();
    //         }
    //     });
    //     const resizableBox = document.getElementById('curtainId');
    //     resizeObserver.observe(resizableBox);
    //
    // }



    // 组件挂载和窗口大小变化时初始化格子
    useEffect(() => {
         initCurtainCells();
        const handleResize = () => {
            initCurtainCells();
        };
         window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 生成格子
    const renderCells = (side) => {
        const cells = [];
        for (let i = 0; i < cellCount; i++) {
            cells.push(
                <div key={i} className="curtain-cell">
                    <div className="fill-animation"></div>
                </div>
            );
        }
        return cells;
    };

    const curtain = useEntity(entity_id || '', {returnNullIfNotFound: true});
    if (!curtain) {
        return <div>{t('curtain.loadFailed')}</div>
    }

    const position = curtain?.attributes?.current_position || 0;
    const currentPosition = 50 - (position / 2);


    return (
        <div className="curtain-content" id={'curtainId'}>
            <div className="curtain-visualization curtain">
                <div className="curtain-name">{name}</div>
                <div className="curtain-wrapper" ref={containerRef}>
                    <div className="curtain-left" ref={curtainLeftRef}>
                        {renderCells('left')}
                    </div>
                    <div className="curtain-right" ref={curtainRightRef}>
                        {renderCells('right')}
                    </div>
                </div>

                <div className="curtain-side">
                    <div className="curtain-controls">
                        <button
                            className="curtain-control-button"
                            onClick={ openCurtain}
                            title={t('curtain.open')}
                        >
                            <MdiArrowExpandHorizontal/>
                        </button>
                        <button
                            className="curtain-control-button"
                            onClick={() => curtain.service.stopCover()}
                            title={t('curtain.stop')}
                        >
                            <MdiStop/>
                        </button>
                        <button
                            className="curtain-control-button"
                            onClick={() => closeCurtain()}
                            title={t('curtain.close')}
                        >
                            <MdiArrowCollapseHorizontal/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurtainItem; 