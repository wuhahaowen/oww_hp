// // SVG解析工具函数
// const parseSVGPath = (svgString) => {
//     try {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(svgString, 'image/svg+xml');
//         const paths = doc.querySelectorAll('path');
//
//         if (paths.length === 0) {
//             throw new Error('未找到SVG路径');
//         }
//
//         return Array.from(paths).map(path => ({
//             d: path.getAttribute('d'),
//             fill: path.getAttribute('fill') || 'currentColor',
//             stroke: path.getAttribute('stroke'),
//             strokeWidth: path.getAttribute('stroke-width')
//         }));
//     } catch (error) {
//         console.error('SVG解析错误:', error);
//         return [];
//     }
// };
//
// const  svgInput = 'D:\\javaProject\\hass_panel_frontend\\public\\climate\\add.svg';
//
// const handleLoadIcon = () => {
//     const paths = parseSVGPath(svgInput);
//     if (paths.length > 0) {
//         return {
//             body: paths.map(path =>
//                 `<path d="${path.d}" ${path.fill ? `fill="${path.fill}"` : ''} ${path.stroke ? `stroke="${path.stroke}"` : ''} ${path.strokeWidth ? `stroke-width="${path.strokeWidth}"` : ''}/>`
//             ).join(''),
//             width: 24,
//             height: 24
//         };
//     }
// };
// const ss = handleLoadIcon();
// console.log(ss)