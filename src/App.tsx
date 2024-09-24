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
  TaskInput,
  TaskTitleWrapper,
  TaskWholeWrapper,
  TaskWrapper,
  WholeWrapper,
} from "./styles/AppStyle";
import { theme } from "./styles/theme";
import { Text, Wrapper } from "./styles/CommonComponents";

type CData = {
  title: string;
  id: number;
};

type TData = {
  title: string;
  id: number;
  CategoryId: number;
  status: number;
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
//  => ?: 로 사용여부를 나타낼수있음
// 정의한 props는 쓰이지 않을 수 있는데 그렇게 된다면 빨간줄이 나타남

function App() {
  // style 정리, 함수분리, components분리

  // 1. datum 배열 생성
  // 2. CRUD (카테고리)
  // 3. sesstion 저장 후 불러오기
  // const datum = []; // DB

  //////////////////////////////////////////////
  ////////////////   USESTATE   ///////////////
  //////////////////////////////////////////////

  // DATUM
  const [datum, setDatum] = useState<CData[]>([]); // DB
  const [createDatum, setCreateDatum] = useState<CData[]>([]); // 엔터를 누르기 전까지는 input, []인이유는 create 여러개
  const [selectCategoryData, setSelectCategoryData] = useState<any>(null); // 선택한 카테고리
  const [taskDatum, setTaskDatum] = useState<TData[]>([]); // 카테고리에맞는테스크

  // FLAG
  const [createFlag, setCreateFlag] = useState<boolean>(false); // false : 추가버튼이 보이도록 true : 추가버튼이 보이지 않도록

  // INPUT
  const [createInput, setCreateInput] = useState<string>(""); // createInput
  const [taskCreateInput, setTaskCreateInput] = useState<string>(""); // taskCreateInput

  // REF
  const createInputRef = useRef<HTMLInputElement>(null);

  // PK
  const [categoryPk, setCategoryPk] = useState<number>(1); // 카테고리 고유값
  const [taskPk, setTaskPk] = useState<number>(1); // 테스크 고유값

  //////////////////////////////////////////////
  ////////////////   USEEFFECT   ///////////////
  //////////////////////////////////////////////

  // 초기값 세팅
  useEffect(() => {
    const request = indexedDB.open("todoList", 1);

    request.onsuccess = (e: any) => {
      // name, version이 맞는 db가 있을경우 호출
      const database = request.result;

      // db.transection("테이블이름","transaction mode")
      const transaction = database.transaction("category", "readwrite");

      // db.transaction.objectStore("테이블이름")
      // 해당 맞는 테이블 가져오기
      const store = transaction.objectStore("category");

      store.getAll().onsuccess = (data: any) => {
        const response = data.target.result;
        setDatum(response);
        setCategoryPk(response[response.length - 1].id + 1);
      };
    };
  }, []);

  // 카테고리 포커스처리
  useEffect(() => {
    if (createInputRef.current !== null) {
      createInputRef.current.focus();
    }
  }, [createDatum]);

  //////////////////////////////////////////////
  ////////////////   HANDLER   ///////////////
  //////////////////////////////////////////////

  // 카테고리 삭제하기
  const categoryDeleteHandler = useCallback(() => {
    const request = indexedDB.open("todoList", 1);
    request.onsuccess = (e: any) => {
      const database = request.result;
      const transaction = database.transaction("category", "readwrite");
      const store = transaction.objectStore("category");
      store.delete(selectCategoryData.id).onsuccess = () => {
        store.getAll().onsuccess = (e: any) => {
          const response = e.target.result;
          setDatum(response);
        };
      };
    };
    setTaskDatum([]);
    setSelectCategoryData(null);
  }, [selectCategoryData]);

  // 테스크 완료하기
  const taskUpdateHandler = useCallback(
    (data: TData) => {
      const request = indexedDB.open("todoList", 1);
      request.onsuccess = (e: any) => {
        const database = request.result;
        const transaction = database.transaction("task", "readwrite");
        const store = transaction.objectStore("task");

        store.put({
          id: data.id,
          title: data.title,
          CategoryId: data.CategoryId,
          status: data.status === 1 ? 2 : 1,
        }).onsuccess = () => {
          store.getAll().onsuccess = (e: any) => {
            const response = e.target.result;
            let result: TData[] = [];

            response.map((value: TData) => {
              if (value.CategoryId === selectCategoryData.id) {
                result.push(value);
              }
            });

            setTaskDatum(result);
          };
        };
      };
    },
    [selectCategoryData]
  );

  // 테스크 입력하기
  const taskCreateHandler = useCallback(
    (data: string) => {
      // name과 version 맞는 db 불러오기
      const request = indexedDB.open("todoList", 1);

      // name과 version이 맞는 db가 있을때 실행
      // task를 생성하려면 todoList가 이미 생성된 후일테니 그 외에건 고려 X
      request.onsuccess = (e: any) => {
        const database = request.result;

        // db.transection("테이블이름","transaction mode")
        const transaction = database.transaction("task", "readwrite");

        // db.transaction.objectStore("테이블이름")
        // 해당 맞는 테이블 가져오기
        const store = transaction.objectStore("task");

        store.add({
          title: data,
          // 1:진행중 2:완료됨
          status: 1,
          id: taskPk,
          CategoryId: selectCategoryData.id,
        }).onsuccess = () => {
          store.getAll().onsuccess = (e: any) => {
            const response = e.target.result;
            let result: TData[] = [];

            response.map((value: TData) => {
              if (value.CategoryId === selectCategoryData.id) {
                result.push(value);
              }
            });

            setTaskDatum(result);
          };
        };
        setTaskCreateInput("");
        setTaskPk(taskPk + 1);
      };
    },
    [taskPk, selectCategoryData]
  );

  // 카테고리 선택하기
  const categoryHandler = useCallback((data: any) => {
    setSelectCategoryData(data);

    // 선택한 카테고리와 맞는 테스크 가져오기
    const request = indexedDB.open("todoList", 1);

    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction("task", "readwrite");
      const store = transaction.objectStore("task");

      store.getAll().onsuccess = (e: any) => {
        const response = e.target.result;
        setTaskPk(response.length + 1);
        let tasks: TData[] = [];

        response.map((req: TData) => {
          if (req.CategoryId === data.id) {
            tasks.push(req);
          }
        });

        setTaskDatum(tasks);
      };
    };
  }, []);

  // 실제DB 저장하기
  const dbCreateHandler = useCallback(
    (data: number) => {
      // let result = datum ? datum.map((value) => value) : [];

      // result.push({
      //   title: data.title,
      //   id: data.id,
      // });

      setCategoryPk(categoryPk + 1);
      // setDatum(result);
      setCreateDatum([]);
      setCreateFlag(false);

      // IndexedDB.open(Name, Version)
      const request = indexedDB.open("todoList", 1);

      request.onerror = () => {
        alert("error");
      };

      // onupgradeneeded
      // 데이터베이스를 여는 코드를 작성했을때 사용한 name,version과 일치하는 db가 없는 경우 생성
      // onsuccess
      // name과 version이 맞는경우만 호출

      request.onupgradeneeded = (e: any) => {
        // 맨 처음에만 실행된 후 수정된 데이터가 없다면 실행X
        const database = request.result;

        // 테이블생성
        let objectStore = database.createObjectStore("category", {
          keyPath: "id",
        });
        // 테이블생성
        database.createObjectStore("task", {
          keyPath: "id",
        });
        // AutoIncrement : 고유번호 자동생성
        // keyPath : pk

        // 컬럼생성
        // 있는 이유를 모르겠음
        // objectStore.createIndex("category", "category", { unique: false });
        // objectStore.createIndex("task", "task", { unique: false });

        // transaction : CRUD
        // database.transaction(객체 저장소 이름, transaction mode)
        // readonly, readwrite, versionchange
        objectStore.transaction.oncomplete = (event: any) => {
          let customerObjectStore = database
            .transaction("category", "readwrite")
            .objectStore("category");

          datum.forEach((data) =>
            customerObjectStore.add({
              title: createInput,
              id: data,
            })
          );
        };
      };

      request.onsuccess = (e: any) => {
        // name, version이 맞는 db가 있을경우 호출
        const database = request.result;

        // db.transection("테이블이름","transaction mode")
        const transaction = database.transaction("category", "readwrite");

        // db.transaction.objectStore("테이블이름")
        // 해당 맞는 테이블 가져오기
        const store = transaction.objectStore("category");

        // todo 테이블에 데이터 넣어주기
        store.add({
          title: createInput,
          id: data,
        }).onsuccess = () => {
          store.getAll().onsuccess = (data: any) => {
            const response = data.target.result;
            setDatum(response);
          };
        };
      };
    },
    [datum, categoryPk, createInput]
  );

  // 가상 카테고리 생성
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

  return (
    <>
      <WholeWrapper>
        <CateWholeWrapper>
          <Wrapper
            width={`100%`}
            $flex={theme.flex.columnCenter}
            maxheight={`calc(100% - 60px)`}
            ju={`flex-start !important`}
          >
            {datum.map((data, idx) => {
              return (
                <CateWrapper
                  key={idx}
                  $isActive={
                    selectCategoryData && selectCategoryData.id === data.id
                  }
                  onClick={() => categoryHandler(data)}
                >
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
                    onKeyDown={(e) =>
                      e.keyCode === 13 && dbCreateHandler(data.id)
                    }
                  />
                </CateWrapper>
              );
            })}
          </Wrapper>

          {!createFlag && <Btn onClick={createHandler}>+ 새 카테고리</Btn>}
        </CateWholeWrapper>

        <TaskWholeWrapper>
          {selectCategoryData ? (
            <>
              <Wrapper width={`100%`} $flex={theme.flex.rowSpaceBetween}>
                <Text
                  fontSize={`24px`}
                  color={theme.colors.basic}
                  fontWeight={`700`}
                >
                  {selectCategoryData && selectCategoryData.title}
                </Text>
                <TaskDeleteBtn onClick={categoryDeleteHandler}>
                  카테고리 삭제하기
                </TaskDeleteBtn>
              </Wrapper>
              <TaskWrapper width={`100%`}>
                <TaskIngWrapper>
                  <TaskTitleWrapper>
                    ✅ 진행중&nbsp;
                    {taskDatum.filter((data) => data.status === 1).length}
                  </TaskTitleWrapper>
                  {taskDatum.map((data) => {
                    if (data.status === 1) {
                      return (
                        <Task $isActive={false} key={data.id}>
                          <TaskCheckInput
                            type="checkbox"
                            onChange={() => taskUpdateHandler(data)}
                          />
                          <Text
                            fontSize={`14px`}
                            color={theme.colors.black}
                            fontWeight={`400`}
                          >
                            {data.title}
                          </Text>
                        </Task>
                      );
                    }
                  })}
                </TaskIngWrapper>
                <TaskIngWrapper>
                  <TaskTitleWrapper>
                    ☑️ 완료됨{" "}
                    {taskDatum.filter((data) => data.status === 2).length}
                  </TaskTitleWrapper>

                  {taskDatum.map((data) => {
                    if (data.status === 2) {
                      return (
                        <Task $isActive={false} key={data.id}>
                          <TaskCheckInput
                            type="checkbox"
                            checked={true}
                            onChange={() => taskUpdateHandler(data)}
                          />
                          <FinishText>{data.title}</FinishText>
                        </Task>
                      );
                    }
                  })}
                </TaskIngWrapper>
              </TaskWrapper>

              <Wrapper width={`100%`} $flex={theme.flex.columnCenter}>
                <TaskInput
                  placeholder="할 일을 입력해주세요."
                  value={taskCreateInput}
                  onChange={(e) => setTaskCreateInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.keyCode === 13 && taskCreateHandler(taskCreateInput)
                  }
                />
              </Wrapper>
            </>
          ) : (
            <Wrapper
              width={`100%`}
              $flex={theme.flex.columnCenter}
              height={`100%`}
            >
              카테고리를 선택해주세요.
            </Wrapper>
          )}
        </TaskWholeWrapper>
      </WholeWrapper>
    </>
  );
}

export default App;
