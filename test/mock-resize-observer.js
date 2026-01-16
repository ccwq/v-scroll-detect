// Mock ResizeObserver 模拟实现
// 我们需要捕获回调函数，以便在测试中手动触发它
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    ResizeObserver.instances.push(this);
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // 辅助方法：手动触发回调执行
  trigger(entries) {
    this.callback(entries, this);
  }
}

// 存储所有实例，方便在测试中获取
ResizeObserver.instances = [];

export default ResizeObserver;
