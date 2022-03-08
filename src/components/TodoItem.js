import React from 'react';
import styled, { css } from 'styled-components';
import { MdDone, MdDelete } from 'react-icons/md';
import { useTodoDispatch } from '../TodoContext';

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

    ${props => props.done && css`
        border: 2px solid #12b886;
        color: #12b886;
    `}
`;
const Text = styled.div`
    flex: 1;
    font-size: 21px;
    color: #343a40;
    ${props => props.done && css`
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
        type: 'TOGGLE',
        id
    });
  const onRemove = () =>
    dispatch({
        type: 'REMOVE',
        id
    });

  return (
    <TodoItemBlock>
        <CheckCircle done={done} onClick={onToggle}>
            {done && <MdDone />}
        </CheckCircle>
        <Text done={done}>
            {text}
        </Text>
        <Remove onClick={onRemove}>
            <MdDelete />
        </Remove>
    </TodoItemBlock>
  )
};

export default React.memo(TodoItem);