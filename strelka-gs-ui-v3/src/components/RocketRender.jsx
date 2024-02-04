import { useCallback, useEffect } from "react";
import { mount, renderer } from "./3d";
import "./RocketRender.css";
import { useSystemState } from "../hooks/systemState";

const quaternionToEuler = (quaternion) => {
  const { x, y, z, w } = quaternion;

  const t0 = 2.0 * (w * x + y * z);
  const t1 = 1.0 - 2.0 * (x * x + y * y);
  const roll = Math.atan2(t0, t1);

  const t2 = 2.0 * (w * y - z * x);
  const pitch = Math.asin(Math.min(Math.max(t2, -1.0), 1.0));

  const t3 = 2.0 * (w * z + x * y);
  const t4 = 1.0 - 2.0 * (y * y + z * z);
  const yaw = Math.atan2(t3, t4);

  return {
    yaw: (yaw * 180.0) / Math.PI,
    pitch: (pitch * 180.0) / Math.PI,
    roll: (roll * 180.0) / Math.PI,
  };
};

export default function RocketRender() {
  const containerRef = useCallback(mount, []);
  const { systemState, updateSystemState } = useSystemState();

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

  const euler = quaternionToEuler({
    x: systemState.quaternion_q2,
    y: systemState.quaternion_q3,
    z: systemState.quaternion_q4,
    w: systemState.quaternion_q1,
  });

  return (
    <div>
      <p className="ml-6 mt-4 flex-shrink-0 flex-grow-0 mr-4 font-normal dark:text-gray-400">
        Yaw, Pitch, Roll = {euler.yaw.toFixed(2)}, {euler.pitch.toFixed(2)},{" "}
        {euler.roll.toFixed(2)}
      </p>
      <div className="Cube-container" ref={containerRef}></div>
    </div>
  );
}
