import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
// 任务模板http
import { getAllTaskTemplate } from '@/services/task/taskTemplate/index';
// 用户管理http
import { getUsers } from '@/services/system/users/index';
import { addExecution, editExecution } from '@/services/task/execution/index';
import {
  DealWithAEExecutionsType,
  AddOrEditExecutionsType,
} from '@/services/task/execution/index.d';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;

interface CreateExecutionProps {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  onModalCancel: () => void;
  currentRow: DealWithAEExecutionsType;
}

interface TaskTemplateType {
  name: string;
  id: string;
  run_mode: string;
  notified_users: string | null;
}

interface AddOrEditParamsType {
  info: AddOrEditExecutionsType;
  onModalCancel: () => void;
}

interface AllUsersType {
  real_name: string;
  id: string;
  user_name: string;
}
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

// 新增
const addExecutions = async ({ info, onModalCancel }: AddOrEditParamsType) => {
  const res = await addExecution(info);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('执行记录', '新增', true);
  } else {
    notifyInfoTip('执行记录', '新增', false, res.message);
  }
};

// 编辑
const editExecutions = async (
  { info, onModalCancel }: AddOrEditParamsType,
  row: DealWithAEExecutionsType,
) => {
  const params = {
    ...row,
    ...info,
  };
  const res = await editExecution(params);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('执行记录', '编辑', true);
  } else {
    notifyInfoTip('执行记录', '编辑', false, res.message);
  }
};

// 获取使用模板
const getAllTemplates = async (setTaskTemplates: (data: TaskTemplateType[]) => void) => {
  const res = await getAllTaskTemplate({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setTaskTemplates(res.data);
  }
};

// 获取用户
const getAllUsers = async (setAllUsers: (data: AllUsersType[]) => void) => {
  const res = await getUsers({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setAllUsers(res.data);
  }
};

const CreateExecution: React.FC<CreateExecutionProps> = (props) => {
  const { modalVisiable, modalTitleVisiable, onModalCancel, currentRow } = props;
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplateType[]>([]);
  const [allUsers, setAllUsers] = useState<AllUsersType[]>([]);

  const [form] = useForm();
  useEffect(() => {
    getAllTemplates(setTaskTemplates);
    getAllUsers(setAllUsers);
  }, []);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(currentRow);
  }, [currentRow]);
  const onModalOk = () => {
    form.validateFields().then((data) => {
      const info = JSON.parse(JSON.stringify(data));
      info.notified_users = info.notified_users
        ? info.notified_users.join(',')
        : info.notified_users;
      if (modalTitleVisiable) {
        addExecutions({ info, onModalCancel });
      } else {
        editExecutions({ info, onModalCancel }, currentRow);
      }
    });
  };
  const changeTaskTemplate = (id: string) => {
    if (!id) {
      return;
    }
    const arr = taskTemplates.filter((item) => item.id === id);
    const { run_mode, notified_users } = arr[0];
    const notifyUsers = notified_users ? notified_users.split(',') : [];
    form.setFieldsValue({
      run_mode,
      notified_users: notifyUsers,
    });
  };
  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新建' : '编辑'}执行记录`}
      onCancel={onModalCancel}
      onOk={onModalOk}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item name="task_template_id" label="任务模板">
          <Select placeholder="请选择任务模板" onChange={changeTaskTemplate}>
            {taskTemplates &&
              taskTemplates.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          name="run_mode"
          label="运行方式"
          rules={[{ required: true, message: '请输入运行方式' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="1">串行</Radio.Button>
            <Radio.Button value="2">并行</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="notified_users" label="通知用户">
          <Select placeholder="请选择用户" allowClear mode="multiple">
            {allUsers &&
              allUsers.map((item) => {
                return (
                  <Option
                    key={item.id}
                    value={item.id}
                  >{`${item.user_name} | ${item.real_name}`}</Option>
                );
              })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateExecution;
