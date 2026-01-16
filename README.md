# v-scroll-detect

[English](#english) | [中文](#中文)

<a name="english"></a>

## English

A Vue directive based on `ResizeObserver` that automatically detects changes in element content and adds/removes CSS classes when vertical or horizontal scrollbars appear.

### Features
- **Auto Response**: Listens not only to window resizing but also to internal content changes (e.g., async data loading).
- **Performance Optimized**: Uses `ResizeObserver` combined with `requestAnimationFrame`, more efficient than traditional `onscroll` or timer polling.
- **Highly Decoupled**: Can be reused on any container without writing complex DOM logic in components.
- **Modern Compatibility**: Supports all modern browsers (Chrome 64+, Firefox 69+, Safari 13.1+, Edge 79+).

### Installation

```bash
npm install v-scroll-detect
```

### Usage

#### Global Registration

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import vScrollDetect from 'v-scroll-detect';

const app = createApp(App);
app.use(vScrollDetect);
app.mount('#app');
```

Use in template:

```html
<div v-scroll-detect="'has-scroll'">
  <!-- content -->
</div>
```

#### Local Registration

```javascript
import { vScrollDetect } from 'v-scroll-detect';

export default {
  directives: {
    scrollDetect: vScrollDetect
  }
}
```

Or with `<script setup>`:

```html
<script setup>
import { vScrollDetect } from 'v-scroll-detect';
</script>

<template>
  <div v-scroll-detect>
    <!-- content -->
  </div>
</template>
```

### Options

1. **String (Simple Mode)**
   Pass a class name string. It will be added when *any* scrollbar appears.
   
   ```html
   <div v-scroll-detect="'is-scrollable'">...</div>
   ```

2. **Object (Advanced Mode)**
   Pass an object to distinguish between vertical and horizontal scrollbars.
   
   ```html
   <div v-scroll-detect="{ v: 'has-v-scroll', h: 'has-h-scroll' }">...</div>
   ```
   
   - `v` or `vertical`: Class for vertical scrollbar.
   - `h` or `horizontal`: Class for horizontal scrollbar.

---

<a name="中文"></a>

## 中文

这是一个基于 `ResizeObserver` 封装的 Vue 指令。它能实时监听元素内容的变化，并在垂直或水平滚动条出现时，自动为该元素添加或移除指定的 CSS 类。

### 技术优势
- **自动响应**：不仅监听窗口大小，还能监听内部内容（如异步加载数据后）的变化。
- **性能优化**：通过 `ResizeObserver` 配合 `requestAnimationFrame`，比传统的 `onscroll` 或定时器检测更省 CPU。
- **高度解耦**：作为指令，可以复用到任何容器上，无需在业务组件里写复杂的 DOM 逻辑。
- **2026 兼容性**：`ResizeObserver` 已在所有主流浏览器中得到完美支持。

### 安装

```bash
npm install v-scroll-detect
```

### 使用方法

#### 全局注册

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import vScrollDetect from 'v-scroll-detect';

const app = createApp(App);
app.use(vScrollDetect); // 默认指令名为 v-scroll-detect
app.mount('#app');
```

在模板中使用：

```html
<div v-scroll-detect="'has-scroll'">
  <!-- 内容 -->
</div>
```

#### 局部注册

```javascript
import { vScrollDetect } from 'v-scroll-detect';

export default {
  directives: {
    scrollDetect: vScrollDetect
  }
}
```

或者在 `<script setup>` 中：

```html
<script setup>
import { vScrollDetect } from 'v-scroll-detect';
</script>

<template>
  <div v-scroll-detect>
    <!-- 内容 -->
  </div>
</template>
```

### 配置选项

1. **字符串 (简单模式)**
   传入一个类名字符串。当出现*任意*滚动条时，该类名会被添加。
   
   ```html
   <div v-scroll-detect="'is-scrollable'">...</div>
   ```

2. **对象 (进阶模式)**
   传入一个对象，区分横向和纵向滚动条。
   
   ```html
   <div v-scroll-detect="{ v: 'has-v-scroll', h: 'has-h-scroll' }">...</div>
   ```
   
   - `v` or `vertical`: 垂直滚动条出现的类名。
   - `h` or `horizontal`: 水平滚动条出现的类名。
