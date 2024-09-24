import styled from "styled-components";

// 공용
export const Text = styled.p<{
  color?: string;
  // optional 변수 ?: type
  fontSize: string;
  fontWeight: string;
}>`
  width: auto;
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  font-weight: ${(props) => props.fontWeight};
`;

export const Wrapper = styled.div<{
  width: string;
  $flex: {};
  maxheight?: string;
  height?: string;
  ju?: string;
}>`
  width: ${(props) => props.width};
  /* 중복선언문제 발생 */
  display: flex;
  justify-content: ${(props) => (props.ju ? props.ju : props.$flex)};
  align-items: ${(props) => props.$flex};
  flex-direction: ${(props) => props.$flex};
  max-height: ${(props) => props.maxheight};
  height: ${(props) => props.height};
  overflow: auto;
`;
