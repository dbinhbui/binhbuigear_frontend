import React from "react";
import { useNavigate } from "react-router-dom";
import slider1 from "../../assets/img/slider_1.jpg";
import slider2 from "../../assets/img/slider_2.jpg";
import slider3 from "../../assets/img/slider_3.jpg";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WrapperInputNumber } from '../../components/ProductDetailComponent/style';
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import { WrapperCountOrder, WrapperHeader, WrapperHeader2, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperTypeProduct } from "./style";
import { useState } from "react";
import * as ProductService from '../../services/ProductService'
import { useEffect } from "react";
import { addbuildpcProduct, resetbuildpc, increaseAmount, decreaseAmount, removebuildpcProduct, removeAllbuildpcProduct, selectedbuildpc } from "../../redux/slides/buildPcSlide";
import TypeProductBuildPC from "../../components/TypeProductBuildPC/TypeProductBuildPC";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "antd";
import { convertPrice } from "../../untils";

const BuildPC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const buildpc = useSelector((state) => state.buildpc)
    const [listChecked, setListChecked] = useState([])
    const [typeProducts, setTypeProducts] = useState([])
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }))
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }))
            }
        }
    }
    const handleDeleteOrder = (idProduct) => {
        dispatch(removebuildpcProduct({ idProduct }))

    }
    const onChange = (e) => {
        console.log(`checked = ${e.target.value}`);
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    };
    useEffect(() => {
        fetchAllTypeProduct()
    }, [])
    return (
        <div style={{ padding: '1px 120px', background: '#fff', height: "2000px" }} >
            <h5 style={{ cursor: 'pointer' }}><span style={{ fontWeight: '500', fontSize: '20px' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Xây dựng cấu hình</h5>
            <div style={{ padding: '0 210px', height: '1500px', width: 'auto', margin: '0 auto' }}>
                <SliderComponent arrImages={[slider1, slider2, slider3]} />
                <WrapperHeader>
                    Build PC - Xây dựng cấu hình máy tính PC giá rẻ chuẩn nhất
                </WrapperHeader>
                <WrapperHeader2>
                    Chọn linh kiện xây dựng cấu hình - Tự build PC
                </WrapperHeader2>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <WrapperLeft>
                        <WrapperTypeProduct>
                            {typeProducts.map((item) => {
                                return (
                                    <TypeProductBuildPC name={item} key={item} />
                                )
                            })}
                        </WrapperTypeProduct>
                    </WrapperLeft>
                    <WrapperRight>
                        <WrapperListOrder>
                            {buildpc?.buildpcItems?.map((buildpc) => {
                                return (
                                    <WrapperItemOrder key={buildpc?.product}>
                                        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Checkbox onChange={onChange} value={buildpc?.product} checked={listChecked.includes(buildpc?.product)}></Checkbox>
                                            <img src={buildpc?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                                            <div style={{
                                                width: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{buildpc?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(buildpc?.price)}</span>
                                                {/* <WrapperPriceDiscount>
                                                    {order?.amount}
                                                </WrapperPriceDiscount> */}
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', buildpc?.product, buildpc?.amount === 1)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber defaultValue={buildpc?.amount} value={buildpc?.amount} size="small" min={1} max={buildpc?.countInstock} />
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', buildpc?.product, buildpc?.amount === buildpc.countInstock)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: '500' }}>{convertPrice(buildpc?.price * buildpc?.amount)}</span>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(buildpc?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperRight>
                </div>
            </div>
        </div>
    )
}

export default BuildPC