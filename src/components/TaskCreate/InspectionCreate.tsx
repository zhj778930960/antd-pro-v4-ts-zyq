import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Select, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { getAllInspectionItems } from '@/services/inspection/item/index';
import { getAllInspectionModules } from '@/services/inspection/module/index';
import { addChilrens, editChilrens } from '@/services/inspection/inspection/index';
import { AddInspectionChilds } from '@/services/inspection/inspection/index.d';
import { myContext } from '@/utils/commonContext';
import {
  addTaskTemTaskChilrens,
  editTaskTemTaskChilrens,
} from '@/services/task/taskTemplateDetail/index';
import { notifyInfoTip } from '@/utils/utils';

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
interface InspectionCreateProps {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  currentRow: CurrentRowParams;
  onModalCancel: () => void;
}

interface InspectionItemsParams {
  name: string;
  id: string;
}

interface InspectionModulesParams {
  name: string;
  id: string;
}

const { Option } = Select;

const getInspectionItems = async (setInspectionItems: (data: InspectionItemsParams[]) => void) => {
  const res = await getAllInspectionItems({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setInspectionItems(res.data);
  }
};

const getInspectionModules = async (
  setInspectionModules: (data: InspectionItemsParams[]) => void,
) => {
  const res = await getAllInspectionModules({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setInspectionModules(res.data);
  }
};

// 过滤出对应的项目或者模块的name
const filterInpspectonChildName = (
  id: string,
  inspectionItems: InspectionItemsParams[],
  inspectionModules: InspectionModulesParams[],
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
  inspectionItems: InspectionItemsParams[],
  inspectionModules: InspectionModulesParams[],
) => {
  const { content_id, type } = data;
  const arr =
    content_id &&
    content_id.map((item) => {
      return {
        content_id: item,
        content_type: '1',
        name: filterInpspectonChildName(item, inspectionItems, inspectionModules, type),
        parent_id: currentId,
        type,
      };
    });
  return arr ?? [];
};

// 新增
const addInspectionChild = async (
  data: AddInspectionChilds[],
  caller: string,
  onModalCancel: () => void,
) => {
  const res =
    caller === 'executionDetail' ? await addChilrens(data) : await addTaskTemTaskChilrens(data);
  if (res?.status === '00000') {
    notifyInfoTip('检查项目', '新增', true);
    onModalCancel();
  } else {
    notifyInfoTip('检查项目', '新增', false, res.message);
  }
};

// 编辑
const editTestChild = async (
  data: AddInspectionChilds,
  caller: string,
  onModalCancel: () => void,
) => {
  const res =
    caller === 'executionDetail' ? await editChilrens(data) : await editTaskTemTaskChilrens(data);
  if (res?.status === '00000') {
    notifyInfoTip('检查项目', '编辑', true);
    onModalCancel();
  } else {
    notifyInfoTip('检查项目', '编辑', false, res.message);
  }
};

const InspectionCreate: React.FC<InspectionCreateProps> = (props) => {
  const { modalVisiable, modalTitleVisiable, currentRow, onModalCancel } = props;
  const [currentType, setCurrentType] = useState<string>('4');
  const [inspectionItems, setInspectionItems] = useState<InspectionItemsParams[]>([]);
  const [inspectionModules, setInspectionModules] = useState<InspectionModulesParams[]>([]);
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
        const params = dealWithChildData(data, currentId, inspectionItems, inspectionModules);
        addInspectionChild(params, caller, onModalCancel);
      } else {
        const params = {
          id: currentRow.id,
          name: filterInpspectonChildName(
            data.content_id,
            inspectionItems,
            inspectionModules,
            data.type,
          ),
          parent_id: currentId,
          content_type: '1',
          ...data,
        };
        editTestChild(params, caller, onModalCancel);
      }
    });
  };
  useEffect(() => {
    form.setFieldsValue(currentRow);
    setCurrentType(currentRow.type ?? '');
    getInspectionItems(setInspectionItems);
    getInspectionModules(setInspectionModules);
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
            <Radio value="4">项目</Radio>
            <Radio value="3">模块</Radio>
          </Radio.Group>
        </Form.Item>
        {currentType === '4' && (
          <Form.Item
            name="content_id"
            label="项目"
            colon={false}
            rules={[{ required: true, message: '请选择检查项' }]}
          >
            <Select
              mode={modalTitleVisiable && modalVisiable ? 'multiple' : undefined}
              placeholder="请选择检查项"
            >
              {inspectionItems &&
                inspectionItems.map((item) => (
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
            rules={[{ required: true, message: '请选择检查模块' }]}
          >
            <Select
              mode={modalTitleVisiable && modalVisiable ? 'multiple' : undefined}
              placeholder="请选择检查模块"
            >
              {inspectionModules &&
                inspectionModules.map((item) => (
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

export default InspectionCreate;
