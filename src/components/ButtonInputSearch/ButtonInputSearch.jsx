import React from 'react'
import {SearchOutlined} from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const {
            size, placeholder, textButton, 
            bordered, backgroundColorInput = '#fff', 
            backgroundColorButton = '#5e0f97',
            colorButton = '#fff'
        } = props
    return (
        <div style={{display: 'flex', borderRadius:"10px"}}>
            <InputComponent 
                size={size} 
                placeholder={placeholder} 
                bordered={bordered} 
                style={{backgroundColor: backgroundColorInput }} 
                {...props}
            />
            {/* <ButtonComponent 
                size={size} 
                bordered={bordered} 
                styleButton={{backgroundColor: backgroundColorButton, borderRadius:"10px", color: colorButton}} 
                icon={<SearchOutlined color={colorButton} style={{color:colorButton}}/>}
                textButton={textButton}
                styleTextButton={{color:colorButton}}
            /> */}
        </div>
    )
}

export default ButtonInputSearch