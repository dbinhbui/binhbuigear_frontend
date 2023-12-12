import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../untils";
import * as message from "../../components/Message/Message"
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from '../../services/UserService';
import { useQuery } from "@tanstack/react-query";
import {DeleteOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons'


const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '', 
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''
    })

    const [form] = Form.useForm();

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

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids 
                } = data
            const res = UserService.deleteManyUser(
                ids,
                token 
                )
                return res
        },
    )

    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                token 
                } = data
            const res = UserService.deleteUser(
                id,
                token 
                )
                return res
        },
    )

    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        console.log('res', res)
        return res
    }

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email, 
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if(rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
    const { isLoading: isLoadingUsers, data: users } = queryUser
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{color: 'red', fontSize: '20px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{color: '#5e0f97', fontSize: '20px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        //setSearchText(selectedKeys[0]);
        //setSearchedColumn(dataIndex);
      };
      const handleReset = (clearFilters) => {
        clearFilters();
        //setSearchText('');
      };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <InputComponent
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Tìm
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Xóa
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1677ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: '#ffc069',
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={text ? text.toString() : ''}
        //     />
        //   ) : (
        //     text
        //   ),
      });

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title: 'Quyền',
            dataIndex: 'isAdmin',
            filters: [
                {
                  text: 'Tài khoản admin',
                  value: true,
                },
                {
                  text: 'Tài khoản user',
                  value: false,
                }
              ],
              onFilter: (value, record) => {    
                if(value === true) {
                    return record.isAdmin === 'Admin'
                } else if(value === false) {
                    return record.isAdmin === 'User'
                }
              }
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'Admin': 'User' }
    })
    
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '', 
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }}
                />
            </div>

            <DrawerComponent forceRender title="Chi tiết tài khoản" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%" >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên người dùng"
                            name="name"
                            rules={[{ required: false, message: 'Nhập tên người dùng!' }]}
                        >
                            <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Nhập email!' }]}
                        >
                            <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: false, message: 'Nhập số điện thoại' }]}
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
                            label="Admin(true/false)"
                            name="isAdmin"
                            rules={[{ required: false, message: 'thay đổi quyền' }]}
                        >
                            <InputComponent value={stateUserDetails.isAdmin} onChange={handleOnChangeDetails} name="isAdmin" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="avatar"
                            rules={[{ required: false, message: 'Thêm hình ảnh người dùng' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#5e0f97' }}>
                                Hoàn tất chỉnh sửa
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent forceRender title="Xóa tài khoản" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Tài khoản sẽ bị xóa?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminUser