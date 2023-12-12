import { Row } from "antd";
import styled from "styled-components";
export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background: rgb(29,0,78);
    background: radial-gradient(circle, rgba(29,0,78,1) 0%, rgba(64,3,101,1) 55%, rgba(100,4,168,1) 100%);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
`
export const WrapperTextHeader = styled.span`
    font-size: 24px;
    color: #efd8ff;
    font-weight: 700;
    text-transform: uppercase;
`
export const WrapperTextHeader2 = styled.span`
    font-size: 24px;
    color: #2f85be;
    font-weight: 700;
    text-transform: uppercase;
`
export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #efd8ff;
`
export const WrapperHeaderBuildPC = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #efd8ff;
`
export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #efd8ff;
    white-space: nowrap;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: #efd8ff;
    }
`
