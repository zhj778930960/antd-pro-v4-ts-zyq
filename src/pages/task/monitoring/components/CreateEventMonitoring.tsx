import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { addEventMonitorings, editEventMonitorings } from '@/services/task/monitoring/index';
import { AddEventMonitorings } from '@/services/task/monitoring/index.d';
import { notifyInfoTip } from '@/utils/utils';
import WarehouseSubmission from './WarehouseSubmission';

const { Option } = Select;

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

interface TaskTemplatesParams {
  name: string;
  id: string;
}

interface CurrentRowParams {
  name?: string;
  type?: string;
  id?: string;
  task_template_id?: string;
  enabled?: boolean;
  params?: {
    [key: string]: any;
  };
}

interface CreateEventMonitoringProps {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  onModalCancel: () => void;
  eventTypes: DictionaryDataParams[];
  taskTemplates: TaskTemplatesParams[];
  currentRow: CurrentRowParams;
}

const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

// 新增
const addEventMonitoring = async (data: AddEventMonitorings, onModalCancel: () => void) => {
  const res = await addEventMonitorings(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('事件监听', '新增', true);
  } else {
    notifyInfoTip('事件监听', '新增', false, res.message);
  }
};

// 编辑
const editEventMonitoring = async (data: AddEventMonitorings, onModalCancel: () => void) => {
  const res = await editEventMonitorings(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('事件监听', '编辑', true);
  } else {
    notifyInfoTip('事件监听', '编辑', false, res.message);
  }
};

const CreateEventMonitoring: React.FC<CreateEventMonitoringProps> = (props) => {
  const {
    modalTitleVisiable,
    modalVisiable,
    eventTypes,
    taskTemplates,
    onModalCancel,
    currentRow,
  } = props;
  const [form] = useForm();
  const [currentType, setCurrentType] = useState<string>();
  const changeEventType = (val: string) => {
    setCurrentType(val);
  };
  useEffect(() => {
    setCurrentType(currentRow.type);
    form.resetFields();
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  const onModalOk = () => {
    form.validateFields().then((data) => {
      const info = JSON.parse(JSON.stringify(data));
      info.enabled = info.enabled ? 1 : 2;
      if (modalTitleVisiable) {
        info.params = JSON.stringify(info.params);
        addEventMonitoring(info, onModalCancel);
      } else {
        info.params = currentRow.params;
        info.id = currentRow.id;
        info.params = JSON.stringify(info.params);
        editEventMonitoring(info, onModalCancel);
      }
    });
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新建' : '编辑'}监听`}
      onCancel={onModalCancel}
      onOk={onModalOk}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label="事件名称"
          rules={[{ required: true, message: '请输入事件名称' }]}
        >
          <Input placeholder="请输入事件名称" />
        </Form.Item>
        <Form.Item
          name="type"
          label="事件类型"
          rules={[{ required: true, message: '请选择事件类型' }]}
        >
          <Select placeholder="请选择事件类型" onChange={changeEventType}>
            {eventTypes &&
              eventTypes.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
          </Select>
        </Form.Item>
        {currentType && (
          <WarehouseSubmission
            form={form}
            currentRow={currentRow}
            modalTitleVisiable={modalTitleVisiable}
          />
        )}
        <Form.Item
          name="task_template_id"
          label="关联任务模板"
          rules={[{ required: true, message: '请选择任务模板' }]}
        >
          <Select placeholder="请选择任务模板">
            {taskTemplates &&
              taskTemplates.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEventMonitoring;
