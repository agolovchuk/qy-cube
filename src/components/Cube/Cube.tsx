import { FC, MouseEventHandler, useCallback, useRef } from "react";
import cn from "classnames";
import { CubeColor, CubeFacet } from "@/lib";
import { CubeMove } from "./constants";
import { getRotationParams } from "./helpers";
import { useMove } from "./useMove";
import "./cube.scss";

interface Props {
  state?: ReadonlyArray<number>;
  className?: string;
  lastMove?: CubeMove;
  timestamp: number;
}

type EventHandler = (event: MouseEvent) => void;

const Cube: FC<Props> = ({ state = [], timestamp, className, lastMove }) => {
  const listContainer = useRef(null);
  const position = useRef<[number, number, number, number, number, number]>([
    0, 0, 0, 0, 0, 0,
  ]);

  const { onTransitionEnd, cubeState } = useMove(
    listContainer.current,
    timestamp,
    state,
    lastMove
  );

  const container = useRef<HTMLDivElement>(null);
  const root = useRef(document.getElementById("root"));

  const updateParams = useCallback(() => {
    if (container.current) {
      const [rotateX, rotateY] = getRotationParams(position.current);
      container.current.style.setProperty("--rotate-x", `${rotateX}deg`);
      container.current.style.setProperty("--rotate-y", `${rotateY}deg`);
      position.current[0] = position.current[2];
      position.current[1] = position.current[3];
    }
  }, []);

  const moveHandler = useCallback(
    (x: number, y: number) => {
      position.current[2] = x;
      position.current[3] = y;
      window.requestAnimationFrame(updateParams);
    },
    [updateParams]
  );

  const mouseMoveHandler = useCallback<EventHandler>(
    (event) => {
      moveHandler(event.clientX, event.clientY);
    },
    [moveHandler]
  );

  const mouseUpHandler = useCallback<EventHandler>(
    (event) => {
      moveHandler(event.clientX, event.clientY);
      if (root.current) {
        root.current.removeEventListener("mousemove", mouseMoveHandler);
        root.current.removeEventListener("mouseup", mouseUpHandler);
      }
    },
    [mouseMoveHandler, moveHandler]
  );

  const mouseDownHandler = useCallback<MouseEventHandler>(
    (event) => {
      position.current[0] = event.clientX;
      position.current[1] = event.clientY;
      if (root.current) {
        root.current.addEventListener("mousemove", mouseMoveHandler, false);
        root.current.addEventListener("mouseup", mouseUpHandler, false);
      }
    },
    [mouseMoveHandler, mouseUpHandler]
  );

  return (
    <div
      ref={container}
      className={cn("cube__container", className)}
      onMouseDown={mouseDownHandler}
    >
      <ul
        className="cube__list"
        ref={listContainer}
        onTransitionEndCapture={onTransitionEnd}
      >
        {cubeState.map((e, i) => (
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
