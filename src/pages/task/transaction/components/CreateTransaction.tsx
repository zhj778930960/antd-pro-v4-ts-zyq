import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Select, InputNumber } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { getJenkinsScriptBranches } from '@/services/project/repository/index';
import { addTransactions, editTransactions } from '@/services/task/transaction/index';
import { AddTransactionsParams } from '@/services/task/transaction/index.d';
import { notifyInfoTip } from '@/utils/utils';

const { Search, TextArea } = Input;
const { Option } = Select;

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}
interface CreateTransactionProp {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  transTypes: DictionaryDataParams[];
  currentRow: AddTransactionsParams;
  onModalCancel: () => void;
}

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

// 获取JK 脚本分支
const getJenkinsScriptBranche = async (setJenkensScripts: (data: string[]) => void) => {
  const res = await getJenkinsScriptBranches();
  if (res?.status === '00000') {
    setJenkensScripts(res.data);
  }
};

const addTransaction = async (data: AddTransactionsParams, onModalCancel: () => void) => {
  const res = await addTransactions(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('事务', '新增', true);
  } else {
    notifyInfoTip('事务', '新增', false, res.message);
  }
};

const editTransaction = async (data: AddTransactionsParams, onModalCancel: () => void) => {
  const res = await editTransactions(data);
  if (res?.status === '00000') {
    onModalCancel();
    notifyInfoTip('事务', '编辑', true);
  } else {
    notifyInfoTip('事务', '编辑', false, res.message);
  }
};

// 跳转到对应的文档地址
const onDocUrlSearch = (durl: string) => {
  if (durl) {
    window.open(durl, 'target');
  }
};

const CreateTransaction: React.FC<CreateTransactionProp> = (props) => {
  const { modalTitleVisiable, modalVisiable, transTypes, currentRow, onModalCancel } = props;
  const [form] = useForm();
  const [jenkensScripts, setJenkensScripts] = useState<string[]>([]);

  useEffect(() => {
    form.setFieldsValue(currentRow);
    getJenkinsScriptBranche(setJenkensScripts);
  }, [currentRow]);

  const onModalOk = () => {
    form.validateFields().then((data) => {
      if (modalTitleVisiable) {
        addTransaction(data, onModalCancel);
      } else {
        const info = {
          ...currentRow,
          ...data,
        };
        editTransaction(info, onModalCancel);
      }
    });
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleVisiable ? '新增' : '编辑'}事务`}
      visible={modalVisiable}
      onOk={onModalOk}
      onCancel={onModalCancel}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label="事务名称"
          rules={[{ required: true, message: '请输入事务名称' }]}
        >
          <Input placeholder="请输入事务名称" />
        </Form.Item>
        <Form.Item
          name="label"
          label="事务标识"
          rules={[{ required: true, message: '请输入事务标识' }]}
        >
          <Input placeholder="请输入事务标识" disabled={!modalTitleVisiable} />
        </Form.Item>
        <Form.Item name="doc_url" label="文档地址">
          <Search placeholder="请输入文档地址" onSearch={onDocUrlSearch} />
        </Form.Item>
        <Form.Item
          name="jenkins_scripts_branch"
          label="脚本分支"
          rules={[{ required: true, message: '请选择脚本分支' }]}
        >
          <Select placeholder="请选择脚本分支">
            {jenkensScripts &&
              jenkensScripts.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
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
          <InputNumber min={1} placeholder="排序值" />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <TextArea rows={4} placeholder="请输入说明信息" />
        </Form.Item>
        <Form.Item name="enabled" label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTransaction;
