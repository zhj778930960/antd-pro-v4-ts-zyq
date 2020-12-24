import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Switch, notification } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { VariblesDataType } from '@/services/system/variable/index.d'
import { addVariable, editVariable } from '@/services/system/variable/index'

const { TextArea } = Input;
interface CreateVariablesProps {
  modalVisiable: boolean,
  modalTitleVisiable: boolean,
  onCancelModal: () => void,
  formInfo: VariblesDataType
}
interface addOrEditVariblesDataType {
  description?: string
  enabled?: number
  id?: string
  sort?: number
  value?: string
  variable?: string
}

const formLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

const addVariables = async (data: addOrEditVariblesDataType, onCancelModal: () => void) => {
  const res = await addVariable(data)
  if (res?.status === '00000') {
    notification.success({
      message: '成功',
      description: '新增系统变量成功！'
    })
    onCancelModal()
  } else {
    notification.error({
      message: '失败',
      description: '新增系统变量失败！'
    })
  }
}

const editVariables = async (data: addOrEditVariblesDataType, formInfo: VariblesDataType, onCancelModal: () => void) => {
  const info = {
    ...formInfo,
    ...data
  }
  const res = await editVariable(info)
  if (res?.status === '00000') {
    notification.success({
      message: '成功',
      description: '编辑系统变量成功！'
    })
    onCancelModal()
  } else {
    notification.error({
      message: '失败',
      description: '编辑系统变量失败！'
    })
  }
}
const CreateVariables: React.FC<CreateVariablesProps> = (props) => {
  const { modalVisiable, modalTitleVisiable, onCancelModal, formInfo } = props
  const [form] = useForm()
  const [enabled, setenabled] = useState(1)

  useEffect(() => {
    form.setFieldsValue(formInfo)
  }, [formInfo])
  const onOkModal = () => {
    form.validateFields().then(data => {
      if (modalTitleVisiable) {
        addVariables(data, onCancelModal)
      } else {
        editVariables(data, formInfo, onCancelModal)
      }
    })
  }
  const switchChange = (checked: boolean) => {
    setenabled(checked ? 1 : 2)
    form.setFieldsValue({
      'enabled': checked ? 1 : 2
    })
  }

  return (
    <Modal forceRender destroyOnClose visible={modalVisiable} title={`${modalTitleVisiable ? '新建' : '编辑'}系统变量`} onOk={onOkModal} onCancel={onCancelModal}>
      <Form {...formLayout} form={form}>
        <Form.Item name='variable' label='变量名' rules={[{ required: true, message: '请输入变量名' }]}>
          <Input placeholder='请输入变量名' />
        </Form.Item>
        <Form.Item name='value' label='变量值' rules={[{ required: true, message: '请输入变量值' }]}>
          <Input placeholder='请输入变量值' />
        </Form.Item>
        <Form.Item name='sort' label='排序' rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder='请输入排序值' min={1} />
        </Form.Item>
        <Form.Item name='description' label='描述'>
          <TextArea placeholder='请输入描述' rows={4} />
        </Form.Item>
        <Form.Item name='enabled' label='状态'>
          <Switch checked={enabled === 1} checkedChildren='启用' unCheckedChildren="停用" onChange={switchChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateVariables