import {
  TransitionEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CubeMove, ClassNames, MoveToClassName } from "./constants";

enum Stage {
  init,
  stage1,
  stage2,
  stage3,
}

interface State {
  stage: Stage;
  className: ClassNames;
}

export const useMove = (
  container: HTMLElement | null,
  timestamp: number,
  state: ReadonlyArray<number>,
  move?: CubeMove
) => {
  const stage = useRef<State>({ stage: Stage.init, className: ClassNames.L });
  const queue = useRef<CubeMove[]>([]);
  const [cubeState, setCubeState] = useState<ReadonlyArray<number>>(state);

  const handleEndTransition = useCallback<
    TransitionEventHandler<HTMLUListElement>
  >(
    (event) => {
      const target = event.target as HTMLElement;
      if (
        target.hasAttribute("data-facet") &&
        stage.current.stage === Stage.stage3 &&
        container
      ) {
        window.requestAnimationFrame(() => {
          container.classList.remove("cube__list--animate");
          container.classList.remove(stage.current.className);
          stage.current.stage = Stage.init;
        });
        setCubeState(state);
        startAnimation();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, state]
  );

  const makeStage3 = useCallback(() => {
    if (container) {
      container.classList.add("cube__list--animate");
      container.classList.add(stage.current.className);
      stage.current.stage = Stage.stage3;
    }
  }, [container]);

  const makeStage2 = useCallback(() => {
    if (container) {
      container.classList.remove(stage.current.className);
      stage.current.stage = Stage.stage2;
      window.requestAnimationFrame(makeStage3);
    }
  }, [container, makeStage3]);

  const makeStage1 = useCallback(() => {
    if (container) {
      container.classList.add(stage.current.className);
      stage.current.stage = Stage.stage1;
      window.requestAnimationFrame(makeStage2);
    }
  }, [container, makeStage2]);

  const startAnimation = useCallback(() => {
    if (stage.current.stage === Stage.init) {
      const animationType = queue.current.shift();
      if (typeof animationType !== "undefined") {
        stage.current.className = MoveToClassName[animationType];
        makeStage1();
      }
    }
  }, [makeStage1]);

  useEffect(() => {
    if (typeof move !== "undefined") {
      queue.current.push(move);
      startAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp, move]);

  useEffect(() => {
    if (stage.current.stage === Stage.init) {
      setCubeState(state);
    }
  }, [state]);

  return {
    onTransitionEnd: handleEndTransition,
    stage: stage.current,
    cubeState,
  };
};
