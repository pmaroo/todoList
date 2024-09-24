import "styled-components";
import { DefaultTheme } from "styled-components";

// module이란 ?
// import 또는 export가 있는 파일은 모듈(Module)로 취급이 된다
// typescript 컴파일러가 모듈 로더를 통해 실제로 불러오는건 오로지 타입 정보뿐 그 외 정보 X
// 변수,상수,함수,클래스 : JS 모듈 로더 코드로 컴파일
// namespace : JS 일반객체로 컴파일, 기본적으로 namespace 외부에서 namespace 내부를 볼수 없음으로 외부에서도 접근이 가능하도록 만들고 싶으면 export 사용

// namespace란 ?
// typescript에서 코드를 구성하는 이름 충돌을 방지하고 구조화할 수 있는 기능을 제공
// namespace는 모듈을 나누는데 사용될 수 있지만 대체로 권장하지 않음
// 왜 ?
// 모듈 시스템을 사용하는 것보다 불편하고 복잡하기 때문에
// namespace를 사용하면 전역 네임스페이스에서 모든것을 정의하게 되므로 코드의 결합도가 높아지고 이름 충돌 발생 가능성도 높아진다
// 결론 : 이름 충돌 방지를 위해서 사용하지만 네임스페이스의 이름에서 충돌이 발생할 가능성 UP, 코드 구조화로 인해 가독성과 유지보수성이 향상되지만 불필요한 중첩으로 인해 코드 복잡, 가독성 저하
// 결국에는 사용하지 않는게 더 낫다는 판단

// declare란 ?
// 선언을 하다 라는 뜻을 지님
// typescript 컴파일러는 전역변수를 인식하지 못함 (7번째줄 : 실제로 불러오는건 오로지 타입 정보뿐)
// 따라서, 이를 해결하는 방법은 declare를 통해서 선언한 전역변수
// typescript 컴파일러가 declare를 통해 선언한 전역변수는 인식할 수 있음
// declare는 typescript 컴파일러에게 이미 정의되어 있는 타입이라고 알려주는 것

// d.ts 파일이란 ?
// declare typescript의 약자로 타입 선언 파일

// declare module로 styled-components에 대한 전역변수를 typescripts 컴파일러가 알게하도록 선언
// declare module "styled-components" {
//   export interface DefaultTheme {
//     textColor: string;
//     bgColor: string;
//     accentColor: string;
//   }
// }

const colors = {
  black: "#000000",
  white: "#ffffff",
  red: "#FF0000",
  basic: "#0D2137",
  point: "#FF8E2B",
  lightBlue: "#E0EAF5",
  blue: "#2E77AE",
  lightGrey: "#E5E5E5",
  grey: "#909090",
  darkGrey: "#444444",
};

// const sizes = {
//   size16: "16px",
//   size18: "18px",
//   size20: "20px",
//   size24: "24px",
//   size28: "28px",
//   size32: "32px",
//   size40: "40px",
//   size48: "48px",
//   size60: "60px",
//   size200: "200px",
//   full: "100%",
// };

// const fontWeight = {
//   regular: 400,
//   bold: 700,
// };

const flex = {
  base: `display: flex`,
  rowCenter: `
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  columnCenter: `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  rowSpaceBetween: `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  rowStart: `
  display : flex;
  flex-direction: row;
  justify-content : flex-start;
  align-items : center;
  `,
  rowEnd: `
  display : flex;
  flex-direction: row;
  justify-content : flex-end;
  align-items : center;
  `,
  columnStart: `
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : flex-start;
  `,
  columnEnd: `
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : flex-end;
  `,
  columnSpaceBetween: `
  display : flex;
  flex-direction: column;
  justify-content : space-between;
  align-items : center;
  `,
};

// export const cursors = {
//   pointer: "cursor: pointer",
// };

export type ColorsType = typeof colors;
// export type FontWeightType = typeof fontWeight;
// export type SizeType = typeof sizes;
export type FlexType = typeof flex;
// export type CursorType = typeof cursors;

export const theme: DefaultTheme = {
  colors,
  // fontWeight,
  // sizes,
  flex,
  // cursors,
};
