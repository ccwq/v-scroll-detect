import { createScrollDetector } from './core.js';

export { createScrollDetector };

/**
 * Vue Directive: v-scroll-detect
 * Function: Automatically detects if an element has scrollbars and dynamically binds a Class.
 * 功能: 自动检测元素是否出现滚动条，并动态绑定 Class
 */
export const vScrollDetect = {
  mounted(el, binding) {
    // Use core logic to create detector (which is a ResizeObserver with extra methods)
    const observer = createScrollDetector(el, binding.value);
    
    // Attach observer to element for cleanup
    el._scrollObserver = observer;
  },

  unmounted(el) {
    // Clean up resources to prevent memory leaks
    if (el._scrollObserver) {
      el._scrollObserver.destroy();
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
