import React, { useEffect } from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "../SignInPage/style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import ImgLogin from "../../assets/img/logol-login.jpg"
import { useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from '../../components/Message/Message';
import backgroundimg from "../../assets/img/backgroundresize.jpg"

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate()

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleNavigateSignIn()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    console.log('mutation', mutation)

    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const handleSignUp = () => {
        mutation.mutate({
            email,
            password,
            confirmPassword
        })
        console.log('sign-up', email, password, confirmPassword)
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)',backgroundImage: `url(${backgroundimg})`, height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', backgroundColor: 'rgb(152 103 183 / 87%)', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Xin Chào</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }} placeholder="email" value={email} onChange={handleOnChangeEmail} />
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
                        <InputForm style={{ marginBottom: '10px' }} placeholder="mật khẩu" type={isShowPassword ? "text" : "password"}
                            value={password} onChange={handleOnChangePassword} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}
                        >{
                                isShowConfirmPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }
                        </span>
                        <InputForm placeholder="xác nhận mật khẩu" type={isShowConfirmPassword ? "text" : "password"}
                            value={confirmPassword} onChange={handleOnChangeConfirmPassword} />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={40}
                            styleButton={{
                                background: '#a62aff', borderRadius: "10px",
                                height: '52px',
                                width: '100%',
                                border: 'none',
                                margin: '26px 0 5px'
                            }}
                            textButton={'Đăng ký tài khoản'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}
                        ></ButtonComponent>
                    </Loading>
                    <p>Đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={ImgLogin} preview={false} alt="image-logo" height="203px" width="299px" />
                    <h4 style={{ color: '#fff', fontFamily: 'monospace' }}>Mua sắm tại BINHBUI GEAR</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignUpPage