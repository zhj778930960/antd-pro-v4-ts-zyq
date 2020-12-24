import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { RepositoryTableData } from '@/services/project/repository/index.d';
import { addRepository, editRepository } from '@/services/project/repository/index';
import { notifyInfoTip } from '@/utils/utils';

const { TextArea } = Input;
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

interface PropsParamsType {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  onModalCancel: () => void;
  currentRow: RepositoryTableData;
}

const addRepositories = async (data: RepositoryTableData, onModalCancel: () => void) => {
  const res = await addRepository(data);
  if (res?.status === '00000') {
    notifyInfoTip('仓库', '新增', true);
    onModalCancel();
  } else {
    notifyInfoTip('仓库', '新增', false, res.message);
  }
};

const editRepositories = async (
  data: RepositoryTableData,
  currentRow: RepositoryTableData,
  onModalCancel: () => void,
) => {
  const params = {
    ...currentRow,
    ...data,
  };
  const res = await editRepository(params);
  if (res?.status === '00000') {
    notifyInfoTip('仓库', '编辑', true);
    onModalCancel();
  } else {
    notifyInfoTip('仓库', '编辑', false, res.message);
  }
};

const CreateRepository: React.FC<PropsParamsType> = (props) => {
  const { modalVisiable, modalTitleVisiable, onModalCancel, currentRow } = props;
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  const onOkModal = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisiable) {
        addRepositories(data, onModalCancel);
      } else {
        editRepositories(data, currentRow, onModalCancel);
      }
    });
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新增' : '编辑'}源码仓库`}
      onCancel={onModalCancel}
      onOk={onOkModal}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label="仓库名称"
          rules={[{ required: true, message: '请输入仓库名称' }]}
        >
          <Input placeholder="请输入仓库名称" />
        </Form.Item>
        <Form.Item
          name="label"
          label="仓库标识"
          rules={[{ required: true, message: '请输入仓库标识' }]}
        >
          <Input placeholder="请输入仓库标识" />
        </Form.Item>
        <Form.Item name="git_url" label="git仓库地址">
          <Input placeholder="请输入git仓库地址" />
        </Form.Item>
        <Form.Item name="gitlab_project_id" label="gitlab项目ID">
          <Input placeholder="请输入gitlab项目ID" />
        </Form.Item>
        <Form.Item name="token" label="访问令牌">
          <Input placeholder="请输入访问令牌" />
        </Form.Item>
        <Form.Item name="enabled" label="访问令牌" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
        <Form.Item name="notes" label="备注">
          <TextArea placeholder="请输入备注信息" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRepository;
