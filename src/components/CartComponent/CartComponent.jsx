import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style";
import { StarFilled } from '@ant-design/icons';
import logo from '../../assets/img/offi.png';
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../untils";

const CartComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '260px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <img
                src={logo}
                style={{
                    width: '72px', height: '20px', position: 'absolute', top: -1, left: -2,
                    borderTopLeftRadius: '3px'
                }}
                alt="logo"
            />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán {selled || 1000}+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                <WrapperDiscountText>
                    - {discount || 5}%
                </WrapperDiscountText>
            </WrapperPriceText>

        </WrapperCardStyle>
    )
}

export default CartComponent