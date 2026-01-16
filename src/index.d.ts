import { Directive, App } from 'vue';
import { Ref } from 'react';

export type ScrollDetectOptions = string | {
  v?: string;
  vertical?: string;
  h?: string;
  horizontal?: string;
};

export interface ScrollDetector extends ResizeObserver {
  destroy(): void;
  check(): void;
}

/**
 * Core Logic: Create a scroll detector for an element
 */
export function createScrollDetector(el: HTMLElement, options?: ScrollDetectOptions): ScrollDetector;

/**
 * React Hook: useScrollDetect
 */
export function useScrollDetect(ref: Ref<HTMLElement | null>, options?: ScrollDetectOptions): void;

/**
 * Vue Directive: v-scroll-detect
 */
export declare const vScrollDetect: Directive<HTMLElement, ScrollDetectOptions | void>;

declare const _default: {
  install: (app: App) => void;
};

export default _default;
