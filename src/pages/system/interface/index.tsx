import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Switch, Modal } from 'antd';
import {
  getAllInterfaces,
  getWathchButtonStatus,
  enabledWatchBtn,
  clearUpInterfaceLogs,
} from '@/services/system/interface/index';
import { notifyInfoTip } from '@/utils/utils';
import WatchList from './components/WatchList';
import WatchParams from './components/WatchParams';

interface TableRequestParams {
  current?: number;
  pageSize?: number;
}

interface WatchParamsProps {
  params?: string;
  method?: string;
  interface_name?: string;
  created_time?: string;
}

const filterRestParams = (rest: TableRequestParams) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });

  return info;
};

const getAllInterfaceLog = async (params: TableRequestParams) => {
  const { current, pageSize: size, ...rest } = params;
  const result = {
    data: [],
    total: 0,
  };
  const restFilters = filterRestParams(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    ...restFilters,
  };
  const res = await getAllInterfaces(info);
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

// 清空记录
const clearInterfaceAlllogs = async () => {
  const res = await clearUpInterfaceLogs();
  if (res?.status === '00000') {
    notifyInfoTip('接口日志记录', '清空', true);
  } else {
    notifyInfoTip('接口日志记录', '清空', false, res.message);
  }
};

// 获取监听状态
const getWathchBtnState = async (setWatchBtnState: (data: boolean) => void) => {
  const res = await getWathchButtonStatus();
  if (res?.status === '00000') {
    const { enabled } = res.data;
    setWatchBtnState(enabled);
  }
};

// 更改监听状态
const changeWatchBtn = async (enabled: boolean, setWatchBtnState: (data: boolean) => void) => {
  const res = await enabledWatchBtn({ enabled });
  if (res?.status === '00000') {
    notifyInfoTip('监听', `${enabled ? '启用' : '停用'}`, true);
    setWatchBtnState(enabled);
  } else {
    notifyInfoTip('监听', `${enabled ? '启用' : '停用'}`, false, res.message);
  }
};

const InterfaceLog: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [watchBtnState, setWatchBtnState] = useState<boolean>(false);
  const [modalWhVisiable, setModalWhVisiable] = useState<boolean>(false);
  const [modalParamsVisible, setModalParamsVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<WatchParamsProps>({
    params: '',
    method: '',
    interface_name: '',
    created_time: '',
  });

  useEffect(() => {
    getWathchBtnState(setWatchBtnState);
  }, []);

  const columns: ProColumns<{}>[] = [
    {
      title: '序',
      dataIndex: '_sort',
      width: 80,
      search: false,
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      width: 100,
    },
    {
      title: '接口名',
      dataIndex: 'interface_name',
      width: 300,
    },
    {
      title: '参数',
      dataIndex: 'params',
      renderText: (text) => <div style={{ wordBreak: 'break-all' }}>{text}</div>,
      search: false,
    },
    {
      title: '调用时间',
      dataIndex: 'created_time',
      width: 200,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 50,
      render: (_, row) => {
        return (
          <Button
            key="see_result"
            type="link"
            style={{ paddingLeft: '0px' }}
            onClick={() => {
              setCurrentRow(row);
              setModalParamsVisible(true);
            }}
          >
            查看
          </Button>
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
          <span key="watch_label">监听：</span>,
          <Switch
            key="watchBtn"
            checked={watchBtnState}
            checkedChildren="启用"
            unCheckedChildren="停用"
            onChange={(value) => changeWatchBtn(value, setWatchBtnState)}
          />,
          <Button
            key="watch_name"
            type="primary"
            onClick={() => {
              setModalWhVisiable(true);
            }}
          >
            监听名单
          </Button>,
          <Button
            key="cleanr_log"
            type="primary"
            danger
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: '是否清除所有记录？',
                onOk() {
                  clearInterfaceAlllogs();
                },
              });
            }}
          >
            清空记录
          </Button>,
        ]}
        request={(params) => getAllInterfaceLog(params)}
      />
      <WatchList
        modalWathchVisiable={modalWhVisiable}
        onWatchModalCancel={() => {
          setModalWhVisiable(false);
        }}
      />
      <WatchParams
        modalParamsVisible={modalParamsVisible}
        currentRow={currentRow}
        onModalParamsVisable={() => {
          setModalParamsVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default InterfaceLog;
