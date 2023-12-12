import { Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperInfo, WrapperLeft, WrapperRight, WrapperTotal, Lable, WrapperRadio, } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';

import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../untils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import * as PaymentService from '../../services/PaymentService'

const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [delivery, setDelivery] = useState('ghtk')
    const [payment, setPayment] = useState('later_money')
    const navigate = useNavigate()
    const [sdkReady, setSdkReady] = useState(false)
    const [listChecked, setListChecked] = useState([])
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })
    const [form] = Form.useForm();

    const dispatch = useDispatch()


    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount * cur.amount) / 100)
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo > 0 && priceMemo < 1000000) {
            return 50000
        } else if (priceMemo === 0) {
            return 0
        } else if (priceMemo >= 1000000) {
            return 0
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

    const handleRemoveAllOrder = () => {
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }
    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSelected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            // eslint-disable-next-line no-unused-expressions
            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSelected,
                    fullName: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    city: user?.city,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: deliveryPriceMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email
                }
            )
        }
    }
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,
                { ...rests }, token)
            return res
        },
    )

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const {
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        },
    )

    const { isLoading, data } = mutationUpdate
    const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = []
            order?.orderItemsSelected?.forEach(element => {
                arrayOrdered.push(element.product)
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
            message.success('Đặt hàng thành công')
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo
                }
            })
        } else if (isError) {
            message.error('đặt hàng không thành công')
        }
    }, [isSuccess, isError])

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            phone: '',
            address: '',
            city: '',
        })
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid: true,
                email: user?.email,
                paidAt: details.update_time
            }
        )
        console.log('details, data', details, data)
    }

    const handleUpdateInfo = () => {
        const { name, address, city, phone } = stateUserDetails
        if (name && address && city && phone) {
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }
    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleDelivery = (e) => {
        setDelivery(e.target.value)
    }
    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const addPaypalSrc = async () => {
        const { data } = await PaymentService.getConfig()
        const srcpp = document.createElement('script')
        srcpp.type = 'text/javascript'
        srcpp.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        srcpp.async = true;
        srcpp.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(srcpp)
        console.log('datapp', data)
    }
    useEffect(() => {
        if (!window.paypal) {
            addPaypalSrc()
        } else {
            setSdkReady(true)
        }
    }, [])
    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
            <Loading isLoading={isLoadingAddOrder}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3>Thanh toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio onChange={handleDelivery} value={delivery}>
                                        <Radio value="ghtk"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GHTK</span> Giao hàng tiết kiệm</Radio>
                                        <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handlePayment} value={payment}>
                                        <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Tạm tính</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Giảm giá</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Phí giao hàng</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(deliveryPriceMemo)}</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div>
                                        <span>Giao đến </span>
                                        <span onClick={handleChangeAddress} style={{ color: 'rgb(100, 4, 168)', fontWeight: 500, cursor: 'pointer' }}>{`${user?.address} ${user?.city}`} </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>(đã bao giồm VAT nếu có)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            {payment === 'paypal' && sdkReady ? (
                                <div style={{ width: '220px' }}>
                                    <PayPalButton
                                        amount={totalPriceMemo / 25000}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={onSuccessPaypal}
                                        onError={() => {
                                            alert('Đã xảy ra lỗi')
                                        }}
                                    />
                                </div>
                            ) : (
                                <ButtonComponent
                                    onClick={() => handleAddOrder()}
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        height: '48px',
                                        width: '220px',
                                        border: 'none',
                                        borderRadius: '29px',
                                    }}
                                    textButton={'Đặt hàng'}
                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                            )}

                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfo} >
                    <Loading isLoading={isLoading}>
                        <Form
                            name="basic"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 18 }}
                            //onFinish={onUpdateUser}
                            autoComplete="on"
                            form={form}
                        >
                            <Form.Item
                                label="Người nhận"
                                name="name"
                                rules={[{ required: true, message: 'Nhập tên người dùng!' }]}
                            >
                                <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                            >
                                <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Nhập địa chỉ' }]}
                            >
                                <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
                            </Form.Item>

                            <Form.Item
                                label="Tỉnh thành"
                                name="city"
                                rules={[{ required: true, message: 'Nhập tỉnh thành' }]}
                            >
                                <InputComponent value={stateUserDetails.city} onChange={handleOnChangeDetails} name="city" />
                            </Form.Item>

                        </Form>
                    </Loading>
                </ModalComponent>
            </Loading>
        </div>
    )
}

export default PaymentPage