import React from 'react'
import { WrapperInfo, WrapperContainer, Lable, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo, } from './style';
import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { convertPrice } from '../../untils';
import { orderContant } from '../../contant';

const OrderSuccess = () => {
    const order = useSelector((state) => state.order)
    const location = useLocation()
    const { state } = location
    console.log('location', location)
    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
            <Loading isLoading={false}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3>Hoàn tất đơn đặt hàng</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <Lable>Phương thức giao hàng</Lable>
                                    <WrapperValue>
                                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Phương thức thanh toán</Lable>
                                    <WrapperValue>
                                        {orderContant.payment[state?.payment]}
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                {state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder key={order?.name}>
                                            <div style={{ width: '500px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                                                <div style={{
                                                    width: '260px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>{order?.name}</div>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '100px' }}>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Đơn giá: {convertPrice(order?.price)}</span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Thành tiền: {convertPrice((order?.price) * (order?.amount))}</span>
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}
                                <div>
                                    <span style={{ fontSize: '16px', color: 'rgb(183 67 255)', fontWeight: '500' }}>Tổng giá tiền: {convertPrice(state?.totalPriceMemo)}</span>
                                </div>
                            </WrapperItemOrderInfo>

                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default OrderSuccess