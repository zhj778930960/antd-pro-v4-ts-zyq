import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table'
import { getAll, delVariable, editVariable } from '@/services/system/variable/index'
import { Switch, Button, Popconfirm, notification } from 'antd'
import { VariblesDataType } from '@/services/system/variable/index.d'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import CreateVariables from './components/CreateVariables'

interface getAllVariablesParams {
  current?: number,
  pageSize?: number
}

interface RestParamsType {
  variable?: string,
  value?: string
}

const filterRestParams = (rest: RestParamsType) => {
  const info = {}
  Object.keys(rest).forEach(item => {
    if (rest[item]) {
      info[item] = rest[item]
    }
  })

  return info
}

const getAllVariables = async (params: getAllVariablesParams) => {
  const { current, pageSize: size, ...rest } = params
  const infoParams = filterRestParams(rest)
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'sort,asc',
    ...infoParams
  }
  const result = {
    data: [],
    total: 0
  }
  const res = await getAll(info)
  if (res?.status === '00000') {
    const { list, total } = res.data
    Object.assign(result, {
      data: list,
      total,
      success: true
    })
  }
  return result
}

const SysVariable: React.FC<{}> = () => {
  const defaultForm = {
    description: "",
    enabled: 1,
    id: '',
    sort: 999,
    value: "",
    variable: ""
  }
  const actionRef = useRef<ActionType>()
  const [modalVisiable, setModalVisiable] = useState<boolean>(false)
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true)
  const [formInfo, setFormInfo] = useState<VariblesDataType>(defaultForm)
  // 删除
  const currentDelUser = async (id: string) => {
    const res = await delVariable({
      id
    })
    if (res?.status === '00000') {
      notification.success({
        message: '成功',
        description: '删除系统变量成功！'
      })
      actionRef.current?.reload()
    } else {
      notification.error({
        message: '失败',
        description: '删除系统变量失败！'
      })
    }
  }

  const columns: ProColumns<VariblesDataType>[] = [
    {
      title: '变量名',
      dataIndex: 'variable'
    },
    {
      title: '变量值',
      dataIndex: 'value',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: false,
      render: (_, row) => {
        return (
          <Switch checked={row.enabled === 1} key='checkedChange' checkedChildren='启用' unCheckedChildren="停用" onChange={(e) => changeSwitch(e, row)} />
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      search: false
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      search: false
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      hideInForm: true,
      render: (_, row) => {
        return (<>
          <Button type="link" size='small' key="editButton" style={{ paddingLeft: '0px' }} onClick={() => {
            setModalTitleVisiable(false)
            setFormInfo(row)
            setModalVisiable(true)
          }}>
            编辑
          </Button>
          <Popconfirm
            trigger='click'
            key={row.id}
            title={
              <div>是否
                <span className={styles.delColor}> 删除 </span>
                系统变量 <span className={styles.delColor}> {row.variable} </span> ?</div>}
            onConfirm={() => currentDelUser(row.id || '')}
          >
            <Button type="link" key="deleteButton" size='small'  >删除</Button>
          </Popconfirm>
        </>)
      }
    }

  ]

  const onCancelModal = () => {
    setModalTitleVisiable(true)
    setModalVisiable(false)
    actionRef.current?.reload()
  }

  async function changeSwitch(state: boolean, row: VariblesDataType) {
    const currentRow = JSON.parse(JSON.stringify(row))
    currentRow.enabled = state === false ? 2 : 1
    const res = await editVariable(currentRow)
    if (res?.status === '00000') {
      notification.success({
        message: '成功',
        description: '编辑系统变量成功！'
      })
      actionRef.current?.reload()

    } else {
      notification.error({
        message: '失败',
        description: '编辑系统变量失败！'
      })
    }
  }

  return (
    <PageContainer>
      <ProTable
        rowKey='id'
        actionRef={actionRef}
        columns={columns}
        request={(params) => getAllVariables(params)}
        toolBarRender={
          () => [
            <Button key='childrenCreate' type='primary' onClick={() => {
              setModalTitleVisiable(true)
              setFormInfo(defaultForm)
              setModalVisiable(true)
            }}><PlusOutlined /> 新建</Button>
          ]
        } />
      <CreateVariables
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        onCancelModal={onCancelModal}
        formInfo={formInfo} />
    </PageContainer>
  )
}

export default SysVariable