import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { getAllChildren } from '@/services/system/dictionary/index';
import { Select, Button, Switch } from 'antd';
import { getTransactions, editTransactions } from '@/services/task/transaction/index';
import { filterDictionaries, notifyInfoTip } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import { AddTransactionsParams } from '@/services/task/transaction/index.d';
import CreateTransaction from './components/CreateTransaction';

const { Option } = Select;
interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

interface GetTransationsParams {
  current?: number;
  pageSize?: number;
}

// 获取事务类型字典项trans_type

const getAllChildrenTransType = async (setTransTypes: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'trans_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setTransTypes(res.data);
  }
};

const filterRest = (rest: GetTransationsParams) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });

  return info;
};

// 获取事务列表
const getTransaction = async (params: GetTransationsParams) => {
  const { current, pageSize: size, ...rest } = params;
  const restInfo = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...restInfo,
  };
  const res = await getTransactions(info);
  const result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    Object.assign(result, {
      data: list,
      total,
      success: true,
    });
  }
  return result;
};

const editTransaction = async (
  data: AddTransactionsParams,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await editTransactions(data);
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('事务', '编辑', true);
  } else {
    notifyInfoTip('事务', '编辑', false, res.message);
  }
};

const changeEnabled = (
  e: boolean,
  row: AddTransactionsParams,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const params = {
    ...row,
    enabled: e,
  };
  editTransaction(params, actionRef);
};

const Transaction: React.FC<{}> = () => {
  const defaultForm = {
    description: undefined,
    doc_url: undefined,
    enabled: true,
    jenkins_scripts_branch: undefined,
    label: undefined,
    name: '',
    sort: 999,
    type: undefined,
  };
  const actionRef = useRef<ActionType>();
  const [transTypes, setTransTypes] = useState<DictionaryDataParams[]>([]);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<AddTransactionsParams>(defaultForm);
  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };
  useEffect(() => {
    getAllChildrenTransType(setTransTypes);
  }, []);

  const columns: ProColumnType<AddTransactionsParams>[] = [
    {
      title: '事务名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '事务标识',
      dataIndex: 'label',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            {transTypes &&
              transTypes.map((item) => (
                <Option value={item.value} key={item.id}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      },
      renderText: (text) => <span>{filterDictionaries(String(text), transTypes)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (_, row) => (
        <Switch
          checked={row.enabled}
          unCheckedChildren="停用"
          checkedChildren="启用"
          onChange={(e) => changeEnabled(e, row, actionRef)}
        />
      ),
      search: false,
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 50,
      render: (_, row) => {
        return (
          <Button
            style={{ paddingLeft: '0px' }}
            type="link"
            size="small"
            key="ediBtn"
            onClick={() => {
              const params = JSON.parse(JSON.stringify(row));
              params.type = String(params.type);
              setCurrentRow(params);
              setModalTitleVisiable(false);
              setModalVisiable(true);
            }}
          >
            编辑
          </Button>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="addBtn"
            type="primary"
            onClick={() => {
              setCurrentRow(defaultForm);
              setModalTitleVisiable(true);
              setModalVisiable(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        request={(params) => getTransaction(params)}
      />
      <CreateTransaction
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        transTypes={transTypes}
        currentRow={currentRow}
        onModalCancel={onModalCancel}
      />
    </PageContainer>
  );
};

export default Transaction;
