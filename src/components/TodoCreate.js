import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { useTodoDispatch, useTodoNextId } from '../TodoContext';

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

    ${props => props.open && css`
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
  const [value, setValue] = useState('');
  const dispatch = useTodoDispatch();
  const nextId = useTodoNextId();

  const onToggle = () => setOpen(!open);
  const onChange = (e) => setValue(e.target.value);
  // enter하고 새로 고침되지 않게 방지하는 방법
  const onSubmit = e => {
      e.preventDefault();
      dispatch({
          type: 'CREATE',
          todo: {
            id: nextId.current,
            text: value,
            done: false
          }
      });
      setValue('');
      setOpen(false);
      nextId.current += 1;
  };


  return (
    <>
        {open && (
            <InsertFormPositioner>
                <InsertForm onSubmit={onSubmit}>
                    <Input placeholder='할 일을 입력한 후 Enter를 누르세요!' autoFocus onChange={onChange} value={value} />
                </InsertForm>
            </InsertFormPositioner>)}
        <CircleButton onClick={onToggle} open={open}>
            <MdAdd />        
        </CircleButton>
    </>
  )
};

export default React.memo(TodoCreate);