import React, { useEffect } from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import ImgLogin from "../../assets/img/logol-login.jpg"
import { useState } from "react";
import {EyeFilled, EyeInvisibleFilled} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from "../../redux/slides/userSlide";
import backgroundimg from "../../assets/img/backgroundresize.jpg"

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const location = useLocation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )
    const { data, isLoading, isSuccess} = mutation

    useEffect(() => {
        if (isSuccess) {
            if(location?.state) {
                navigate(location?.state)
            } else {
                navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if (data?.access_token) {
                const decoded = jwt_decode(data?.access_token)
                if(decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess])

    const handleGetDetailsUser = async (id, token) => {
        const storage = localStorage.getItem('refresh_token')
        const refresh_token = JSON.parse(storage)
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token, refresh_token }))
    }
    console.log('mutation', mutation)

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }
    return (
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0, 0, 0, 0.53)', backgroundImage: `url(${backgroundimg})`, height:'100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius:'6px', backgroundColor: 'rgb(152 103 183 / 87%)', display:'flex'}}>
                <WrapperContainerLeft>
                    <h1 style={{color: '#fff'}}>Xin Chào</h1>
                    <p style={{color: '#fff'}}>Đăng nhập và tạo tài khoản</p>
                    <InputForm style={{marginBottom:'10px'}} placeholder="email" value={email} onChange={handleOnChangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}
                        >{
                            isShowPassword ? (
                                <EyeFilled />
                            ) : (
                                <EyeInvisibleFilled />
                            )
                        }
                        </span>
                        <InputForm 
                            placeholder="mật khẩu"
                            type={isShowPassword ? "text" : "password"} 
                            value={password} 
                            onChange={handleOnChangePassword} 
                        />
                    </div>
                    {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled = {!email.length || !password.length}
                            onClick={handleSignIn}
                            bordered={false}
                            size={40} 
                            styleButton={{
                                background: '#a62aff',
                                borderRadius:"10px",
                                height: '52px',
                                width: '100%',
                                border: 'none',
                                margin: '26px 0 5px'
                            }} 
                            textButton={'Đăng nhập'}
                            styleTextButton={{color: '#fff', fontSize:'15px', fontWeight:'600'}}
                        ></ButtonComponent>
                    </Loading>
                    <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
                    <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp} style={{cursor:'pointer'}}> Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={ImgLogin} preview={false} alt="image-logo" height="203px" width="299px"/>
                    <h4 style={{color: '#fff', fontFamily: 'monospace'}}>Mua sắm tại BINHBUI GEAR</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage