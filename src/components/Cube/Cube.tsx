import { FC } from "react";
import cn from "classnames";
import { CubeColor, CubeFacet } from "@/lib";
import "./cube.scss";

interface Props {
  state?: ReadonlyArray<number>;
}

const Cube: FC<Props> = ({ state = [] }) => {
  return (
    <div className="cube__container">
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
