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

- ### 라이브러리

  - Styled-components
  - react-icons  
    <br/>

  ```
   yarn add Styled-components react-icons
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

1. createGlobalStyle 함수를 사용하여 배경색 지정
2.

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

1. Styled-components를 이용하여 기본 레이아웃을 설정(=div 모양을 잡아줌)
2. TodoTemplateBlock 사이에 {children}을 위치시켜 기본 레이아웃 위로 내용이 보일 수 있도록 함

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
3.

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
2.

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
2. 다른 요소들을 감싸고 있는 TodoItemBlock에 hover했을 때 Remove 컴포넌트의 opacity가 1으로 설정하여 나타나게 함
3. react-icons 라이브러리에서 MdDone, MdDelete icon 사용
4.

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

1.
