import { FC } from "react";
import { CubeMove } from "@/domain";
import "./moves.scss";

interface Props {
  moves: ReadonlyArray<CubeMove>;
}

const Moves: FC<Props> = ({ moves }) => {
  return (
    <ul className="moves">
      {moves.map((m, i) => (
        <li className="moves__item" key={CubeMove[m] + i}>
          {CubeMove[m]}
        </li>
      ))}
    </ul>
  );
};

export default Moves;
