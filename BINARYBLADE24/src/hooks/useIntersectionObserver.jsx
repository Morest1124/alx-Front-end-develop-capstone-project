import { useEffect, useState, useRef } from 'react';

/**
 * A custom hook that uses the Intersection Observer API to detect when an element is visible in the viewport.
 * @param {object} options 
 * @returns {[React.RefObject, boolean]} - A tuple containing the ref to attach to the element and a boolean indicating if the element is intersecting.
 */
export const useIntersectionObserver = (options) => {
  const elementRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    const observer = new IntersectionObserver(([entry]) => {
      // When the element is intersecting update the state
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        //For the animation to happen once
        observer.unobserve(element);
      }
    }, options);

    if (element) {
      observer.observe(element);
    }

    // A cleanup function that runs when the component unmounts
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isIntersecting];
};