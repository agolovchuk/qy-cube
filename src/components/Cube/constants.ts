export enum CubeMove {
  LReverse = 0x1,
  L = 0x2,
  RReverse = 0x3,
  R = 0x4,
  DReverse = 0x5,
  D = 0x6,
  UReverse = 0x7,
  U = 0x8,
  FReverse = 0x9,
  F = 0xa,
  BReverse = 0xb,
  B = 0xc,
}

export enum ClassNames {
  LReverse = "cube__list--l-reverse",
  L = "cube__list--l",
  RReverse = "cube__list--r-reverse",
  R = "cube__list--r",
  DReverse = "cube__list--d-reverse",
  D = "cube__list--d",
  UReverse = "cube__list--u-reverse",
  U = "cube__list--u",
  FReverse = "cube__list--f-reverse",
  F = "cube__list--f",
  BReverse = "cube__list--b-reverse",
  B = "cube__list--b",
}

export const MoveToClassName: Record<CubeMove, ClassNames> = {
  [CubeMove.LReverse]: ClassNames.LReverse,
  [CubeMove.L]: ClassNames.L,
  [CubeMove.RReverse]: ClassNames.RReverse,
  [CubeMove.R]: ClassNames.R,
  [CubeMove.DReverse]: ClassNames.DReverse,
  [CubeMove.D]: ClassNames.D,
  [CubeMove.UReverse]: ClassNames.UReverse,
  [CubeMove.U]: ClassNames.U,
  [CubeMove.FReverse]: ClassNames.FReverse,
  [CubeMove.F]: ClassNames.F,
  [CubeMove.BReverse]: ClassNames.BReverse,
  [CubeMove.B]: ClassNames.B,
};
