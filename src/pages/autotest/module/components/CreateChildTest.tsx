import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import { addTestModuleCases, editTestModuleCases } from '@/services/autotest/module/index';
import { TestModuleDataType } from '@/services/autotest/module/index.d';
import { getAllTestCases } from '@/services/autotest/case/index';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;

interface CreateDictionaryPropsType {
  modalVisible: boolean;
  modalTitleVisible: boolean;
  currentRowChild: TestModuleDataType;
  onCancelModal: () => void;
}

interface TestCasesParams {
  name: string;
  id: string;
}

interface InspectionItemFormParams {
  item_id?: string;
  sort?: number;
}

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const getAllTestCase = async (setTestCases: (data: TestCasesParams[]) => void) => {
  const res = await getAllTestCases({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setTestCases(res.data);
  }
};

// 新增
const addTestModuleCase = async (
  data: InspectionItemFormParams,
  currentRowChild: TestModuleDataType,
  onCancelModal: () => void,
) => {
  const params = {
    module_id: currentRowChild.module_id,
    ...data,
  };
  const res = await addTestModuleCases(params);
  if (res?.status === '00000') {
    notifyInfoTip('测试用例', '新增', true);
    onCancelModal();
  } else {
    notifyInfoTip('测试用例', '新增', false, res.message);
  }
};

// 编辑
const editTestModuleCase = async (
  data: InspectionItemFormParams,
  currentRowChild: TestModuleDataType,
  onCancelModal: () => void,
) => {
  const params = {
    ...currentRowChild,
    ...data,
  };
  const res = await editTestModuleCases(params);
  if (res?.status === '00000') {
    notifyInfoTip('测试用例', '编辑', true);
    onCancelModal();
  } else {
    notifyInfoTip('测试用例', '编辑', false, res.message);
  }
};
const CreateChildTest: React.FC<CreateDictionaryPropsType> = (props) => {
  const { modalVisible, onCancelModal, modalTitleVisible, currentRowChild } = props;
  const [testCases, setTestCases] = useState<TestCasesParams[]>([]);

  const [form] = Form.useForm();

  const modalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisible) {
        addTestModuleCase(data, currentRowChild, onCancelModal);
      } else {
        editTestModuleCase(data, currentRowChild, onCancelModal);
      }
    });
  };

  useEffect(() => {
    form.resetFields();
    getAllTestCase(setTestCases);
    form.setFieldsValue(currentRowChild);
  }, [currentRowChild]);

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleVisible ? '新增' : '编辑'}项目`}
      visible={modalVisible}
      onCancel={onCancelModal}
      onOk={modalOk}
    >
      <Form {...formLayout} form={form}>
        {modalVisible && modalTitleVisible && (
          <Form.Item
            name="case_id"
            label="测试用例"
            rules={[{ required: true, message: '请选择测试用例' }]}
          >
            <Select placeholder="请选择测试用例" mode="multiple">
              {testCases &&
                testCases.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        )}
        {modalVisible && !modalTitleVisible && (
          <Form.Item
            name="case_id"
            label="测试用例"
            rules={[{ required: true, message: '请选择测试用例' }]}
          >
            <Select placeholder="请选择测试用例">
              {testCases &&
                testCases.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChildTest;
