import { Directive, App } from 'vue';

export type ScrollDetectOptions = string | {
  v?: string;
  vertical?: string;
  h?: string;
  horizontal?: string;
};

export declare const vScrollDetect: Directive<HTMLElement, ScrollDetectOptions | void>;

declare const _default: {
  install: (app: App) => void;
};

export default _default;
