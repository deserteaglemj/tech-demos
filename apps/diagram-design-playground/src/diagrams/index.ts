import type { ComponentType } from "react";
import type { DiagramId } from "../lib/types";
import type { DiagramProps } from "./primitives";
import { Architecture } from "./Architecture";
import { Flowchart } from "./Flowchart";
import { Loop } from "./Loop";
import { Pyramid } from "./Pyramid";
import { Quadrant } from "./Quadrant";
import { Sequence } from "./Sequence";

export const DIAGRAM_COMPONENTS: Record<
  DiagramId,
  ComponentType<DiagramProps>
> = {
  architecture: Architecture,
  loop: Loop,
  flowchart: Flowchart,
  sequence: Sequence,
  quadrant: Quadrant,
  pyramid: Pyramid,
};
