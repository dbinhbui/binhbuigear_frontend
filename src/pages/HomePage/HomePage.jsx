import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import CartComponent from "../../components/CartComponent/CartComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate()
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(60)
    const [typeProducts, setTypeProducts] = useState([])
    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if(res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }
    const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 100, keepPreviousData: true })

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: '100%'}}>
                <WrapperTypeProduct style={{padding: '0 260px'}}>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{ width: '100%', backgroundColor: '#fff' }}>
                <div id="container" style={{ padding: '0 260px', height: '1500px', width: 'auto', margin: '0 auto' }}>
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                            return (
                                <CartComponent
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
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore
                            textButton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" styleButton={{
                                border: '1px solid #5e0f97', color: `${products?.total === products?.data?.length ? '#ccc' : '#5e0f97'}`,
                                width: '240px', height: '38px', borderRadius: '4px'
                            }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{ fontWeight: 500 }}
                            onClick={() => setLimit((prev) => prev + 12)}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default HomePage