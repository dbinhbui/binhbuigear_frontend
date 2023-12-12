import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { convertPrice, getBase64 } from "../../untils";
import * as message from "../../components/Message/Message"
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from '../../services/OrderService';
import { useQuery } from "@tanstack/react-query";
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";

const AdminOrder = () => {
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        console.log('res', res)
        return res
    }

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters) => {
        clearFilters();
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
    });

    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'userName',
            ...getColumnSearchProps('userName')
        },
        {
            title: 'Thanh toán',
            dataIndex: 'isPaid',
            filters: [
                {
                    text: 'Đã thanh toán',
                    value: true,
                },
                {
                    text: 'Chưa thanh toán',
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if(value === true) {
                    return record.isPaid === 'Đã thanh toán'
                } else if (value === false) {
                    return record.isPaid === 'Chưa thanh toán'
                }
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Tình trạng giao hàng',
            dataIndex: 'isDelivered',
            filters: [
                {
                    text: 'Đã giao',
                    value: true,
                },
                {
                    text: 'Chưa giao',
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if(value === true) {
                    return record.isDelivered === 'Đã giao'
                } else if (value === false) {
                    return record.isDelivered === 'Chưa giao'
                }
            }
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Tổng giá tiền',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice')
        },
    ];


    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        console.log('asdfa', order)
        return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod],isPaid: order?.isPaid ? 'Đã thanh toán' :'Chưa thanh toán',isDelivered: order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao', totalPrice: convertPrice(order?.totalPrice)}
    })

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{height: 200, width: 200}}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
            </div>
        </div>
    )
}

export default AdminOrder