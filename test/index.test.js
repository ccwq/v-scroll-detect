import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { vScrollDetect } from '../src/index.js';
import MockResizeObserver from './mock-resize-observer.js';
import vScrollDetectPlugin from '../src/index.js';

// 设置 Mock 环境
global.ResizeObserver = MockResizeObserver;

// Mock requestAnimationFrame，使其立即执行
global.requestAnimationFrame = (cb) => cb();

describe('v-scroll-detect 指令测试', () => {
  beforeEach(() => {
    // 每个测试用例前清空 mock 实例
    MockResizeObserver.instances = [];
  });

  it('应该能通过 app.use 全局安装', () => {
    const app = {
      directive: vi.fn(),
    };
    vScrollDetectPlugin.install(app);
    expect(app.directive).toHaveBeenCalledWith('scroll-detect', vScrollDetect);
  });

  it('挂载时应该初始化 ResizeObserver', () => {
    const wrapper = mount({
      template: '<div v-scroll-detect></div>',
      directives: {
        scrollDetect: vScrollDetect,
      },
    });

    const el = wrapper.element;
    expect(el._scrollObserver).toBeDefined();
    expect(MockResizeObserver.instances.length).toBe(1);
    expect(MockResizeObserver.instances[0].elements.has(el)).toBe(true);
  });

  it('卸载时应该断开 ResizeObserver 连接', () => {
    const wrapper = mount({
      template: '<div v-scroll-detect></div>',
      directives: {
        scrollDetect: vScrollDetect,
      },
    });

    const el = wrapper.element;
    const observer = el._scrollObserver;
    const disconnectSpy = vi.spyOn(observer, 'disconnect');

    wrapper.unmount();
    expect(disconnectSpy).toHaveBeenCalled();
    expect(el._scrollObserver).toBeUndefined();
  });

  it('在不传递任何参数时应使用默认类名', async () => {
    const wrapper = mount({
      template: '<div v-scroll-detect></div>',
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 模拟滚动
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });

    // 触发回调
    MockResizeObserver.instances[0].trigger([]);

    expect(el.classList.contains('is-scrollable')).toBe(true);
  });

  it('当存在滚动条时应该添加默认类名', async () => {
    const wrapper = mount({
      template: '<div v-scroll-detect style="height: 100px; overflow: auto;"></div>',
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 模拟垂直滚动条：内容高度(200) > 容器高度(100)
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    
    // 手动触发 ResizeObserver 回调
    MockResizeObserver.instances[0].trigger([]);
    
    // 检查是否添加了默认类名 'is-scrollable'
    expect(el.classList.contains('is-scrollable')).toBe(true);
  });

  it('当没有滚动条时应该移除类名', async () => {
    const wrapper = mount({
      template: '<div v-scroll-detect class="is-scrollable"></div>',
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 模拟无滚动：容器高度(200) > 内容高度(100)
    Object.defineProperty(el, 'clientHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });

    // 触发回调
    MockResizeObserver.instances[0].trigger([]);

    expect(el.classList.contains('is-scrollable')).toBe(false);
  });

  it('应该支持自定义字符串类名', async () => {
    const wrapper = mount({
      template: '<div v-scroll-detect="\'custom-scroll\'"></div>',
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 模拟滚动
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });

    // 触发回调
    MockResizeObserver.instances[0].trigger([]);

    expect(el.classList.contains('custom-scroll')).toBe(true);
  });

  it('应该支持对象配置，分别处理横向/纵向滚动条', async () => {
    const wrapper = mount({
      template: `<div v-scroll-detect="{ v: 'v-scroll', h: 'h-scroll' }"></div>`,
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 模拟仅有垂直滚动
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 100, configurable: true });

    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('v-scroll')).toBe(true);
    expect(el.classList.contains('h-scroll')).toBe(false);

    // 模拟同时存在垂直和水平滚动
    Object.defineProperty(el, 'scrollWidth', { value: 200, configurable: true });
    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('v-scroll')).toBe(true);
    expect(el.classList.contains('h-scroll')).toBe(true);
  });

  it('应该支持对象配置的长属性名 (vertical/horizontal)', async () => {
    const wrapper = mount({
      template: `<div v-scroll-detect="{ vertical: 'custom-v', horizontal: 'custom-h' }"></div>`,
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 200, configurable: true });

    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('custom-v')).toBe(true);
    expect(el.classList.contains('custom-h')).toBe(true);
  });

  it('当使用对象配置且滚动消失时，应正确移除自定义类名', async () => {
    const wrapper = mount({
      template: `<div v-scroll-detect="{ v: 'v-scroll' }"></div>`,
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 1. 先模拟有滚动
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('v-scroll')).toBe(true);

    // 2. 模拟滚动消失
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
    MockResizeObserver.instances[0].trigger([]);
    expect(el.classList.contains('v-scroll')).toBe(false);
  });

  it('当对象配置部分缺失时，应使用插件内置的辅助类名', async () => {
    const wrapper = mount({
      template: `<div v-scroll-detect="{ v: 'custom-v' }"></div>`, // 未定义 h
      directives: {
        scrollDetect: vScrollDetect,
      },
    });
    const el = wrapper.element;

    // 模拟横向滚动
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 200, configurable: true });

    MockResizeObserver.instances[0].trigger([]);
    // 应使用代码中硬编码的默认值 'has-h-scroll'
    expect(el.classList.contains('has-h-scroll')).toBe(true);
  });
});
