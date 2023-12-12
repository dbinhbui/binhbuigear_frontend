import React from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from '../../services/ProductService'
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import CartComponentBuildPC from "../../components/CartComponentBuildPC/CartComponentBuildPC";

const TypeProductPageBuildPC = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page:0,
        limit: 10,
        total: 1,
    })
    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            console.log('res', res)
            setLoading(false)
            setProducts(res?.data)
            setPanigate({...panigate, total: res?.totalPage})
        } else {
            setLoading(false)
        }
    }


    console.log('searchProduct', searchProduct)
    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    const onChange = (current, pageSize) => {
        console.log({current, pageSize})
        setPanigate({...panigate, page: current - 1, limit: pageSize})
    }
    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#EEEEEE', height: 'calc(100vh - 64px)' }}>
                <div style={{ width: '1270px', margin: '0 auto', height:'100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '40px', height:'calc(100% - 10px)' }}>
                        {/* <WrapperNavbar span={4} >
                            <NavbarComponent />
                        </WrapperNavbar> */}
                        <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <WrapperProducts >
                                {products?.filter((pro) => {
                                    if(searchDebounce === '') {
                                        return pro
                                    } else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                        return pro
                                    }
                                })?.map((product) => {
                                    return (
                                        <CartComponentBuildPC
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selld={product.selld}
                                            discount={product.discount}
                                            id={product._id}
                                        />
                                    )
                                })}
                            </WrapperProducts>
                            <Pagination defaultCurrent={panigate.page + 1} total={50} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPageBuildPC
