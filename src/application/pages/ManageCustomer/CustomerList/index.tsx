import React, { useRef, useState } from 'react'
import { Space, Typography, Button, Row, Col, Card, Table, Input, Result } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import type { InputRef } from 'antd'
import useFetchData from '~/application/hooks/useFetchData'
import CustomerDetail from '~/application/components/customerList/customerDetail'

const { Title } = Typography

interface DataType {
  createdAt: string
  updatedAt: string
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string
  imageUrl: string
  roleEntity: {
    id: number
    name: string
  }
  emailVerified: boolean
  dob: string
  isActive: number
  orderQuantity: number
  bookingQuantity: number
  totalMoney: number
}

type DataIndex = keyof DataType

const CustomerList: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [loadingUser, errorUser, responseUser] = useFetchData('/users')
  console.log(responseUser)
  const searchInput = useRef<InputRef>(null)
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })
  const columns: ColumnsType<DataType> = [
    {
      title: 'Customer',
      dataIndex: 'fullName',
      ...getColumnSearchProps('fullName'),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      width: '20%'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: '30%'
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: '15%'
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size='middle' direction='horizontal' className='!w-full'>
          <CustomerDetail id={record.id} />
          <Button type='link' danger>
            Khóa
          </Button>
        </Space>
      ),
      width: '15%'
    }
  ]
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }
  return (
    <div className='flex-grow min-h-[100%] relative px-4 lg:pr-8 lg:pl-3'>
      <Space size='large' direction='vertical' className='w-full'>
        <div className='flex flex-row justify-between items-center'>
          <Title level={3}>Danh sách khách hàng</Title>
        </div>
        <Row>
          <Col span={24}>
            {!errorUser ? (
              <Card bordered={false}>
                <Table
                  loading={loadingUser}
                  style={{ minHeight: 300 }}
                  columns={columns}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800, y: 300 }}
                  dataSource={responseUser ? responseUser?.data?.users.filter((e: any) => e.roleEntity.id === 4) : []}
                  onChange={onChange}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: () => {
                        console.log(rowIndex)
                        console.log(record)
                      }
                    }
                  }}
                />
              </Card>
            ) : (
              <Result title='Failed to fetch' subTitle={errorUser} status='error' />
            )}
          </Col>
        </Row>
      </Space>
    </div>
  )
}

export default CustomerList
