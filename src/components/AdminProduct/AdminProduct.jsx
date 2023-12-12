import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Select, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../untils";
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message"
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [typeSelect, setTypeSelect] = useState('')
    const user = useSelector((state) => state?.user)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        discount: '',
        newType: ''
    })
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        discount: ''
    })

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const { name,
                price,
                description,
                rating,
                image,
                type,
                countInStock,
                discount } = data
            const res = ProductService.createProduct({
                name,
                price,
                description,
                rating,
                image,
                type,
                countInStock,
                discount
            })
            return res
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                token
            } = data
            const res = ProductService.deleteProduct(
                id,
                token
            )
            return res
        },
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = ProductService.deleteManyProduct(
                ids,
                token
            )
            return res
        },
    )

    console.log('mutationDeletedMany', mutationDeletedMany)

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const handleDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
    const { isLoading: isLoadingProducts, data: products } = queryProduct
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: '#5e0f97', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
            </div>
        )
    }

    console.log('type', typeProduct)

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
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
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
    });

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: 'Dưới 1.000.000',
                    value: 'under1M',
                },
                {
                    text: 'Dưới 5.000.000',
                    value: 'under5M',
                },
                {
                    text: 'Dưới 10.000.000',
                    value: 'under10M',
                },
                {
                    text: 'Dưới 15.000.000',
                    value: 'under15M',
                },
                {
                    text: 'Trên 15.000.000',
                    value: 'over15M',
                },
            ],
            onFilter: (value, record) => {
                if (value === 'under1M') {
                    return record.price <= 1000000
                } else if (value === 'under5M') {
                    return record.price <= 5000000
                } else if (value === 'under10M') {
                    return record.price <= 10000000
                } else if (value === 'under15M') {
                    return record.price <= 15000000
                } else if (value === 'over15M') {
                    return record.price >= 15000000
                }
            },
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            //sorter: (a, b) => a.type.length - b.type.length,
            filters: [
                {
                    text: 'CPU AMD',
                    value: 'cpuamd',
                },
                {
                    text: 'CPU Intel',
                    value: 'cpuintel',
                },
                {
                    text: 'Card đồ họa',
                    value: 'vga',
                },
                {
                    text: 'Mainboard AMD',
                    value: 'mainboardamd',
                },
                {
                    text: 'Mainboard Intel',
                    value: 'mainboardintel',
                },
                {
                    text: 'Ram DDR4',
                    value: 'ramd4',
                },
                {
                    text: 'Ram DDR5',
                    value: 'ramd5',
                },
                {
                    text: 'SSD',
                    value: 'ssd',
                },
                {
                    text: 'HDD',
                    value: 'hdd',
                },
                {
                    text: 'Nguồn',
                    value: 'psu',
                },
                {
                    text: 'Cooling',
                    value: 'cooling',
                },
                {
                    text: 'Case',
                    value: 'case',
                },
                {
                    text: 'Laptop',
                    value: 'laptop',
                },
                {
                    text: 'PC build sẵn',
                    value: 'pc',
                },
            ],
            onFilter: (value, record) => {
                if (value === 'cpuamd') {
                    return record.type == 'CPU AMD'
                } else if (value === 'cpuintel') {
                    return record.type === 'CPU Intel'
                } else if (value === 'vga') {
                    return record.type === 'VGA'
                } else if (value === 'mainboardamd') {
                    return record.type === 'Mainboard AMD'
                } else if (value === 'mainboardintel') {
                    return record.type === 'Mainboard Intel'
                } else if (value === 'ramd4') {
                    return record.type === 'Ram DDR4'
                }  else if (value === 'ramd5') {
                    return record.type === 'Ram DDR5'
                } else if (value === 'ssd') {
                    return record.type === 'SSD'
                } else if (value === 'hdd') {
                    return record.type === 'HDD'
                } else if (value === 'psu') {
                    return record.type === 'PSU'
                } else if (value === 'cooling') {
                    return record.type === 'Cooling'
                } else if (value === 'case') {
                    return record.type === 'Case'
                } else if (value === 'laptop') {
                    return record.type === 'Laptop'
                } else if (value === 'pc') {
                    return record.type === 'PC'
                }
            },
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '1 sao',
                    value: '1star',
                },
                {
                    text: '2 sao',
                    value: '2star',
                },
                {
                    text: '3 sao',
                    value: '3star',
                },
                {
                    text: '4 sao',
                    value: '4star',
                },
                {
                    text: '5 sao',
                    value: '5star',
                },
            ],
            onFilter: (value, record) => {
                if (value === '1star') {
                    return record.rating == 1
                } else if (value === '2star') {
                    return record.rating == 2
                } else if (value === '3star') {
                    return record.rating == 3
                } else if (value === '4star') {
                    return record.rating == 4
                } else if (value === '5star') {
                    return record.rating == 5
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: ''
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

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: ''
        })
        form.resetFields()
    };
    const onFinish = () => {
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        if (value !== 'add_type') {
            setStateProduct({
                ...stateProduct,
                type: value
            })
        } else {
            setTypeSelect(value)
        }
    }

    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyProducts} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }}
                />
            </div>
            <ModalComponent forceRender title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên (ký tự)"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Loại (ký tự HOA)"
                            name="type"
                            rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
                        >
                            <Select
                                name="type"
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                            {typeSelect === 'add_type' && (
                                <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="Số lượng (số)"
                            name="countInStock"
                            rules={[{ required: true, message: 'Nhập số lượng trong kho' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Giá bán (số)"
                            name="price"
                            rules={[{ required: true, message: 'Nhập giá sản phẩm!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Đánh giá (1->5)"
                            name="rating"
                            rules={[{ required: true, message: 'Nhập đánh giá sản phẩm!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả (ký tự)"
                            name="description"
                            rules={[{ required: true, message: 'Nhập mô tả sản phẩm!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá (số)"
                            name="discount"
                            rules={[{ required: true, message: 'Nhập mô giảm giá!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnChange} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Thêm hình ảnh sản phẩm' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
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
                                Thêm sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>

            <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%" >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Loại"
                            name="type"
                            rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng"
                            name="countInStock"
                            rules={[{ required: true, message: 'Nhập số lượng trong kho' }]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Giá bán"
                            name="price"
                            rules={[{ required: true, message: 'Nhập giá sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Đánh giá"
                            name="rating"
                            rules={[{ required: true, message: 'Nhập đánh giá sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleOnChangeDetails} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Nhập mô tả sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleOnChangeDetails} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá"
                            name="discount"
                            rules={[{ required: true, message: 'Nhập giảm giá!' }]}
                        >
                            <InputComponent value={stateProductDetails.discount} onChange={handleOnChangeDetails} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Thêm hình ảnh sản phẩm' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
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

            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>
                        Sản phẩm sẽ bị xóa?
                    </div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct