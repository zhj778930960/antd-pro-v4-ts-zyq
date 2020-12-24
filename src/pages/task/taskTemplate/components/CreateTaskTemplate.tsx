import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Radio, Switch } from 'antd';
import { useForm } from 'antd/lib/form/Form';
// 用户管理http
import { getUsers } from '@/services/system/users/index';
import { addTaskTemplates, editTaskTemplates } from '@/services/task/taskTemplate/index';
import { AddTaskTemplatesType, EditTaskTemplatesType } from '@/services/task/taskTemplate/index.d';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;

interface CurrentRowParams {
  name: string;
  run_mode: string;
  enabled: boolean;
  notified_users: string[];
}

interface CreateTaskTemplateProp {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  onModalCancel: () => void;
  currentRow: CurrentRowParams;
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
// 获取用户
const getAllUsers = async (setAllUsers: (data: AllUsersType[]) => void) => {
  const res = await getUsers({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setAllUsers(res.data);
  }
};

// 新增
const addTaskTemplate = async (data: AddTaskTemplatesType, onModalCancel: () => void) => {
  const res = await addTaskTemplates(data);
  if (res?.status === '00000') {
    notifyInfoTip('模板', '新增', true);
    onModalCancel();
  } else {
    notifyInfoTip('模板', '新增', false, res.message);
  }
};

// 编辑
const editTaskTemplate = async (data: EditTaskTemplatesType, onModalCancel: () => void) => {
  const res = await editTaskTemplates(data);
  if (res?.status === '00000') {
    notifyInfoTip('模板', '编辑', true);
    onModalCancel();
  } else {
    notifyInfoTip('模板', '编辑', false, res.message);
  }
};

const CreateTaskTemplate: React.FC<CreateTaskTemplateProp> = (props) => {
  const { modalTitleVisiable, modalVisiable, onModalCancel, currentRow } = props;
  const [allUsers, setAllUsers] = useState<AllUsersType[]>([]);
  const [form] = useForm();
  useEffect(() => {
    form.resetFields();
    getAllUsers(setAllUsers);
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  const onModalOk = () => {
    form.validateFields().then((data) => {
      const info = JSON.parse(JSON.stringify(data));
      info.notified_users = info.notified_users.join(',');
      if (modalTitleVisiable) {
        addTaskTemplate(info, onModalCancel);
      } else {
        const params = {
          ...currentRow,
          ...info,
        };
        editTaskTemplate(params, onModalCancel);
      }
    });
  };
  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新建' : '编辑'}任务模板`}
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

        <Form.Item name="run_mode" label="运行方式" initialValue={{ run_mode: '1' }}>
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

        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch defaultChecked checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskTemplate;
