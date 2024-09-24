import "styled-components";
import {
  ColorsType,
  CursorType,
  FlexType,
  FontWeightType,
  SizeType,
} from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsType;
    // fontWeight: FontWeightType;
    // sizes: SizeType;
    flex: FlexType;
    // cursors: CursorType;
  }
}
