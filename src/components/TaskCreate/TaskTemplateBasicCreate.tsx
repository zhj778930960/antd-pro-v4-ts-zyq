import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import { getAllTaskTemplate } from '@/services/task/taskTemplate/index'

interface TaskTemplatesParams {
  name: string,
  id: string
}

// 获取任务模板
const geTaskTemplates = async (setTaskTemplates: (data: TaskTemplatesParams[]) => void) => {
  const res = await getAllTaskTemplate({
    sort: 'created_time,desc'
  })
  if (res?.status === '00000') {
    setTaskTemplates(res.data)
  }
}

const { Option } = Select

const TaskTemplateBasicCreate: React.FC<{}> = () => {
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplatesParams[]>([])

  useEffect(() => {
    geTaskTemplates(setTaskTemplates)
  }, [])

  return (
    <>
      <Form.Item name='task_template_id' label='模板' rules={[{ required: true, message: '请选择模板' }]}>
        <Select placeholder='请选择模板' showSearch>
          {
            taskTemplates && taskTemplates.map(item => {
              return <Option value={item.id} key={item.id}>{item.name}</Option>
            })
          }
        </Select>
      </Form.Item>
    </>
  )
}

export default TaskTemplateBasicCreate