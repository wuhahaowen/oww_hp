// 这是用于注册 service worker 的可选代码。
// register() 默认情况下不会被调用。

// 这使得应用在生产环境中后续访问时加载更快，并提供
// 离线功能。但是，这也意味着开发者（和用户）
// 只会在页面的后续访问中看到已部署的更新，在所有
// 打开该页面的现有标签页关闭后，因为之前缓存的
// 资源在后台被更新。

// 要了解更多关于此模型的好处和如何选择的说明，
// 请阅读 https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] 是 IPv6 的 localhost 地址。
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 被视为 IPv4 的 localhost。
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // URL 构造函数在所有支持 SW 的浏览器中都可用。
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // 如果 PUBLIC_URL 与我们页面的来源不同，我们的 service worker 将无法工作
      // 这可能发生在使用 CDN 提供资产时; 请参见 https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 这运行在 localhost 上。让我们检查 service worker 是否仍然存在。
        checkValidServiceWorker(swUrl, config);

        // 在 localhost 上添加一些额外的日志，指导开发者查看
        // service worker/PWA 文档。
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // 不是 localhost。直接注册 service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 此时，更新的预缓存内容已被获取，
              // 但是之前的 service worker 仍将提供较旧的
              // 内容，直到所有客户端标签页关闭。
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // 执行更新回调
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // 此时，所有内容都已被预缓存。
              // 这是显示
              // "内容已缓存供离线使用。" 消息的最佳时机。
              console.log('Content is cached for offline use.');

              // 执行成功回调
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // 检查是否能找到 service worker。如果找不到，重新加载页面。
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // 确保 service worker 存在，并且我们确实获得了一个 JS 文件。
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 未找到 service worker。可能是不同的应用。重新加载页面。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 找到 service worker。正常进行。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
