import * as components from "./components";

export const legosComponents: { [legoId: string]: React.ElementType } = {
  "ai-01": components.Ai01,
  "ai-02": components.Ai02,
  "ai-03": components.Ai03,
  "ai-04": components.Ai04,
  "ai-05": components.Ai05,

  "flow-01": components.Flow01,
  "flow-02": components.Flow02,

  "grid-01": components.Grid01,
  "grid-02": components.Grid02,
  "grid-03": components.Grid03,
  "grid-04": components.Grid04,
  "grid-05": components.Grid05,

  "versatile-01": components.Versatile01,
  "versatile-02": components.Versatile02,
};
