import React, {useRef, useEffect, useState,useMemo,useCallback} from 'react';
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
    const containerRef = useRef(null);
    const curtainLeftRef = useRef(null);
    const curtainRightRef = useRef(null);
    const timersRef = useRef([]);
    const animationStateRef = useRef({
        isRunning: false,
        direction: null,
        pausedWidths: []
    });
    const { t } = useLanguage();
    const curtain = useEntity(entity_id || '', {returnNullIfNotFound: true});


    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const position = curtain?.attributes?.current_position || 0;
    const currentPosition = 50 - (position / 2);


    // 初始化窗帘格子
    const initCurtainCells = useCallback(() => {
        if (!curtainLeftRef.current || !curtainRightRef.current || !containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const cellCount = Math.max(3, Math.floor(containerWidth / 80));

        curtainLeftRef.current.innerHTML = '';
        curtainRightRef.current.innerHTML = '';

        for (let i = 0; i < cellCount; i++) {
            const leftCell = document.createElement('div');
            leftCell.className = 'curtain-cell';
            if(i === 0){
                /* 上边 | 右边 | 下边 | 左边 */
                leftCell.style.margin='4px 2px 4px 0px';
            }else if(i===cellCount-1){
                /* 上边 | 右边 | 下边 | 左边 */
                leftCell.style.margin='4px 4px 4px 2px';
            }else{
                leftCell.style.margin='4px 2px 4px 2px';
            }

            leftCell.innerHTML = '<div class="fill-animation"></div>';
            curtainLeftRef.current.appendChild(leftCell);

            const rightCell = document.createElement('div');
            rightCell.className = 'curtain-cell';
            if(i === cellCount -1){
                /* 上边 | 右边 | 下边 | 左边 */
                rightCell.style.margin='4px 0px 4px 2px ';
            }else if(i === 0){
                /* 上边 | 右边 | 下边 | 左边 */
                rightCell.style.margin='4px 2px 4px 4px';
            }else{
                rightCell.style.margin='4px 2px 4px 2px';
            }
            rightCell.innerHTML = '<div class="fill-animation"></div>';
            curtainRightRef.current.appendChild(rightCell);
        }

        // 确保所有格子初始宽度为0
        const fills = [
            ...(curtainLeftRef.current.querySelectorAll('.fill-animation') || []),
            ...(curtainRightRef.current.querySelectorAll('.fill-animation') || [])
        ];


        // const leftFills = curtainLeftRef.current?.querySelectorAll('.fill-animation') || [];
        // const rightFills = curtainRightRef.current?.querySelectorAll('.fill-animation') || [];


        // const position = curtain?.attributes?.current_position || 0;
        // const currentPosition = 50 - (position / 2);
        //
        // if (currentPosition > 0) {
        //     for (let i = 0; i < leftFills.length; i++){
        //         if(leftFills.length/2 < i){
        //             leftFills[i].style.width = `100%`;
        //         }
        //     }
        //
        //     for (let i = 0; i < rightFills.length; i++){
        //         if(rightFills.length/2 > i){
        //             rightFills[i].style.width = `100%`;
        //         }
        //     }
        // }else{
        //     fills.forEach(fill => {
        //         fill.style.width = '0';
        //     });
        // }

        fills.forEach(fill => {
            fill.style.width = '0';
        });
    }, []);

    // 清除所有定时器
    const clearAllTimers = useCallback(() => {
        timersRef.current.forEach(timerId => clearTimeout(timerId));
        timersRef.current = [];
    }, []);

    // 打开窗帘 - 逐个格子打开
    const openCurtain = useCallback(() => {

        clearAllTimers();
        animationStateRef.current.isRunning = true;
        animationStateRef.current.direction = 'open';
        animationStateRef.current.pausedWidths = [];

        try {
            curtain.service.openCover();
        }catch (error){
            console.error('Error open cover:', error);
        }

        const leftFills = curtainLeftRef.current?.querySelectorAll('.fill-animation') || [];
        const rightFills = curtainRightRef.current?.querySelectorAll('.fill-animation') || [];

        // 右帘从左向右逐个打开
        rightFills.forEach((fill, index) => {
            const timerId = setTimeout(() => {
                fill.style.width = '100%';
            }, index * 350); // 每个格子延迟350ms，确保逐个打开效果
            timersRef.current.push(timerId);
        });

        // 左帘从右向左逐个打开（反向顺序）
        for (let i = leftFills.length - 1; i >= 0; i--) {
            const timerId = setTimeout(() => {
                leftFills[i].style.width = '100%';
            }, (leftFills.length - 1 - i) * 350);
            timersRef.current.push(timerId);
        }

        // 动画完成标记
        const finalTimerId = setTimeout(() => {
            animationStateRef.current.isRunning = false;
        }, Math.max(leftFills.length, rightFills.length) * 350 + 1000);
        timersRef.current.push(finalTimerId);
    }, [clearAllTimers]);

    // 关闭窗帘 - 逐个格子关闭
    const closeCurtain = useCallback(() => {
        clearAllTimers();
        animationStateRef.current.isRunning = true;
        animationStateRef.current.direction = 'close';
        animationStateRef.current.pausedWidths = [];

        try {
            curtain.service.closeCover();
        } catch (error) {
            console.error('Error stopping cover:', error);
        }

        const leftFills = curtainLeftRef.current?.querySelectorAll('.fill-animation') || [];
        const rightFills = curtainRightRef.current?.querySelectorAll('.fill-animation') || [];

        // 右帘从右向左逐个关闭
        for (let i = rightFills.length - 1; i >= 0; i--) {
            const timerId = setTimeout(() => {
                rightFills[i].style.width = '0';
            }, (rightFills.length - 1 - i) * 350);
            timersRef.current.push(timerId);
        }

        // 左帘从左向右逐个关闭
        leftFills.forEach((fill, index) => {
            const timerId = setTimeout(() => {
                fill.style.width = '0';
            }, index * 350);
            timersRef.current.push(timerId);
        });

        // 动画完成标记
        const finalTimerId = setTimeout(() => {
            animationStateRef.current.isRunning = false;
        }, Math.max(leftFills.length, rightFills.length) * 350 + 1000);
        timersRef.current.push(finalTimerId);
    }, [clearAllTimers]);

    // 暂停窗帘动画
    const pauseCurtain = useCallback(() => {
        if (animationStateRef.current.isRunning) {
            clearAllTimers();
            animationStateRef.current.isRunning = false;

            const fills = [
                ...(curtainLeftRef.current?.querySelectorAll('.fill-animation') || []),
                ...(curtainRightRef.current?.querySelectorAll('.fill-animation') || [])
            ];

            animationStateRef.current.pausedWidths = Array.from(fills).map(fill =>
                getComputedStyle(fill).width
            );
            try {
                curtain.service.stopCover();
            }catch (error){
                console.error('Error stopping cover:', error);
            }

        } else if (animationStateRef.current.direction && animationStateRef.current.pausedWidths.length > 0) {
            if (animationStateRef.current.direction === 'open') {
                openCurtain();
            } else if (animationStateRef.current.direction === 'close') {
                closeCurtain();
            }
        }
    }, [openCurtain, closeCurtain]);



    // 重置窗帘
    const resetCurtain = useCallback(() => {
        clearAllTimers();
        animationStateRef.current.isRunning = false;
        animationStateRef.current.direction = null;
        animationStateRef.current.pausedWidths = [];

        const fills = [
            ...(curtainLeftRef.current?.querySelectorAll('.fill-animation') || []),
            ...(curtainRightRef.current?.querySelectorAll('.fill-animation') || [])
        ];

        fills.forEach(fill => {
            fill.style.width = '0';
        });
    }, [clearAllTimers]);

    // 监听容器尺寸变化
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setContainerSize({ width, height });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
            clearAllTimers();
        };
    }, [clearAllTimers]);

    // 初始化格子和自适应高度
    useEffect(() => {

        if (containerRef.current) {
            initCurtainCells();
        }
    }, [containerSize.width, initCurtainCells]);
    //初始化窗帘格子颜色
    useEffect(() => {


        initCurtainCells();
    }, []);





    return (
        <div className="curtain-container" ref={containerRef}>
            <h3 className="curtain-title">{name}</h3>

            <div
                className="curtain-wrapper"
                style={{ height: `86px` }}
            >
                <div className="curtain-left" ref={curtainLeftRef}></div>
                <div className="curtain-right" ref={curtainRightRef}></div>
            </div>

            <div className="controls">
                <button className="btn btn-open" onClick={openCurtain}
                        disabled={curtain.state === 'open'}
                > <MdiArrowExpandHorizontal/></button>
                <button className="btn btn-pause" onClick={pauseCurtain}><MdiStop/></button>
                <button className="btn btn-close" onClick={closeCurtain}
                        disabled={curtain.state === 'closed'}
                > <MdiArrowCollapseHorizontal/></button>

            </div>
        </div>
    );
};
export default CurtainItem; 