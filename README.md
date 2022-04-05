# React 기반 todolist 페이지 만들기

---

<br/>

## 프로젝트 시작하기

> 새로운 React project를 다음 명령어를 터미널에 작성하여 생성할 수 있습니다.

```
npx create-react-app react-todolist
```

## 컴포넌트 목록 및 설명

> 1. TodoTemplate.js
>    : 기본 레이아웃 설정
> 2. TodoHead.js
>    : 오늘의 날짜, 요일, 남은 할 일 개수 입력
> 3. TodoList.js
>    : 할 일을 보여주는 컴포넌트
> 4. TodoItem.js
>    : 할 일을 확인, 삭제 등 관리
> 5. TodoCreate.js
>    : 할 일을 작성할 form을 보여주고 입력받아 출력
> 6. TodoContext.js
>    : 기능을 구현

- ### Context API

  !['Context API를 이용한 방법'](../UseContextAPI.png)

  - _사용한 이유_  
    : 일반적으로 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달할 때 속성값을 사용하는데, 컴포넌트 사이의 깊이가 깊어질수록 코드를 반복해야 하는 기계적 전달 방식은 비효율적이다. 따라서 Context API를 사용하여 중첩된 구조에서도 속성값이 필요한 컴포넌트로 바로 전달할 수 있다.

    즉, TodoContext 컴포넌트에 필요한 상태관리, 기능을 구현하여 기능이 필요한 컴포넌트에 직접적으로 전달하여 반복되는 코드를 줄이고 효율적으로 관리하기 위함이다.

    ! 무조건 Context API를 사용하는게 옳은 것은 아니다 !
    => 구현이 복잡하지 않은 경우(규모가 작은 프로젝트나 현재 작성하는 todo-list도 포함되지만)에는 기계적으로 전달하는 방식을 사용하는 것이 더 낫지만, 규모가 큰 프로젝트의 경우 유용하게 사용할 수 있음

- ### 라이브러리

  - Styled-components
  - react-icons  
    <br/>

  ```
   yarn add styled-components react-icons
  ```

---

<br/>

## Code review

> App.js

```js
import React from "react";
import { createGlobalStyle } from "styled-components";
import { TodoProvider } from "./TodoContext";
import TodoCreate from "./components/TodoCreate";
import TodoHead from "./components/TodoHead";
import TodoList from "./components/TodoList";
import TodoTemplate from "./components/TodoTemplate";

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;

function App() {
  return (
    <TodoProvider>
      <GlobalStyle />
      <TodoTemplate>
        <TodoHead />
        <TodoList />
        <TodoCreate />
      </TodoTemplate>
    </TodoProvider>
  );
}

export default App;
```

- 설명

1. createGlobalStyle styled-components의 컴포넌트를 사용하여 배경색 지정

<br/>

> TodoTemplate.js

```js
import React from "react";
import styled from "styled-components";

const TodoTemplateBlock = styled.div`
  width: 512px;
  height: 768px;

  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0, 0, 8px rgba(0, 0, 0, 0.04);

  margin: 0 auto;
  margin-top: 96px;
  margin-bottom: 32px;

  display: flex;
  flex-direction: column;
`;

function TodoTemplate({ children }) {
  return <TodoTemplateBlock>{children}</TodoTemplateBlock>;
}

export default TodoTemplate;
```

- 설명

1. Styled-components를 이용하여 기본 레이아웃을 설정(= div 모양을 잡아줌)
2. TodoTemplateBlock 사이에 {children}을 위치시켜 기본 레이아웃 위로 내용이 보일 수 있도록 함
3. position: relative;의 역할은 하단에 TodoCreate 컴포넌트를 위치시키기 위한 속성
4. display: flex; flex-direction: column;은 TodoTemplate 컴포넌트 내부에 위치할 컴포넌트를 세로로 위치시키는 속성

<br/>

> TodoHead.js

```js
import React from "react";
import styled from "styled-components";
import { useTodoState } from "../TodoContext";

const TodoHeadBlock = styled.div`
  padding: 48px 32px 24px 32px;
  border-bottom: 1px solid #e9ecef;

  h1 {
    margin: 0;
    font-size: 36px;
    color: #343a40;
  }

  .day {
    margin-top: 4px;
    color: #868e96;
    font-size: 21px;
  }

  .tasks-left {
    color: #12b886;
    font-size: 18px;
    margin-top: 40px;
    font-weight: bold;
  }
`;

function TodoHead() {
  const todos = useTodoState();
  const undoneTasks = todos.filter((todo) => !todo.done);

  // JavaScript로 날짜, 요일 구현
  const today = new Date();
  const dateString = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dayName = today.toLocaleDateString("ko-KR", {
    weekday: "long",
  });

  return (
    <TodoHeadBlock>
      <h1>{dateString}</h1>
      <div className="day">{dayName}</div>
      <div className="tasks-left">할 일 {undoneTasks.length}개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;
```

- 설명

1. div 내에 h1, className day, className tasks-left를 만들고 css 작성
2. JavaScript로 오늘의 날짜, 요일 구현  
   => today에 new Date() 생성자를 이용하여 현재 날짜를 객체로 반환 후 dateString에 toLocaleDateString()을 사용하여 설정한대로 날짜가 표시(문자열로 변환), dayName 또한 요일만 표시되도록 설정
3. useTodoState Context를 불러와 현재 todos의 배열을 가져옴
4. undoneTasks에 todos.filter를 사용하여 done값이 false인 값을 가져와 남은 할일의 개수에 {undoneTasks.length}로 입력

<br/>

> TodoList.js

```js
import React from "react";
import styled from "styled-components";
import TodoItem from "./TodoItem";
import { useTodoState } from "../TodoContext";

const TodoListBlock = styled.div`
  flex: 1;
  padding: 20px 32px 48px;
  overflow-y: auto;
`;

function TodoList() {
  const todos = useTodoState();

  return (
    <TodoListBlock>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          done={todo.done}
        />
      ))}
    </TodoListBlock>
  );
}

export default TodoList;
```

- 설명

1. TodoListBlock을 생성하여 할 일 목록이 들어갈 공간을 만들어줌  
   => flex: 1;은 꽉 채우겠다는 것, overflow-y는 할 일 목록이 많아지면 스크롤이 만들어지도록 설정
2. todos에 useTodoState Context를 사용하여 상태관리
   => 각 todo를 todos.map를 사용하여 TodoItem에 key, id, text, done값으로 변환하여 입력

<br/>

> TodoItem.js

```js
import React from "react";
import styled, { css } from "styled-components";
import { MdDone, MdDelete } from "react-icons/md";
import { useTodoDispatch } from "../TodoContext";

const CheckCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.8px solid #ced4da;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;

  ${(props) =>
    props.done &&
    css`
      border: 2px solid #12b886;
      color: #12b886;
    `}
`;
const Text = styled.div`
  flex: 1;
  font-size: 21px;
  color: #343a40;
  ${(props) =>
    props.done &&
    css`
      color: #dee2e6;
    `}
`;
const Remove = styled.div`
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #dee2e6;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #ffa8a8;
  }
`;

const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;

  &:hover {
    ${Remove} {
      opacity: 1;
    }
  }
`;

function TodoItem({ id, done, text }) {
  const dispatch = useTodoDispatch();
  const onToggle = () =>
    dispatch({
      type: "TOGGLE",
      id,
    });
  const onRemove = () =>
    dispatch({
      type: "REMOVE",
      id,
    });

  return (
    <TodoItemBlock>
      <CheckCircle done={done} onClick={onToggle}>
        {done && <MdDone />}
      </CheckCircle>
      <Text done={done}>{text}</Text>
      <Remove onClick={onRemove}>
        <MdDelete />
      </Remove>
    </TodoItemBlock>
  );
}

export default React.memo(TodoItem);
```

- 설명

1. Styled-components로 각 div를 만들어 꾸며주었고 css 컴포넌트를 사용하여 props의 done이 true가 되었을 때 다른 모양이 되도록 작성(기본 done값은 false)
2. 다른 요소들을 감싸고 있는 TodoItemBlock에 hover했을 때 Remove 컴포넌트의 opacity가 1으로 설정하여 나타나게 함 (특정 상황에서 style을 적용하고 싶을 때 ${} selector 사용)
3. react-icons 라이브러리에서 MdDone, MdDelete icon 사용
4. Remove 컴포넌트는 TodoItemBlock에 mouse hover했을 때 나타나도록 ${Remove}를 사용함
5. TodoItem 컴포넌트에 id, done, text props를 가져와서 CheckCircle 컴포넌트에 props로 done값을 주고 done이 true일 때 MdDone이 나타나도록 렌더링해줌
6. dispatch에 useTodoDispatch context를 사용하여 상태 관리
   => onToggle과 onRemove를 dispatch로 type과 id를 가져옴
7. React.memo() 컴포넌트 최적화시킴 => TodoContext 컴포넌트에서 TodoStateContext와 TodoDispatchContext를 따로 설정하여 리렌더링 방지

<br/>

> TodoCreate.js

```js
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { MdAdd } from "react-icons/md";
import { useTodoDispatch, useTodoNextId } from "../TodoContext";

const CircleButton = styled.button`
  background: #12b886;
  &:hover {
    background: #38d9a9;
  }
  &:active {
    background: #099268;
  }

  z-index: 5;
  cursor: pointer;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  // 위치
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);

  font-size: 60px;
  color: white;
  border: none;
  outline: none;

  transition: 0.125s all ease-in;

  ${(props) =>
    props.open &&
    css`
      background: #ffa8a8;
      &:hover {
        background: #ffc9c9;
      }
      &:active {
        background: #ff6b6b;
      }
      transform: translate(-50%, 50%) rotate(45deg);
    `}
`;

// 특정 폼의 위치를 정해주는 것
const InsertFormPositioner = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
`;

// form으로 해서 할 일 입력 후 enter를 쳤을 때 입력될 수 있도록 설정
const InsertForm = styled.form`
  background: #f1f3f5;
  padding: 32px 32px 72px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #dee2e6;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  width: 100%;
  outline: none;
  font-size: 18px;
  box-sizing: border-box;
`;

function TodoCreate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useTodoDispatch();
  const nextId = useTodoNextId();

  const onToggle = () => setOpen(!open);
  const onChange = (e) => setValue(e.target.value);
  // enter하고 새로 고침되지 않게 방지하는 방법
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "CREATE",
      todo: {
        id: nextId.current,
        text: value,
        done: false,
      },
    });
    setValue("");
    setOpen(false);
    nextId.current += 1;
  };

  return (
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm onSubmit={onSubmit}>
            <Input
              placeholder="할 일을 입력한 후 Enter를 누르세요!"
              autoFocus
              onChange={onChange}
              value={value}
            />
          </InsertForm>
        </InsertFormPositioner>
      )}
      <CircleButton onClick={onToggle} open={open}>
        <MdAdd />
      </CircleButton>
    </>
  );
}

export default React.memo(TodoCreate);
```

- 설명

1. CircleButton 컴포넌트에 position: absolute; 속성을 줘서 TodoTemplate 하단에 위치하도록 함
2. useState를 사용해서 create할 수 있는 form을 열고 닫는 상태를 관리해줌
   => 초기값은 false로 하여 form을 닫혀 있게 하고, onToggle 함수를 만들어 setOpen에 !open 설정
3. CircleButton에 open props를 주고 click했을 때 onToggle함수가 렌더링되도록 설정 => open이 true일 때 css도 작성해줌
4. open이 true일 때 InsertFormPositioner가 보이도로고 설정
5. Input 컴포넌트에 autoFucus 속성으로 자동으로 focus가 되도록 설정
6. useState로 Input의 상태 관리
   => 초기값은 공백으로, onChange를 통해 Input의 value가 dispatch의 text의 value값이 됨
7. InsertForm을 form으로 만들어주면 onSubmit을 사용할 수 있음
   => input에 값을 입력하고 enter를 눌렀을 때 onSubmit 이벤트가 발생
   기본적으로 html에서 onSubmit이 발생하면 새로고침이 되는데 e.preventDefault를 해주면 새로고침 방지

<br/>

> TodoContext.js

```js
import React, { useReducer, createContext, useContext, useRef } from "react";

// 기초 Todos 배열
const initialTodos = [
  {
    id: 1,
    text: "프로젝트 생성하기",
    done: true,
  },
  {
    id: 2,
    text: "아침 7시 기상",
    done: true,
  },
  {
    id: 3,
    text: "리액트 공부하기",
    done: false,
  },
  {
    id: 4,
    text: "운동하기",
    done: false,
  },
];

// 기능 구현 : CREATE, TOGGLE, REMOVE
function todoReducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return state.concat(action.todo);
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case "REMOVE":
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error(`Unhandled type: ${action.type}`);
  }
}

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const TodoNextIdContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// custom Hook 생성
export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}
```

- 설명

1. initialTodos는 기본으로 제공하는 todo의 내용임
2. todoReducer 함수는 useReducer에서 사용할 함수이고 CREATE, TOGGLE, REMOVE 총 3가지의 action을 만들어 상태 업데이트를 함
   => state와 action을 가져와서 그 다음 상태를 return해주는 함수
   action.type = CREATE, TOGGLE, REMOVE
3. state.concat(action.todo); : action 안에 todo 항목을 넣어서 dispatch
   stste.map((todo) =>
   todo.id === action.id ? { ...todo, done: !todo.done } : todo
   ); : 모든 todo에 대하여 변환하여 새로운 배열로 만드는데, todo의 id가 action의 id와 같다면 done값이 반전된 값으로 가져올 것이고 다르다면 todo 유지
   state.filter(todo => todo.id !== action.id); : todo의 id와 action의 id가 같지 않은 것만 가져옴
4. TodoProvider 함수에 useReducer 사용하여 첫번째 파라미터는 todoReducer, 두번째 파라미터는 초기상태으로 initialTodos를 넣어줌
5. state와 dispatch를 위한 context를 createContext hook 함수로 만들어줌
   (context를 만들어주면 context 내에 provider이라는 컴포넌트가 존재함)
6. TodoNextIdContext와 useRef를 사용하여 새로운 항목을 만들 때마다 그 다음 id를 바로 변화시킬 수 있는 값으로 상태관리해줌

** custom hook에 대한 설명은 따로 블로그에 정리함 **

# DEMO

> http://121.174.97.245:3000
