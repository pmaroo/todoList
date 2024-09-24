import styled from "styled-components";

export const WholeWrapper = styled.section`
  ${({ theme }) => theme.flex.rowSpaceBetween};
  height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.basic};
  padding: 10px;
`;

export const CreateInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 10px;
  background: none;
  border: none;
`;

// 카테고리
export const CateWholeWrapper = styled.div`
  ${({ theme }) => theme.flex.columnSpaceBetween};
  width: 14%;
  background: ${({ theme }) => theme.colors.basic};
  height: 100%;
  padding: 20px;
`;

// 변수명을 react에서 속성으로 받아들일 수 있다는 경고문 (isActive)
// 해결 : $isActive로 변경
export const CateWrapper = styled.div<{
  $isActive: boolean;
}>`
  ${({ theme }) => theme.flex.columnStart};
  width: 100%;
  height: auto;
  padding: 15px;
  margin: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  cursor: pointer;
  z-index: 2;

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.blue};
    z-index: -1;
    border-radius: 50px;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transition: 0.3s;
    background: ${({ theme }) => theme.colors.basic};
    z-index: -1;
  }

  &:hover {
    &:after {
      width: 0%;
    }
  }

  /* && 보다는 삼항연산자를 이용 */
  ${(props) =>
    props.$isActive
      ? `
    &:after {
        width: 0%;
    }
  `
      : ``};
`;

export const Btn = styled.button`
  ${({ theme }) => theme.flex.columnStart};
  background: ${({ theme }) => theme.colors.lightBlue};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.lightBlue};
  padding: 15px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.basic};
    color: ${({ theme }) => theme.colors.white};
  }
`;

// 테스크
export const TaskWholeWrapper = styled.div`
  ${({ theme }) => theme.flex.columnCenter};
  width: 85%;
  background: ${({ theme }) => theme.colors.white};
  height: 100%;
  border-radius: 20px;
  /* 문제점 : 2중선언 해야하는 코드중첩 */
  justify-content: flex-start;
  padding: 20px;
`;

export const TaskWrapper = styled.div<{
  width: string;
}>`
  ${({ theme }) => theme.flex.rowSpaceBetween};
  width: ${(props) => props.width};
  padding: 20px;
  /* 이중선언 */
  align-items: flex-start;
`;

export const TaskDeleteBtn = styled.button`
  ${({ theme }) => theme.flex.columnCenter};
  border: none;
  cursor: pointer;
  background: none;
  font-size: 13px;
  transition: 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.red};
  }
`;

export const TaskIngWrapper = styled.div`
  ${({ theme }) => theme.flex.columnStart};
  width: 50%;
  padding: 0 20px;
`;

export const TaskTitleWrapper = styled.div`
  ${({ theme }) => theme.flex.columnStart};
  border-radius: 50px;
  background: ${({ theme }) => theme.colors.basic};
  color: ${({ theme }) => theme.colors.white};
  padding: 10px 20px;
  width: 200px;
  margin: 20px 0;
`;

export const Task = styled.div<{ $isActive: boolean }>`
  ${({ theme }) => theme.flex.rowStart};
  width: 100%;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: 50px;
  margin: 0 0 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.lightBlue};
  }

  ${(props) =>
    props.$isActive
      ? `
    background: ${props.theme.colors.lightBlue};
    
  `
      : ``}
`;

export const TaskCheckInput = styled.input`
  width: 18px;
  height: 18px;
  margin: 0 10px 0 0;
  cursor: pointer;
`;

export const FinishText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.darkGrey};
  text-decoration: line-through;
`;

export const TaskDetailWrapper = styled.div``;
