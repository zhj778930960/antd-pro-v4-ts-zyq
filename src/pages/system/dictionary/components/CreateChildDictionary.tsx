import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { addChild, editChild } from '@/services/system/dictionary/index';
import { AddDictChildParams } from '@/services/system/dictionary/index.d';
import { notifyInfoTip } from '@/utils/utils';

interface CreateDictionaryPropsType {
  modalVisible: boolean;
  modalTitleVisible: boolean;
  currentRow: AddDictChildParams;
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

// 提示

// 新增
const addDictionary = async (
  data: AddDictChildParams,
  currentRow: AddDictChildParams,
  onCancelModal: () => void,
) => {
  const params = {
    dictionary_id: currentRow.dictionary_id,
    ...data,
  };
  const res = await addChild(params);
  if (res?.status === '00000') {
    notifyInfoTip('字典项', '新增', true);
    onCancelModal();
  } else {
    notifyInfoTip('字典项', '新增', false, res.message);
  }
};

// 编辑
const editDictionary = async (
  data: AddDictChildParams,
  currentRow: AddDictChildParams,
  onCancelModal: () => void,
) => {
  const params = {
    ...currentRow,
    ...data,
  };
  const res = await editChild(params);
  if (res?.status === '00000') {
    notifyInfoTip('字典项', '编辑', true);
    onCancelModal();
  } else {
    notifyInfoTip('字典项', '编辑', false, res.message);
  }
};
const CreateChildDictionary: React.FC<CreateDictionaryPropsType> = (props) => {
  const { modalVisible, onCancelModal, modalTitleVisible, currentRow } = props;
  const [form] = Form.useForm();

  const modalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisible) {
        addDictionary(data, currentRow, onCancelModal);
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
      title={`${modalTitleVisible ? '新增' : '编辑'}字典项`}
      visible={modalVisible}
      onCancel={onCancelModal}
      onOk={modalOk}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="label"
          label="字典标签"
          rules={[{ required: true, message: '请输入字典标签' }]}
        >
          <Input placeholder="请输入字典名称" />
        </Form.Item>
        <Form.Item
          name="value"
          label="字典值"
          rules={[{ required: true, message: '请输入字典值' }]}
        >
          <Input placeholder="请输入字典值" />
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChildDictionary;
