import React, { useState, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, Switch } from 'antd';
import {
  getAutotestDivices,
  delAutotestDivices,
  editAutotestDivices,
} from '@/services/autotest/device/index';
import { PlusOutlined } from '@ant-design/icons';
import { CurrentRowParams } from '@/services/autotest/device/index.d';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';
import CreateDevice from './components/CreateDevice';

interface GetDivicesParams {
  current?: number;
  pageSize?: number;
}

interface AutotestDeviceColunm {
  brand: string;
  enabled: number;
  id: string;
  model: string;
  notes: string;
  remote_address: string;
  udid: string;
  updated_time: string;
}

const filterRest = (rest: GetDivicesParams) => {
  const restObj: GetDivicesParams = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};

const getAutotestDivice = async (params: GetDivicesParams) => {
  const { current, pageSize: size, ...rest } = params;
  const info = filterRest(rest);
  const reqInfo = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...info,
  };
  const res = await getAutotestDivices(reqInfo);

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

const delDevice = async (ids: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await delAutotestDivices({ id: [ids] });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('设备', '删除', true);
  } else {
    notifyInfoTip('设备', '删除', false, res.message);
  }
};

const changeSwitch = async (
  bool: boolean,
  row: AutotestDeviceColunm,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const params = {
    ...row,
    enabled: bool ? 1 : 2,
  };
  const res = await editAutotestDivices(params);
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('设备', `${bool ? '启用' : '停用'}`, true);
  } else {
    notifyInfoTip('设备', `${bool ? '启用' : '停用'}`, false, res.message);
  }
};

const AutotestDevice: React.FC<{}> = () => {
  const defaultForm = {
    udid: undefined,
    brand: undefined,
    model: undefined,
    remote_address: undefined,
    notes: undefined,
    enabled: true,
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

  const columns: ProColumnType<AutotestDeviceColunm>[] = [
    {
      title: '设备编号',
      dataIndex: 'udid',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '远程连接',
      dataIndex: 'remote_address',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      search: false,
      render: (_, row) => {
        return (
          <Switch
            unCheckedChildren="停用"
            checkedChildren="启用"
            checked={row.enabled === 1}
            onChange={(bool) => changeSwitch(bool, row, actionRef)}
          />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
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
                  是否<span className={styles.delColor}>删除</span>设备
                  <span
                    className={styles.delColor}
                  >{`${row.brand} | ${row.model} | ${row.udid}`}</span>{' '}
                  ?
                </div>
              }
              onConfirm={() => delDevice(row.id, actionRef)}
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
        columns={columns}
        rowKey="id"
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
        request={(params) => getAutotestDivice(params)}
      />
      <CreateDevice
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        currentRow={currentRow}
        onModalCancel={onModalCancel}
      />
    </PageContainer>
  );
};

export default AutotestDevice;
