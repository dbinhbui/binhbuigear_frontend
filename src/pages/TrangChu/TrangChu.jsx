import React, { useEffect, useState } from "react";
import { StyleNameProduct, WrapperButtonMore, WrapperCardprd, WrapperDiscountText, WrapperNewPrd, WrapperOutStandingPrd, WrapperPriceText, WrapperProducts, WrapperReportText, WrapperStyleTextSell, WrapperTopNav } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/img/slider_1.jpg";
import slider2 from "../../assets/img/slider_2.jpg";
import slider3 from "../../assets/img/slider_3.jpg";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { Link, useNavigate } from "react-router-dom";
import { UnorderedListOutlined, ProjectOutlined, YoutubeOutlined, PropertySafetyOutlined, ContactsOutlined, ThunderboltOutlined, StarFilled } from '@ant-design/icons'
import prd1 from "../../assets/img/prd1.jpeg";
import prd2 from "../../assets/img/Cooler Master Hyper 620S.jpg";
import prd3 from "../../assets/img/ASUS TUF RTX 3060 Ti OC 8GB V2 Gaming.png";
import prd4 from "../../assets/img/Thermalright Frost Spirit 140.jpg";
import prd5 from "../../assets/img/Segotep GM 850W ATX 3.0 PCIE 5.0 2.jpg";
import prd6 from "../../assets/img/AMD Ryzen 9 7950X3D.jpg";
import prd7 from "../../assets/img/GIGABYTE AORUS Radeon RX 6900 XT MASTER 16G.jpg";
import prd8 from "../../assets/img/ASUS TUF Gaming GeForce RTX 3080 Ti.jpg";
import prd9 from "../../assets/img/NZXT AIO Kraken Elite 360 White RGB.jpg";
import prd10 from "../../assets/img/SSD Kingston NV2 500GB PCIe 4.0 x4 NVMe M.2.jpg";
import bg from "../../assets/img/background.jpg";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import CartComponent from "../../components/CartComponent/CartComponent";

const TrangChu = () => {
    const navigate = useNavigate()
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(12)
    const [typeProducts, setTypeProducts] = useState([])
    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }
    const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 100, keepPreviousData: true })

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <>
            <HeaderComponent isHiddenSearch />
            <div style={{ width: '100%', background: 'rgb(107 0 185)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <WrapperTopNav style={{ justifyContent: 'space-evenly', display: 'flex' }}>
                    <div onClick={() => { navigate('/allproduct') }} style={{ cursor: 'pointer' }}>
                        <span style={{ color: '#fff', fontSize: '22px' }}><UnorderedListOutlined /></span>
                        <span style={{ color: '#fff', fontSize: '14px' }}> Sản phẩm</span>
                    </div>
                    <Link to={'https://vnexpress.net/so-hoa'}>
                        <div>
                            <span style={{ color: '#fff', fontSize: '22px' }}><ProjectOutlined /></span>
                            <span style={{ color: '#fff', fontSize: '14px' }}> Tin công nghệ</span>
                        </div>
                    </Link>
                    <Link to={'https://www.youtube.com/c/GEARVNofficial/videos'}>
                        <div>
                            <span style={{ color: '#fff', fontSize: '22px' }}><YoutubeOutlined /></span>
                            <span style={{ color: '#fff', fontSize: '14px' }}> Video</span>
                        </div>
                    </Link>
                    <Link to={'https://gearvn.com/pages/chinh-sach-bao-hanh'}>
                        <div>
                            <span style={{ color: '#fff', fontSize: '22px' }}><PropertySafetyOutlined /></span>
                            <span style={{ color: '#fff', fontSize: '14px' }}> Chính sách bảo hành</span>
                        </div>
                    </Link>
                    <Link to={'https://gearvn.com/pages/chinh-sach-bao-hanh'}>
                        <div>
                            <span style={{ color: '#fff', fontSize: '22px' }}><ContactsOutlined /></span>
                            <span style={{ color: '#fff', fontSize: '14px' }}> Liên hệ</span>
                        </div>
                    </Link>
                </WrapperTopNav>
            </div>
            <div className="body" style={{ width: '100%', backgroundColor: '#fff', padding: '10px 0 0' }}>
                <div id="container" style={{ padding: '0 260px', height: '1500px', width: 'auto', margin: '0 auto' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3]} />
                    <WrapperNewPrd>
                        <span style={{ color: '#feea32', fontSize: '32px', padding: '0 15px 0', fontWeight: 700, lineHeight: '48px' }}><ThunderboltOutlined /> HÀNG MỚI VỀ</span>
                        <div style={{ display: "flex", justifyContent: 'space-around', padding: '25px' }}>
                            <WrapperCardprd>
                                <img
                                    src={prd1}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => { navigate('/product-detail/65642827cc34085ccfdec9ef') }}>tản nhiệt khí ID-Cooling SE-234-ARGB v2</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>4 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>690.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd2}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/6564298acc34085ccfdeca7e')}>tản nhiệt khí Cooler Master Hyper 620S</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>3 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>710.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd3}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/65642a75cc34085ccfdecae5')}>Card màn hình ASUS TUF RTX 3060 Ti OC 8GB V2 Gaming</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>4 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>9.990.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd4}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/6564293ecc34085ccfdeca54')}>tản nhiệt khí Thermalright Frost Spirit 140</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>4 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>1.190.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd5}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/656428b6cc34085ccfdeca24')}>Nguồn Segotep GM 850W ATX 3.0 PCIE 5.0</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>4 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>2.750.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                        </div>
                    </WrapperNewPrd>
                    <WrapperOutStandingPrd>
                        <span style={{ color: '#fff', fontSize: '32px', padding: '0 15px 0', fontWeight: 700, lineHeight: '48px' }}>SẢN PHẨM NỔI BẬT</span>
                        <div style={{ display: "flex", justifyContent: 'space-around', padding: '25px' }}>
                            <WrapperCardprd>
                                <img
                                    src={prd6}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/656429f1cc34085ccfdecaa9')}>CPU AMD Ryzen 9 7950X3D</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>5 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>18.990.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd7}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/65642c1bcc34085ccfdecbb6')} >Card màn hình GIGABYTE AORUS Radeon RX 6900 XT MASTER 16G</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>2 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>31.900.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd8}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/65642bc1cc34085ccfdecb7a')}>Card màn hình ASUS TUF Gaming GeForce RTX 3080 Ti</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>4 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>9.990.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 10%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd9}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/65642b40cc34085ccfdecb42')}>tản nhiệt NZXT AIO Kraken Elite 360 White RGB</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>3 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>7.990.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 12%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                            <WrapperCardprd>
                                <img
                                    src={prd10}
                                    style={{
                                        width: '100%', height: '200px'
                                    }}
                                    alt=""
                                />
                                <StyleNameProduct style={{ cursor: 'pointer' }} onClick={() => navigate('/product-detail/65642ad9cc34085ccfdecb26')}>SSD Kingston NV2 500GB PCIe 4.0 x4 NVMe M.2</StyleNameProduct>
                                <WrapperReportText>
                                    <span style={{ marginRight: '4px' }}>
                                        <span>5 </span> <StarFilled style={{ fontSize: '12px', color: '#F3F32A' }} />
                                    </span>
                                    <WrapperStyleTextSell> | Đã bán {1000}+</WrapperStyleTextSell>
                                </WrapperReportText>
                                <WrapperPriceText>
                                    <span style={{ marginRight: '8px' }}>730.000 VNĐ</span>
                                    <WrapperDiscountText>
                                        - 5%
                                    </WrapperDiscountText>
                                </WrapperPriceText>
                            </WrapperCardprd>
                        </div>
                    </WrapperOutStandingPrd>
                    <div style={{ textTransform: 'uppercase', padding: '20px 0 10px', fontSize: '25px', fontWeight: 600 }}>tất cả sản phẩm</div>
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
                        <WrapperButtonMore onClick={() => { navigate('/allproduct') }}>
                            Xem Thêm
                        </WrapperButtonMore>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrangChu