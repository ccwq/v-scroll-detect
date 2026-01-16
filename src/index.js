/**
 * Vue Directive: v-scroll-detect
 * Function: Automatically detects if an element has scrollbars and dynamically binds a Class.
 * 功能: 自动检测元素是否出现滚动条，并动态绑定 Class
 */
export const vScrollDetect = {
  mounted(el, binding) {
    // Get user custom class name, default is 'is-scrollable'
    // 获取用户自定义的类名，默认为 'is-scrollable'
    const className = binding.value || 'is-scrollable';

    // Define detection logic
    // 定义检测逻辑
    const checkScroll = () => {
      // Check vertical scroll: content height > visible height
      // 判断垂直滚动条: 内容高度 > 可见高度
      // Check horizontal scroll: content width > visible width
      // 判断水平滚动条: 内容宽度 > 可见宽度
      const hasVerticalScroll = el.scrollHeight > el.clientHeight;
      const hasHorizontalScroll = el.scrollWidth > el.clientWidth;
      
      // If className is an object, handle vertical/horizontal separately
      // 如果 className 是对象，分别处理横向和纵向
      if (typeof className === 'object') {
          const vClass = className.v || className.vertical || 'has-v-scroll';
          const hClass = className.h || className.horizontal || 'has-h-scroll';
          
          if (hasVerticalScroll) el.classList.add(vClass);
          else el.classList.remove(vClass);
          
          if (hasHorizontalScroll) el.classList.add(hClass);
          else el.classList.remove(hClass);
      } else {
          // Standard string class name behavior
          // 标准字符串类名行为
          if (hasVerticalScroll || hasHorizontalScroll) {
            el.classList.add(className);
          } else {
            el.classList.remove(className);
          }
      }
    };

    // Use ResizeObserver to listen for element and content size changes
    // 使用 ResizeObserver 监听元素及其内容大小变化
    const observer = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded" error
      // 使用 requestAnimationFrame 避免 "ResizeObserver loop limit exceeded" 错误
      window.requestAnimationFrame(checkScroll);
    });

    observer.observe(el);
    // Attach observer to element for cleanup
    // 将 observer 挂载到元素上，方便卸载时清理
    el._scrollObserver = observer;
    
    // Initial check
    // 初始化执行一次
    checkScroll();
  },

  unmounted(el) {
    // Clean up resources to prevent memory leaks
    // 释放资源，防止内存泄漏
    if (el._scrollObserver) {
      el._scrollObserver.disconnect();
      delete el._scrollObserver;
    }
  }
};

// Default export for global installation
// 默认导出用于全局安装
export default {
  install: (app) => {
    app.directive('scroll-detect', vScrollDetect);
  }
};
