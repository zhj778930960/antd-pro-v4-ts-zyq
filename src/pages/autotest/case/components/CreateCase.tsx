import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Switch, InputNumber } from 'antd';
import { CurrentRowParams } from '@/services/autotest/case/index.d';
import { getAllChildren } from '@/services/system/dictionary/index';
import { useForm } from 'antd/lib/form/Form';
import { addTestCases, editTestCases } from '@/services/autotest/case/index';
import { notifyInfoTip } from '@/utils/utils';

const { TextArea } = Input;
const { Option } = Select;
interface CreateCaseProps {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  currentRow: CurrentRowParams;
  onModalCancel: () => void;
}

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const getAllChildrenTransType = async (setTransTypes: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'trans_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setTransTypes(res.data);
  }
};

const addTestCase = async (data: CurrentRowParams, onModalCancel: () => void) => {
  const res = await addTestCases(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('测试用例', '新增', true);
  } else {
    notifyInfoTip('测试用例', '新增', false, res.message);
  }
};

const editTestCase = async (data: CurrentRowParams, onModalCancel: () => void) => {
  const res = await editTestCases(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('测试用例', '编辑', true);
  } else {
    notifyInfoTip('测试用例', '编辑', false, res.message);
  }
};

const CreateCase: React.FC<CreateCaseProps> = (props) => {
  const { modalTitleVisiable, modalVisiable, currentRow, onModalCancel } = props;
  const [transTypes, setTransTypes] = useState<DictionaryDataParams[]>([]);
  const [form] = useForm();
  useEffect(() => {
    form.setFieldsValue(currentRow);
    getAllChildrenTransType(setTransTypes);
  }, [currentRow]);

  const onModalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisiable) {
        addTestCase(data, onModalCancel);
      } else {
        const info = {
          ...currentRow,
          ...data,
        };
        editTestCase(info, onModalCancel);
      }
    });
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleVisiable ? '新建' : '编辑'}测试用例`}
      visible={modalVisiable}
      onCancel={onModalCancel}
      onOk={onModalOk}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label="用例名称"
          rules={[{ required: true, message: '请输入用例名称' }]}
        >
          <Input placeholder="请输入用例名称" />
        </Form.Item>
        <Form.Item name="label" label="用例标识">
          <Input placeholder="请输入用例名称" />
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Select placeholder="请选择类型">
            {transTypes &&
              transTypes.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.label}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" min={1} />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>
        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCase;
