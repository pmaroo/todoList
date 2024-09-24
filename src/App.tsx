import { useCallback, useEffect, useRef, useState } from "react";
import {
  Btn,
  CateWholeWrapper,
  CateWrapper,
  CreateInput,
  FinishText,
  Task,
  TaskCheckInput,
  TaskDeleteBtn,
  TaskIngWrapper,
  TaskTitleWrapper,
  TaskWholeWrapper,
  TaskWrapper,
  WholeWrapper,
} from "./styles/AppStyle";
import { theme } from "./styles/theme";
import { Text, Wrapper } from "./styles/CommonComponents";

type TData = {
  title: string;
  id: number;
};

// typescript와 styled-components는 부적합 (기존 "styled-components": "6.1.13")
// styled-components의 props를 전부 type을 지정해줘야하며 쓰지 않을 수도 있는 props들을 전부 넘겨줘야함
// 결국 이렇게 된다면 styled-components의 자유롭게 가져다쓸수있는 요소들을 활용하지 못해서 모든 css를 만들어줘야하기에 부적합
// 해결방안 : "@types/styled-components": "5.1.34" 사용
// 문제점
// 해결방안을 진행해도 사용법은 크게 다르지 않고 flexType으로 인한 몇줄만 줄어든 느낌
// 오히려 가독성이 안좋은 문제 발생 가능성이 있음
// tailwindCSS와 유사하게 사용되는 느낌
// colors와 flex만 가독성 및 코드간결화에 도움되고 나머지는 불필요한 느낌

// App.tsx에서 CSS소스코드 작성시 가독성이 좋지 않아 components로 분리
// 의문점 : typescript에서는 style의 props들의 type을 다 정의해줘야하는데
// 그렇게 된다면 각 파일별로 css파일을 나누어서 사용하는지
// 공용 컴포넌트로 css를 사용할 수 있는 방안은 없는것인지
// 정의한 props는 쓰이지 않을 수 있는데 그렇게 된다면 빨간줄이 나타남

// type style = {
//   display: string;
//   dr: string;
//   fontSize: string;
//   width: string;
//   height: string;
//   border: string;
//   ju: string;
//   al: string;
//   padding: string;
//   margin: string;
//   bgColor: string;
// };

// const Wrapper = styled.div<style>`
//   display: ${(props) => props.display || `flex`};
//   flex-direction: ${(props) => props.dr || `column`};
//   font-size: ${(props) => props.fontSize || `16px`};
//   width: ${(props) => props.width || `100%`};
//   height: ${(props) => props.height || `auto`};
//   border: ${(props) => props.border};
//   justify-content: ${(props) => props.ju};
//   align-items: ${(props) => props.al};
//   padding: ${(props) => props.padding};
//   margin: ${(props) => props.margin};
//   background: ${(props) => props.bgColor};
// `;

function App() {
  // style 정리, 함수분리, components분리

  // 1. datum 배열 생성
  // 2. CRUD (카테고리)
  // 3. sesstion 저장 후 불러오기
  // const datum = []; // DB
  const [datum, setDatum] = useState<TData[]>([]); // DB
  const [createDatum, setCreateDatum] = useState<TData[]>([]); // 엔터를 누르기 전까지는 input, []인이유는 create 여러개
  const [createInput, setCreateInput] = useState<string>(""); // createInput
  const [createFlag, setCreateFlag] = useState<boolean>(false); // false : 추가버튼이 보이도록 true : 추가버튼이 보이지 않도록
  const createInputRef = useRef<HTMLInputElement>(null);

  const [categoryPk, setCategoryPk] = useState<number>(1); // 카테고리 고유값
  const [taskPk, setTaskPk] = useState<number>(1); // 테스크 고유값

  // 삭제하기
  const deleteHandler = useCallback(
    (idx: number) => {
      if (window.confirm("삭제하시겠습니까?")) {
        // DB삭제하기
        let data = datum ? datum.map((value) => value) : [];

        data.splice(idx, 1); // idx 1개만 삭제
        setDatum(data);
      } else {
        // 취소
      }
    },
    [datum]
  );

  // 실제DB 저장하기
  const dbCreateHandler = useCallback(
    (data: { title: string; id: number }) => {
      let result = datum ? datum.map((value) => value) : [];

      result.push({
        title: data.title,
        id: data.id,
      });

      setCategoryPk(categoryPk + 1);
      setDatum(result);
      setCreateDatum([]);
      setCreateFlag(false);

      let db;
      const request = indexedDB.open("notes", 2);
      // IndexedDB.open(Name, Version)

      request.onupgradeneeded = (e: any) => {
        console.log(e);
        db = e.target.result;

        var objectStore = db.createObjectStore("memo", { keyPath: "id" });
        objectStore.createIndex("name", "name", { unique: true });

        const memos = [
          {
            id: 1,
            name: "Lee",
            age: 12,
            text: "I don't want to go to school.",
          },
          { id: 2, name: "Kim", age: 25, text: "I don't want to go to work." },
        ];

        // var memoObjectStore = db
        //   .transaction("memo", "readwrite")
        //   .objectStore("memo");
        // memos.forEach(function (memo) {
        //   memoObjectStore.add(memo);
        // });
      };

      request.onsuccess = (e: any) => {
        // db = e.target.result;

        // var objectStore = db.createObjectStore("memo2", { keyPath: "id" });
        // objectStore.createIndex("name", "name", { unique: true });

        // const memos = [
        //   {
        //     id: 1,
        //     name: "Lee",
        //     age: 12,
        //     text: "I don't want to go to school.",
        //   },
        //   { id: 2, name: "Kim", age: 25, text: "I don't want to go to work." },
        // ];

        // var memoObjectStore = db
        //   .transaction("memo", "readwrite")
        //   .objectStore("memo");
        // memos.forEach(function (memo) {
        //   memoObjectStore.add(memo);
        // });
        alert("success is called");
      };

      request.onerror = (e) => {
        alert("error is called");
      };
    },
    [datum, categoryPk]
  );

  // 생성하기
  const createHandler = useCallback(() => {
    let data = createDatum ? createDatum.map((value) => value) : [];

    data.push({
      title: `이름 ${datum.length + 1}`,
      id: categoryPk,
    });

    setCreateDatum(data);
    setCreateInput(`이름 ${datum.length + 1}`);
    setCreateFlag(true);
  }, [createDatum, datum, categoryPk]);

  useEffect(() => {
    if (createInputRef.current !== null) {
      createInputRef.current.focus();
    }
  }, [createDatum]);

  return (
    <>
      <WholeWrapper>
        <CateWholeWrapper>
          <Wrapper width={`100%`} $flex={theme.flex.columnCenter}>
            {datum.map((data, idx) => {
              return (
                <CateWrapper key={idx} $isActive={false}>
                  {data.title}
                </CateWrapper>
              );
            })}
            {createDatum.map((data, idx) => {
              return (
                <CateWrapper key={idx} $isActive={true}>
                  <CreateInput
                    ref={createInputRef}
                    value={createInput}
                    onChange={(e) => setCreateInput(e.target.value)}
                    onKeyDown={(e) => e.keyCode === 13 && dbCreateHandler(data)}
                  />
                </CateWrapper>
              );
            })}
          </Wrapper>

          <Btn onClick={createHandler}>+ 새 카테고리</Btn>
        </CateWholeWrapper>

        <TaskWholeWrapper>
          <Wrapper width={`100%`} $flex={theme.flex.rowSpaceBetween}>
            <Text
              fontSize={`24px`}
              color={theme.colors.basic}
              fontWeight={`700`}
            >
              카테고리명
            </Text>
            <TaskDeleteBtn>카테고리 삭제하기</TaskDeleteBtn>
          </Wrapper>
          <TaskWrapper width={`100%`}>
            <TaskIngWrapper>
              <TaskTitleWrapper>✅ 진행중 2</TaskTitleWrapper>
              <Task $isActive={true}>
                <TaskCheckInput type="checkbox" />
                <Text
                  fontSize={`14px`}
                  color={theme.colors.black}
                  fontWeight={`400`}
                >
                  123
                </Text>
              </Task>

              <Task $isActive={false}>
                <TaskCheckInput type="checkbox" />
                <Text
                  fontSize={`14px`}
                  color={theme.colors.black}
                  fontWeight={`400`}
                >
                  123
                </Text>
              </Task>

              <Task $isActive={false}>
                <TaskCheckInput type="checkbox" />
                <Text
                  fontSize={`14px`}
                  color={theme.colors.black}
                  fontWeight={`400`}
                >
                  123
                </Text>
              </Task>
            </TaskIngWrapper>
            <TaskIngWrapper>
              <TaskTitleWrapper>☑️ 완료됨 2</TaskTitleWrapper>
              <Task $isActive={false}>
                <TaskCheckInput type="checkbox" />
                <FinishText>123</FinishText>
              </Task>
            </TaskIngWrapper>
          </TaskWrapper>
        </TaskWholeWrapper>
      </WholeWrapper>
    </>
  );
}

export default App;
