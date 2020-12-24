import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import { InspectionModuleDataType } from '@/services/inspection/module/index.d';
import { getAllInspectionItems } from '@/services/inspection/item/index';
import {
  addInspectionModuleItems,
  editInspectionModuleItems,
} from '@/services/inspection/module/index';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;

interface CreateDictionaryPropsType {
  modalVisible: boolean;
  modalTitleVisible: boolean;
  currentRowChild: InspectionModuleDataType;
  onCancelModal: () => void;
}

interface InspectionItemsParams {
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

const getInspectionItems = async (setInspectionItems: (data: InspectionItemsParams[]) => void) => {
  const res = await getAllInspectionItems({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setInspectionItems(res.data);
  }
};

// 新增
const addInspectionModuleItem = async (
  data: InspectionItemFormParams,
  currentRowChild: InspectionModuleDataType,
  onCancelModal: () => void,
) => {
  const params = {
    module_id: currentRowChild.module_id,
    ...data,
  };
  const res = await addInspectionModuleItems(params);
  if (res?.status === '00000') {
    notifyInfoTip('检查项目', '新增', true);
    onCancelModal();
  } else {
    notifyInfoTip('检查项目', '新增', false, res.message);
  }
};

// 编辑
const editInspectionModuleItem = async (
  data: InspectionItemFormParams,
  currentRowChild: InspectionModuleDataType,
  onCancelModal: () => void,
) => {
  const params = {
    ...currentRowChild,
    ...data,
  };
  const res = await editInspectionModuleItems(params);
  if (res?.status === '00000') {
    notifyInfoTip('检查项目', '编辑', true);
    onCancelModal();
  } else {
    notifyInfoTip('检查项目', '编辑', false, res.message);
  }
};
const CreateChildInspection: React.FC<CreateDictionaryPropsType> = (props) => {
  const { modalVisible, onCancelModal, modalTitleVisible, currentRowChild } = props;
  const [inspectionItems, setInspectionItems] = useState<InspectionItemsParams[]>([]);

  const [form] = Form.useForm();

  const modalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisible) {
        addInspectionModuleItem(data, currentRowChild, onCancelModal);
      } else {
        editInspectionModuleItem(data, currentRowChild, onCancelModal);
      }
    });
  };

  useEffect(() => {
    form.resetFields();
    getInspectionItems(setInspectionItems);
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
        <Form.Item
          name="item_id"
          label="字典标签"
          rules={[{ required: true, message: '请输入字典标签' }]}
        >
          <Select placeholder="请选择检查项">
            {inspectionItems &&
              inspectionItems.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChildInspection;
