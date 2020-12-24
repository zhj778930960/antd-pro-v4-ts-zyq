import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, Button, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { getTransactions } from '@/services/task/transaction/index';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getAllChildren } from '@/services/system/dictionary/index';
import { CurrentRowParams, AddInspecntionItem } from '@/services/inspection/item/index.d';
import { addInspectionItems, editInspectionItems } from '@/services/inspection/item/index';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';

const { Option } = Select;
const { TextArea, Search } = Input;

interface CreateInspectionItemProps {
  modalTitleVisiable: boolean;
  modalVisiable: boolean;
  currentRow: CurrentRowParams;
  onModalCancel: () => void;
}

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

interface TransactionParams {
  id: string;
  name: string;
}
const formLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

const getTransaction = async (setTransactionList: (data: TransactionParams[]) => void) => {
  const res = await getTransactions({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setTransactionList(res.data);
  }
};

// 跳转到对应的文档地址
const onDocUrlSearch = (durl: string) => {
  if (durl) {
    window.open(durl, 'target');
  }
};

// 获取字典项 inspection_item_param_type 检查项目参数类型
const getPackageBuildType = async (
  setInspectionItemParamTypes: (data: DictionaryDataParams[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'inspection_item_param_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setInspectionItemParamTypes(res.data);
  }
};

const addInspectionItem = async (data: AddInspecntionItem, onModalCancel: () => void) => {
  const res = await addInspectionItems(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('检查项目', '新增', true);
  } else {
    notifyInfoTip('检查项目', '新增', false, res.message);
  }
};

const editInspectionItem = async (data: AddInspecntionItem, onModalCancel: () => void) => {
  const res = await editInspectionItems(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('检查项目', '编辑', true);
  } else {
    notifyInfoTip('检查项目', '编辑', false, res.message);
  }
};

const CreateInspectionItem: React.FC<CreateInspectionItemProps> = (props) => {
  const { modalTitleVisiable, modalVisiable, currentRow, onModalCancel } = props;
  const [transactionList, setTransactionList] = useState<TransactionParams[]>([]);
  const [inspectionItemParamTypes, setInspectionItemParamTypes] = useState<DictionaryDataParams[]>(
    [],
  );
  const [paramsState, setParamsState] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    getPackageBuildType(setInspectionItemParamTypes);
    getTransaction(setTransactionList);
    form.setFieldsValue(currentRow);
  }, [currentRow]);

  const onModalOk = () => {
    form.validateFields().then((data) => {
      const info = JSON.parse(JSON.stringify(data));
      info.params = JSON.stringify(info.params);
      info.enabled = info.enabled ? 1 : 2;
      if (modalTitleVisiable) {
        addInspectionItem(info, onModalCancel);
      } else {
        const params = {
          ...currentRow,
          ...info,
        };
        editInspectionItem(params, onModalCancel);
      }
    });
  };
  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新增' : '编辑'}项目`}
      width={800}
      onOk={onModalOk}
      onCancel={onModalCancel}
    >
      <Form {...formLayout} form={form} initialValues={{ sort: 999 }}>
        <Form.Item
          name="name"
          label="项目名称"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          name="label"
          label="标识"
          rules={[{ required: true, message: '请输入检查项标识' }]}
        >
          <Input placeholder="请输入检查项标识" />
        </Form.Item>
        <Form.Item
          name="transaction_id"
          label="事务"
          rules={[{ required: true, message: '请输入事务' }]}
        >
          <Select placeholder="请选择事务" allowClear>
            {transactionList &&
              transactionList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="doc_url" label="文档">
          <Search placeholder="请输入文档地址" onSearch={onDocUrlSearch} />
        </Form.Item>
        <Form.Item label="参数" name="params" rules={[{ required: paramsState }]}>
          <Form.List name="params">
            {(fields, { add, remove }) => (
              <>
                {fields &&
                  fields.map((field) => (
                    <Space align="baseline" key={field.key}>
                      <Form.Item
                        name={[field.name, 'key']}
                        fieldKey={[field.fieldKey, 'key']}
                        rules={[{ required: true, message: '请输入属性' }]}
                      >
                        <Input placeholder="请输入属性" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'type']}
                        fieldKey={[field.fieldKey, 'type']}
                        rules={[{ required: true, message: '请选择值类型' }]}
                      >
                        <Select placeholder="请选择" style={{ width: '100px' }}>
                          {inspectionItemParamTypes &&
                            inspectionItemParamTypes.map((item) => (
                              <Option key={item.id} value={item.value}>
                                {item.label}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                      {form.getFieldValue('params')[field.key].type === '1' && (
                        <Form.Item
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'value']}
                          rules={[{ required: true, message: '请输入值' }]}
                        >
                          <Input placeholder="请输入值" />
                        </Form.Item>
                      )}
                      {form.getFieldValue('params')[field.key].type === '2' && (
                        <Form.Item
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'value']}
                          rules={[{ required: true, message: '请输入值' }]}
                        >
                          <InputNumber placeholder="请输入值" />
                        </Form.Item>
                      )}
                      {form.getFieldValue('params')[field.key].type === '3' && (
                        <Form.Item
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'value']}
                          rules={[{ required: true, message: '请选择值' }]}
                          valuePropName="checked"
                        >
                          <Switch checkedChildren="True" unCheckedChildren="False" defaultChecked />
                        </Form.Item>
                      )}
                      {form.getFieldValue('params')[field.key].type === '4' && (
                        <Form.Item
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'value']}
                          rules={[{ required: true, message: '请选择值' }]}
                        >
                          <Input placeholder="以逗号分割" />
                        </Form.Item>
                      )}
                      <Form.Item name={[field.name, 'desc']} fieldKey={[field.fieldKey, 'key']}>
                        <Input placeholder="请输入描述" />
                      </Form.Item>
                      <MinusCircleOutlined
                        className={styles.delColor}
                        onClick={() => {
                          remove(field.name);
                          const state = form.getFieldValue('params').length !== 0;
                          setParamsState(state);
                        }}
                      />
                    </Space>
                  ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    setParamsState(true);
                    add({
                      key: undefined,
                      type: '1',
                      value: undefined,
                      desc: undefined,
                    });
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  增加
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" min={1} />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <TextArea placeholder="请输入说明" rows={4} />
        </Form.Item>
        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateInspectionItem;
