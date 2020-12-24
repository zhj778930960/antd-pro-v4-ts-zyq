import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Select, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { getAllTestCases } from '@/services/autotest/case/index';
import { getAllTestModules } from '@/services/autotest/module/index';
import { addChilrens, editChilrens } from '@/services/autotest/test/index';
import { AddTestChilds } from '@/services/autotest/test/index.d';
import { myContext } from '@/utils/commonContext';
import {
  addTaskTemTaskChilrens,
  editTaskTemTaskChilrens,
} from '@/services/task/taskTemplateDetail/index';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
interface CurrentRowParams {
  id?: string;
  type?: string;
  content_id?: string[];
}
interface TestCreateProps {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  currentRow: CurrentRowParams;
  onModalCancel: () => void;
}

interface TestCasesParams {
  name: string;
  id: string;
}

interface TestModulesParams {
  name: string;
  id: string;
}

const getTestCases = async (setTestCases: (data: TestCasesParams[]) => void) => {
  const res = await getAllTestCases({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setTestCases(res.data);
  }
};

const getTestModules = async (setTestModules: (data: TestCasesParams[]) => void) => {
  const res = await getAllTestModules({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setTestModules(res.data);
  }
};

// 过滤出对应的项目或者模块的name
const filterInpspectonChildName = (
  id: string,
  inspectionItems: TestCasesParams[],
  inspectionModules: TestModulesParams[],
  type?: string,
): string => {
  let name = '';
  if (type === '4') {
    inspectionItems.forEach((item) => {
      if (item.id === id) {
        name = item.name;
      }
    });
  }

  if (type === '3') {
    inspectionModules.forEach((item) => {
      if (item.id === id) {
        name = item.name;
      }
    });
  }
  return name;
};

// 处理新增时的数据
const dealWithChildData = (
  data: CurrentRowParams,
  currentId: string,
  inspectionItems: TestCasesParams[],
  inspectionModules: TestModulesParams[],
) => {
  const { content_id, type } = data;
  const arr =
    content_id &&
    content_id.map((item) => {
      return {
        content_id: item,
        content_type: '3',
        name: filterInpspectonChildName(item, inspectionItems, inspectionModules, type),
        parent_id: currentId,
        type,
      };
    });
  return arr ?? [];
};

// 新增
const addTestChild = async (data: AddTestChilds[], caller: string, onModalCancel: () => void) => {
  const res =
    caller === 'executionDetail' ? await addChilrens(data) : await addTaskTemTaskChilrens(data);
  if (res?.status === '00000') {
    notifyInfoTip('测试用例', '新增', true);
    onModalCancel();
  } else {
    notifyInfoTip('测试用例', '新增', false, res.message);
  }
};

// 编辑
const editTestChild = async (data: AddTestChilds, caller: string, onModalCancel: () => void) => {
  const res =
    caller === 'executionDetail' ? await editChilrens(data) : await editTaskTemTaskChilrens(data);
  if (res?.status === '00000') {
    notifyInfoTip('测试用例', '编辑', true);
    onModalCancel();
  } else {
    notifyInfoTip('测试用例', '编辑', false, res.message);
  }
};

const TestCreate: React.FC<TestCreateProps> = (props) => {
  const { modalVisiable, modalTitleVisiable, currentRow, onModalCancel } = props;
  const [currentType, setCurrentType] = useState<string>('4');
  const [testCases, setTestCases] = useState<TestCasesParams[]>([]);
  const [testModules, setTestModules] = useState<TestModulesParams[]>([]);
  const [form] = useForm();
  const { currentId, caller }: any = useContext(myContext);
  const changeType = (e: any) => {
    form.setFieldsValue({
      content_id: modalVisiable && modalTitleVisiable ? [] : undefined,
    });
    setCurrentType(e.target.value);
  };

  const onModalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisiable) {
        const params = dealWithChildData(data, currentId, testCases, testModules);
        addTestChild(params, caller, onModalCancel);
      } else {
        const params = {
          id: currentRow.id,
          name: filterInpspectonChildName(data.content_id, testCases, testModules, data.type),
          parent_id: currentId,
          content_type: '3',
          ...data,
        };
        editTestChild(params, caller, onModalCancel);
      }
    });
  };
  useEffect(() => {
    form.setFieldsValue(currentRow);
    setCurrentType(currentRow.type ?? '');
    getTestCases(setTestCases);
    getTestModules(setTestModules);
  }, [currentRow]);
  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新增' : '编辑'}任务内容`}
      onOk={onModalOk}
      onCancel={onModalCancel}
    >
      <Form {...formLayout} form={form}>
        <Form.Item name="type" label="检查内容">
          <Radio.Group onChange={changeType}>
            <Radio value="4">用例</Radio>
            <Radio value="3">模块</Radio>
          </Radio.Group>
        </Form.Item>
        {currentType === '4' && (
          <Form.Item
            name="content_id"
            label="用例"
            colon={false}
            rules={[{ required: true, message: '请选择测试用例' }]}
          >
            <Select
              mode={modalVisiable && modalTitleVisiable ? 'multiple' : undefined}
              placeholder="请选择测试用例"
            >
              {testCases &&
                testCases.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        )}
        {currentType === '3' && (
          <Form.Item
            name="content_id"
            label="模块"
            colon={false}
            rules={[{ required: true, message: '请选择测试模块' }]}
          >
            <Select
              mode={modalVisiable && modalTitleVisiable ? 'multiple' : undefined}
              placeholder="请选择测试模块"
            >
              {testModules &&
                testModules.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default TestCreate;
