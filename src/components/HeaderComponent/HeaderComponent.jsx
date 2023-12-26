import React, { useEffect, useState } from "react";
import { Badge, Col, Popover } from 'antd';
import { WrapperHeader, WrapperTextHeader, WrapperTextHeader2, WrapperHeaderAccount, WrapperTextHeaderSmall, WrapperContentPopup, WrapperHeaderBuildPC } from "./style";
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
    ToolOutlined
} from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/ProductSlide";
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)
    const [loading, setLoading] = useState(false)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin tài khoản</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lý </WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng đã đặt </WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );
    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile-user')
        } else if (type === 'admin') {
            navigate('/system/admin')
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <div style={{ width: '100%', background: '#6404a8', display: 'flex', justifyContent: 'center' }}>
            <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
                <Col span={5} onClick={() => { navigate('/') }} style={{ cursor: 'pointer' }}>
                    <WrapperTextHeader>binhbui</WrapperTextHeader>
                    <WrapperTextHeader2>gear</WrapperTextHeader2>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13}>
                        <ButtonInputSearch
                            size="large"
                            bordered={false}
                            textButton="Tìm kiếm"
                            placeholder="Tìm kiếm sản phẩm"
                            backgroundColorButton="#5a20c1"
                            onChange={onSearch}
                        />
                    </Col>
                )}

                <Col span={10} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img src={userAvatar} alt="avatar" style={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }} />
                            ) : (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}
                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                                    </Popover>
                                </>
                            ) : (
                                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                            <Badge count={order?.orderItems?.length} size="small">
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#efd8ff' }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>

                    )}

                </Col>
                {/* <WrapperHeaderBuildPC>
                    <div onClick={() => navigate('/buildpc')} style={{ cursor: 'pointer' }}>
                        <ToolOutlined style={{ fontSize: '30px', color: '#efd8ff' }} />
                        <WrapperTextHeaderSmall>Xây dựng cấu hình</WrapperTextHeaderSmall>
                    </div>
                </WrapperHeaderBuildPC> */}
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent