import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    return (
        <div style={{ padding: '1px 120px', background: '#EEEEEE' }}>
            <h5 style={{cursor: 'pointer'}}><span style={{ fontWeight: '500', fontSize: '20px'}} onClick={() => {navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</h5>
            <ProductDetailComponent idProduct={id} />
        </div>
    )
}

export default ProductDetailPage