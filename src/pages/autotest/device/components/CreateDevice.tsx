import React, { useEffect } from 'react';
import { Input, Modal, Form, Switch } from 'antd';
import { CurrentRowParams, AddOrEditDeviceParams } from '@/services/autotest/device/index.d';
import { useForm } from 'antd/lib/form/Form';
import { addAutotestDivices, editAutotestDivices } from '@/services/autotest/device/index';
import { notifyInfoTip } from '@/utils/utils';

const { TextArea } = Input;

interface CreateDeviceProps {
  modalTitleVisiable: boolean;
  modalVisiable: boolean;
  onModalCancel: () => void;
  currentRow: CurrentRowParams;
}

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const addAutotestDivice = async (data: AddOrEditDeviceParams, onModalCancel: () => void) => {
  const res = await addAutotestDivices(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('设备', '新增', true);
  } else {
    notifyInfoTip('设备', '新增', false, res.message);
  }
};

const editAutotestDivice = async (data: AddOrEditDeviceParams, onModalCancel: () => void) => {
  const res = await editAutotestDivices(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('设备', '编辑', true);
  } else {
    notifyInfoTip('设备', '新增', false, res.message);
  }
};

const CreateDevice: React.FC<CreateDeviceProps> = (props) => {
  const { modalTitleVisiable, modalVisiable, onModalCancel, currentRow } = props;
  const [form] = useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  const onModalOk = () => {
    form.validateFields().then((data) => {
      const info = JSON.parse(JSON.stringify(data));
      info.enabled = info.enabled ? 1 : 2;
      if (modalTitleVisiable) {
        addAutotestDivice(info, onModalCancel);
      } else {
        const params = {
          ...currentRow,
          ...info,
        };
        editAutotestDivice(params, onModalCancel);
      }
    });
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新增' : '编辑'}设备`}
      onCancel={onModalCancel}
      onOk={onModalOk}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="udid"
          label="设备编号"
          rules={[{ required: true, message: '请输入设备编号' }]}
        >
          <Input placeholder="请输入设备编号" />
        </Form.Item>
        <Form.Item name="brand" label="品牌" rules={[{ required: true, message: '请输入品牌' }]}>
          <Input placeholder="请输入品牌" />
        </Form.Item>
        <Form.Item name="model" label="型号" rules={[{ required: true, message: '请输入型号' }]}>
          <Input placeholder="请输入型号" />
        </Form.Item>
        <Form.Item
          name="remote_address"
          label="远程连接"
          rules={[{ required: true, message: '请输入远程连接' }]}
        >
          <Input placeholder="请输入远程连接" />
        </Form.Item>
        <Form.Item name="notes" label="备注">
          <TextArea placeholder="请输入备注" rows={4} />
        </Form.Item>
        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch unCheckedChildren="停用" checkedChildren="启用" defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDevice;
