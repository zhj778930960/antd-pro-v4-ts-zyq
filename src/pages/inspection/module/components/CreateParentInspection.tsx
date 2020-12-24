import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select } from 'antd';
import {
  addInspectionModules,
  editInspectionModules,
  getAllInspectionModules,
} from '@/services/inspection/module/index';
import {
  AddInspectionModule,
  InspectionModuleDataType,
} from '@/services/inspection/module/index.d';
import { notifyInfoTip } from '@/utils/utils';

const { Option } = Select;
interface CreateDictionaryPropsType {
  modalVisible: boolean;
  modalTitleVisible: boolean;
  currentRow: InspectionModuleDataType;
  onCancelModal: () => void;
}

interface TreeDataParams {
  name: string;
  id: string;
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
const addInspectionModule = async (data: AddInspectionModule, onCancelModal: () => void) => {
  const res = await addInspectionModules(data);
  if (res?.status === '00000') {
    notifyInfoTip('检查模块', '新增', true);
    onCancelModal();
  } else {
    notifyInfoTip('检查模块', '新增', false, res.message);
  }
};

// 编辑
const editInspectionModule = async (
  data: AddInspectionModule,
  currentRow: InspectionModuleDataType,
  onCancelModal: () => void,
  checkedTreeId?: string,
) => {
  const params = {
    ...currentRow,
    ...data,
    parent_id: checkedTreeId,
  };
  const res = await editInspectionModules(params);
  if (res?.status === '00000') {
    notifyInfoTip('检查模块', '编辑', true);
    onCancelModal();
  } else {
    notifyInfoTip('检查模块', '编辑', false, res.message);
  }
};

const getAllInspectionModule = async (setUpperModuleData: (data: TreeDataParams[]) => void) => {
  const res = await getAllInspectionModules({
    list_style: 'tree',
  });
  if (res.status === '00000') {
    setUpperModuleData(res.data);
  }
};

const CreateParentInspection: React.FC<CreateDictionaryPropsType> = (props) => {
  const { modalVisible, onCancelModal, modalTitleVisible, currentRow } = props;
  const [upperModuleData, setUpperModuleData] = useState<TreeDataParams[]>([]);
  const [form] = Form.useForm();

  const modalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisible) {
        addInspectionModule(data, onCancelModal);
      } else {
        editInspectionModule(data, currentRow, onCancelModal);
      }
    });
  };

  useEffect(() => {
    form.resetFields();
    getAllInspectionModule(setUpperModuleData);
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleVisible ? '新增' : '编辑'}模块`}
      visible={modalVisible}
      onCancel={onCancelModal}
      onOk={modalOk}
    >
      <Form {...formLayout} form={form} initialValues={{ sort: 999 }}>
        <Form.Item name="parent_id" label="上级模块">
          <Select placeholder="请选择上级模块">
            {upperModuleData &&
              upperModuleData.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="模块名称"
          rules={[{ required: true, message: '请输入模块名称' }]}
        >
          <Input placeholder="请输入模块名称" />
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" min={1} />
        </Form.Item>
        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateParentInspection;
