import React, { useState, useRef, MutableRefObject } from 'react';
import { Button, Popconfirm, Select, Switch } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { getAllInspectionItems } from '@/services/inspection/item';
import { PlusOutlined } from '@ant-design/icons';
import { CurrentRowParams } from '@/services/inspection/item/index.d';
import { editInspectionItems, delInspectionItems } from '@/services/inspection/item/index';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import CreateInspectionItem from './components/CreateInspectionItem';

const { Option } = Select;
interface InspectionItemTableColunms {
  id: string;
  name: string;
  enabled: number;
  sort: number;
  updated_time: string;
  params: string;
}

interface GetAllParamsType {
  current?: number;
  pageSize?: number;
}

const filterRest = (rest: GetAllParamsType) => {
  const restObj: GetAllParamsType = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};

const getAllInspectionItem = async (params: GetAllParamsType) => {
  const { current, pageSize: size, ...rest } = params;
  const info = filterRest(rest);
  const reqInfo = {
    page: current ? current - 1 : 0,
    size,
    sort: 'sort,asc',
    ...info,
  };
  const res = await getAllInspectionItems(reqInfo);
  const result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    Object.assign(result, {
      data: list,
      total,
    });
  }
  return result;
};

const changeSwitch = async (
  bool: boolean,
  row: InspectionItemTableColunms,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const info = {
    ...row,
    enabled: bool ? 1 : 2,
  };
  const res = await editInspectionItems(info);
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('检查项目', '编辑', true);
  } else {
    notifyInfoTip('检查项目', '编辑', false, res.message);
  }
};

const delInspectionItem = async (
  id: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delInspectionItems({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('检查项目', '删除', true);
  } else {
    notifyInfoTip('检查项目', '删除', false, res.message);
  }
};

const InspectionItems: React.FC<{}> = () => {
  const defaultForm = {
    name: undefined,
    label: undefined,
    transaction_id: undefined,
    doc_url: undefined,
    sort: 999,
    description: undefined,
    enabled: true,
    params: [],
  };
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<InspectionItemTableColunms>[] = [
    {
      title: '项目名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            <Option key={1} value="true">
              启用
            </Option>
            <Option key={2} value="false">
              停用
            </Option>
          </Select>
        );
      },
      render: (_, row) => {
        return (
          <Switch
            unCheckedChildren="停用"
            checked={row.enabled === 1}
            checkedChildren="启用"
            onChange={(e) => changeSwitch(e, row, actionRef)}
          />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="edit"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                const info = JSON.parse(JSON.stringify(row));
                info.params = JSON.parse(info.params);
                info.enabled = info.enabled === 1;
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={`d${row.id}`}
              title={
                <div>
                  是否<span className={styles.delColor}>删除</span>检查项目
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onConfirm={() => delInspectionItem(row.id, actionRef)}
            >
              <Button type="link" key="deleteButton" size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="createBtn"
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
        request={(params) => getAllInspectionItem(params)}
      />
      <CreateInspectionItem
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        currentRow={currentRow}
        onModalCancel={onModalCancel}
      />
    </PageContainer>
  );
};

export default InspectionItems;
