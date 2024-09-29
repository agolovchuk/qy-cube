import { FC, MouseEventHandler, useCallback, useRef } from "react";
import cn from "classnames";
import { CubeColor, CubeFacet } from "@/lib";
import "./cube.scss";

interface Props {
  state?: ReadonlyArray<number>;
  className?: string;
  lastMove?: number;
}

type EventHandler = (event: MouseEvent) => void;

// TODO: Update rotation function
function getRotationParams(
  position: [number, number, number, number, number, number]
): [string, string] {
  const deltaX = position[2] - position[0];
  const deltaY = position[3] - position[1];

  const sensitivity = 0.8;
  position[4] += deltaY * sensitivity;
  position[5] += deltaX * sensitivity;

  return [position[4].toFixed(1), position[5].toFixed(1)];
}

const Cube: FC<Props> = ({ state = [], className }) => {
  const position = useRef<[number, number, number, number, number, number]>([
    0, 0, 0, 0, 0, 0,
  ]);

  const container = useRef<HTMLDivElement>(null);

  const updateParams = useCallback(() => {
    if (container.current) {
      const [rotateX, rotateY] = getRotationParams(position.current);
      container.current.style.setProperty("--rotate-x", `${rotateX}deg`);
      container.current.style.setProperty("--rotate-y", `${rotateY}deg`);
      position.current[0] = position.current[2];
      position.current[1] = position.current[3];
    }
  }, []);

  const mouseMoveHandler = useCallback<EventHandler>(
    (event) => {
      position.current[2] = event.clientX;
      position.current[3] = event.clientY;
      window.requestAnimationFrame(updateParams);
    },
    [updateParams]
  );

  const mouseUpHandler = useCallback<EventHandler>(() => {
    console.log("Mouse UP");
    document.body.removeEventListener("mousemove", mouseMoveHandler);
    document.body.removeEventListener("mouseup", mouseUpHandler);
  }, [mouseMoveHandler]);

  const mouseDownHandler = useCallback<MouseEventHandler>(
    (event) => {
      position.current = [event.clientX, event.clientY, 0, 0, 0, 0];
      document.body.addEventListener("mousemove", mouseMoveHandler, false);
      document.body.addEventListener("mouseup", mouseUpHandler, false);
    },
    [mouseMoveHandler, mouseUpHandler]
  );

  return (
    <div
      ref={container}
      className={cn("cube__container", className)}
      onMouseDown={mouseDownHandler}
    >
      <ul className="cube__list">
        {state.map((e, i) => (
          <li
            data-facet={CubeFacet[Math.floor(i / 9)]}
            className={cn("cube__item", `cube__item--${CubeColor[e]}`)}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
};

export default Cube;
