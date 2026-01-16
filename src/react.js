import { useEffect } from 'react';
import { createScrollDetector } from './core.js';

/**
 * React Hook: useScrollDetect
 * @param {Object} ref - React ref object pointing to the element
 * @param {Object|String} options - Class names to apply when scroll is detected
 */
export function useScrollDetect(ref, options) {
  useEffect(() => {
    if (!ref.current) return;

    const detector = createScrollDetector(ref.current, options);

    return () => {
      if (detector) {
        detector.destroy();
      }
    };
  }, [ref, options]);
}
