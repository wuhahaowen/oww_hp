/* eslint-disable no-restricted-globals */

// 这个 service worker 可以被自定义！
// 请参见 https://developers.google.com/web/tools/workbox/modules
// 查看可用的 Workbox 模块列表，或添加任何其他
// 你想要的代码。
// 你也可以删除这个文件，如果你不想使用
// service worker，Workbox 构建步骤将被跳过。

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

clientsClaim();

// 预缓存所有由构建过程生成的资产。
// 它们的 URL 被注入到下面的 manifest 变量中。
// 这个变量必须在你的 service worker 文件中的某个地方存在，
// 即使你决定不使用预缓存。请参见 https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// 设置 App Shell 样式的路由，使得所有导航请求
// 都由你的 index.html shell 满足。了解更多：
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // 返回 false 以免除请求不被 index.html 满足。
  ({ request, url }) => {
    // 如果这不是一个导航请求，跳过。
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// 使用 stale-while-revalidate 策略缓存 Google Fonts 样式表。
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// 使用 cache-first 策略缓存底层字体文件，缓存 1 年。
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 年
        maxEntries: 30,
      }),
    ],
  })
);

// 缓存图片
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
      }),
    ],
  })
);

// 缓存 CSS 和 JavaScript 文件
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
      }),
    ],
  })
);

// 缓存 API 请求
registerRoute(
  ({ url }) => url.origin === '*',
  new NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 10 * 60, // 10 分钟
      }),
    ],
  })
);

// 这允许 Web 应用通过以下方式触发 skipWaiting：
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 任何其他自定义 service worker 逻辑都可以写在这里。
