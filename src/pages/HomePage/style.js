 import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct=styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    height: 44px;
    background: #efd8ff;
    font-weight: 500;
    font-size: 15px;
    
`
export const WrapperButtonMore=styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: #5e0f97;
        text-color: ${(props) => props.disabled ? '#ccc' : '#fff'}
        span {
            color: #fff;
        }
    }
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`
export const WrapperProducts=styled.div`
    display: flex;
    gap: 36px;
    margin-top: 20px;
    flex-wrap: wrap;
`