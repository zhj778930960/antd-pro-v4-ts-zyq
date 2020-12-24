import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { add, edit } from '@/services/system/dictionary/index';
import { AddDictionaryParams, DictionaryDataType } from '@/services/system/dictionary/index.d';
import { notifyInfoTip } from '@/utils/utils';

interface CreateDictionaryPropsType {
  modalVisible: boolean;
  modalTitleVisible: boolean;
  currentRow: DictionaryDataType;
  onCancelModal: () => void;
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
const addDictionary = async (data: AddDictionaryParams, onCancelModal: () => void) => {
  const res = await add(data);
  if (res?.status === '00000') {
    notifyInfoTip('字典', '新增', true);
    onCancelModal();
  } else {
    notifyInfoTip('字典', '新增', false, res.message);
  }
};

// 编辑
const editDictionary = async (
  data: AddDictionaryParams,
  currentRow: DictionaryDataType,
  onCancelModal: () => void,
) => {
  const params = {
    ...currentRow,
    ...data,
  };
  const res = await edit(params);
  if (res?.status === '00000') {
    notifyInfoTip('字典', '编辑', true);
    onCancelModal();
  } else {
    notifyInfoTip('字典', '编辑', false, res.message);
  }
};
const CreateDictionary: React.FC<CreateDictionaryPropsType> = (props) => {
  const { modalVisible, onCancelModal, modalTitleVisible, currentRow } = props;
  const [form] = Form.useForm();

  const modalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisible) {
        addDictionary(data, onCancelModal);
      } else {
        editDictionary(data, currentRow, onCancelModal);
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleVisible ? '新增' : '编辑'}字典`}
      visible={modalVisible}
      onCancel={onCancelModal}
      onOk={modalOk}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label="字典名称"
          rules={[{ required: true, message: '请输入字典名称' }]}
        >
          <Input placeholder="请输入字典名称" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input placeholder="请输入字典描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDictionary;
