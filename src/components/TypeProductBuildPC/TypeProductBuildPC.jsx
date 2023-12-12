import React from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";

const TypeProductBuildPC = ({ name }) => {
    const navigate = useNavigate()
    const handleSelectProduct = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
    }
    return (
        <div style={{ padding: '10px 10px', width: "290px", height: "90px", borderBottom: "1px solid #505050", borderRight: "1px solid #505050", display: "flex" }} >{name}
            <ButtonComponent
                size={40}
                styleButton={{
                    background: '#a62aff', borderRadius: "10px",
                    height: '52px',
                    width: '220px',
                    border: 'none',
                    marginLeft: '10px',
                }}
                onClick={() => handleSelectProduct(name)}
                textButton={'Chọn sản phẩm'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}
            ></ButtonComponent>
        </div>
    )
}

export default TypeProductBuildPC