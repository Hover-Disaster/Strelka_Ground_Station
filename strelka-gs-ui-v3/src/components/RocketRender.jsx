import { useCallback, useEffect } from "react";
import { mount, renderer } from "./3d";
import "./RocketRender.css";

export default function RocketRender() {
  const containerRef = useCallback(mount, []);

  // useEffect for cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup when component is unmounted
      const container = containerRef.current;
      if (container) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [containerRef]);

  return <div className="Cube-container" ref={containerRef}></div>;
}
