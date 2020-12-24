import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import { CreateFormColumn, EditFormColumn } from '@/services/system/users/index.d';
import { createUser, editUser } from '@/services/system/users/index';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;

interface RoleDataType {
  id: number;
  name: string;
}
interface CreateFormPropsType {
  modalTitleState: boolean;
  modalVisiable: boolean;
  formInfo: EditFormColumn;
  roleArrData: RoleDataType[];
  onCancel: () => void;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

// 新增
const createNewUser = async (values: CreateFormColumn, onCancel: () => void) => {
  const res = await createUser(values);
  if (res.data) {
    notifyInfoTip('用户', '新增', true);
    onCancel();
  } else {
    notifyInfoTip('用户', '新增', false, res.message);
  }
};

// 编辑
const editCurrentUser = async (values: EditFormColumn, onCancel: () => void) => {
  const res = await editUser(values);
  if (res.data) {
    notifyInfoTip('用户', '编辑', true);
    onCancel();
  } else {
    notifyInfoTip('用户', '编辑', false, res.message);
  }
};

// React.FC<{}> 就是对props 的约束
const CreateForm: React.FC<CreateFormPropsType> = (props) => {
  const [form] = Form.useForm();
  const { modalTitleState, modalVisiable, onCancel, formInfo, roleArrData } = props;
  const [enabled, setenabled] = useState(1);
  useEffect(() => {
    form.setFieldsValue(formInfo);
    setenabled(Number(formInfo.enabled));
  }, [formInfo]);

  const beforeCreateNewUser = () => {
    form.validateFields().then((values) => {
      Object.assign(formInfo, values);
      if (modalTitleState) {
        createNewUser(formInfo, onCancel);
      } else {
        editCurrentUser(formInfo, onCancel);
      }
    });
  };

  function switchChange(checked: boolean) {
    setenabled(checked ? 1 : 2);
    form.setFieldsValue({
      enabled: checked ? 1 : 2,
    });
  }

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleState ? '新建' : '编辑'}用户`}
      visible={modalVisiable}
      onCancel={() => onCancel()}
      onOk={() => beforeCreateNewUser()}
    >
      <Form {...layout} form={form} layout="horizontal">
        <Form.Item
          label="账号"
          name="user_name"
          rules={[{ required: true, message: '请输入登录账号' }]}
        >
          <Input placeholder="请输入登录账号" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入登录密码' }]}
        >
          <Input placeholder="请输入登录密码" />
        </Form.Item>
        <Form.Item
          label="用户名称"
          name="real_name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="请输入用户名称" />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item label="角色" name="role">
          <Select placeholder="请选择角色" allowClear>
            {roleArrData.map((item) => {
              return (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="enabled">
          <Switch
            checked={enabled === 1}
            checkedChildren="启用"
            unCheckedChildren="停用"
            onChange={switchChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
