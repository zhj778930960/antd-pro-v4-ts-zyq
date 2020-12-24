import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import { getTransactions } from '@/services/task/transaction/index'



interface TransactionsParams {
  name: string,
  id: string
}

// 获取事务列表
const getTransaction = async (setPackagePlatform: (data: TransactionsParams[]) => void) => {
  const res = await getTransactions({
    sort: 'created_time,desc'
  })
  if (res?.status === '00000') {
    setPackagePlatform(res.data)
  }
}

const { Option } = Select

const TransitionBasicCreate: React.FC<{}> = () => {
  const [transactions, setTransactions] = useState<TransactionsParams[]>([])

  useEffect(() => {
    getTransaction(setTransactions)
  }, [])


  return (
    <>
      <Form.Item name='transaction_id' label='事务' rules={[{ required: true, message: '请选择事务' }]}>
        <Select placeholder='请选择事务' showSearch>
          {
            transactions && transactions.map(item => {
              return <Option value={item.id} key={item.id}>{item.name}</Option>
            })
          }
        </Select>
      </Form.Item>
    </>
  )
}

export default TransitionBasicCreate