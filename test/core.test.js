import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createScrollDetector } from '../src/core.js';
import MockResizeObserver from './mock-resize-observer.js';

// 设置 Mock 环境
global.ResizeObserver = MockResizeObserver;

// Mock requestAnimationFrame，使其立即执行
global.requestAnimationFrame = (cb) => cb();

describe('createScrollDetector 原生 JS 核心逻辑测试', () => {
  let el;

  beforeEach(() => {
    // 每个测试用例前清空 mock 实例并创建新的元素
    MockResizeObserver.instances = [];
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('应该能正确初始化并执行首次检测', () => {
    // 模拟有滚动
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });

    const detector = createScrollDetector(el, 'test-scroll');
    
    expect(el.classList.contains('test-scroll')).toBe(true);
    expect(MockResizeObserver.instances.length).toBe(1);
    expect(MockResizeObserver.instances[0].elements.has(el)).toBe(true);
  });

  it('当内容变化触发 ResizeObserver 时应该更新类名', () => {
    // 初始无滚动
    Object.defineProperty(el, 'clientHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });

    createScrollDetector(el, 'test-scroll');
    expect(el.classList.contains('test-scroll')).toBe(false);

    // 模拟内容增加导致出现滚动条
    Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
    
    // 触发 ResizeObserver 回调
    MockResizeObserver.instances[0].trigger([]);
    
    expect(el.classList.contains('test-scroll')).toBe(true);
  });

  it('应该支持对象配置模式', () => {
    const detector = createScrollDetector(el, { v: 'v-class', h: 'h-class' });

    // 模拟垂直滚动
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 100, configurable: true });

    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('v-class')).toBe(true);
    expect(el.classList.contains('h-class')).toBe(false);

    // 模拟水平滚动
    Object.defineProperty(el, 'scrollWidth', { value: 200, configurable: true });
    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('h-class')).toBe(true);
  });

  it('调用 destroy 应该断开监听', () => {
    const detector = createScrollDetector(el);
    const observer = MockResizeObserver.instances[0];
    const disconnectSpy = vi.spyOn(observer, 'disconnect');

    detector.destroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('调用 check 应该能手动触发检测', () => {
    const detector = createScrollDetector(el, 'manual-check');
    
    // 初始状态
    expect(el.classList.contains('manual-check')).toBe(false);

    // 模拟有滚动但未触发 observer
    Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

    detector.check();
    expect(el.classList.contains('manual-check')).toBe(true);
  });
});
