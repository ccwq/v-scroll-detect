/**
 * Core Logic: Scroll Detector
 * This module is framework-agnostic and can be used in Vanilla JS, Vue, React, etc.
 */

export function createScrollDetector(el, options = 'with-scroll') {
  if (!el) return null;

  const className = options || 'with-scroll';

  // Define detection logic
  const checkScroll = () => {
    const hasVerticalScroll = el.scrollHeight > el.clientHeight;
    const hasHorizontalScroll = el.scrollWidth > el.clientWidth;

    if (typeof className === 'object') {
      const vClass = className.v || className.vertical || 'has-v-scroll';
      const hClass = className.h || className.horizontal || 'has-h-scroll';

      if (hasVerticalScroll) el.classList.add(vClass);
      else el.classList.remove(vClass);

      if (hasHorizontalScroll) el.classList.add(hClass);
      else el.classList.remove(hClass);
    } else {
      if (hasVerticalScroll || hasHorizontalScroll) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    }
  };

  // Use ResizeObserver to listen for element and content size changes
  const observer = new ResizeObserver(() => {
    window.requestAnimationFrame(checkScroll);
  });

  observer.observe(el);

  // Initial check
  checkScroll();

  // Add helper methods to observer for easier use and compatibility
  observer.destroy = () => observer.disconnect();
  observer.check = checkScroll;

  return observer;
}
