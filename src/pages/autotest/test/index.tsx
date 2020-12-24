import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType, ActionType } from '@ant-design/pro-table';
import { getAllChildren } from '@/services/system/dictionary/index';
import { filterDictionaries, parseDuration, notifyInfoTip } from '@/utils/utils';
import { Popover, Button, Select, Popconfirm } from 'antd';
import { getAllTests, delTests, copyTests, executeTests } from '@/services/autotest/test/index';
import { getDeviceLists } from '@/services/autotest/device/index';
import { PlusOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { StatusModelState } from '@/models/status';
import styles from './index.less';
import CreateTest from './components/CreateTest';

const { Option } = Select;
interface DictionariesParamsType {
  label: string;
  id: string;
  value: string;
}

interface GetAllParamsType {
  current?: number;
  pageSize?: number;
}

interface RestItemType {
  name?: string;
  hashes?: string;
}

interface DiviceListsParams {
  id: string;
  brand: string;
  udid: string;
  model: string;
}

interface TestColumnsParams {
  id: string;
  name: string;
  package_url: string;
  updated_time: string;
  device_list: string;
  duration: number;
  origin: number;
  status: number;
  server: string;
  build_type: string;
  airtest_framework_branch: string;
}

interface CurrentRowParams {
  name?: string;
  params: {
    package_url?: string;
    build_type?: string;
    server?: string;
    device_list?: string[];
    airtest_framework_branch?: string;
  };
  id?: string;
}

interface TestProps {
  taskStatus: StatusModelState;
}

// 获取package_build_type 字典项
const getPackageBuildTypeDictionary = async (
  setPackageBuildTypeDict: (data: DictionariesParamsType[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'package_build_type',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setPackageBuildTypeDict(res.data);
  }
};

// 获取task_status 字典项
const getTaskStatusDictionary = async (
  setTaskStatusDict: (data: DictionariesParamsType[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'task_status',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setTaskStatusDict(res.data);
  }
};

// 获取设备列表
const getDeviceList = async (setDeviceList: (data: DiviceListsParams[]) => void) => {
  const res = await getDeviceLists({
    filter: {},
    options: {},
  });
  if (res?.status === '00000') {
    setDeviceList(res.data);
  }
};

/**
 *  去除getUsersList 方法中 rest 输入型参数为空字符串导致搜索有问题
 * @param rest Protable 中 requst 方法传递回来的params
 */
const filterRest = (rest: RestItemType) => {
  const restObj: RestItemType = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};

/**
 *
 * @param list 请求回来的数据，用于判断是否需要开启轮询
 * @param actionRef Table ref 用于reload 表格
 * @param commonTimer 存储定时器用于，开启或者销毁定时器
 */

let commonTimer: number | null = null;
const tablePolling = (
  list: TestColumnsParams[],
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  if (commonTimer) {
    window.clearTimeout(commonTimer as number);
  }
  if (list.length !== 0) {
    const hasExecuteing = list.some((item: TestColumnsParams) => item.status === 1);
    if (hasExecuteing) {
      commonTimer = window.setTimeout(() => {
        actionRef.current?.reload();
      }, 1000 * 5);
    }
  }
};

const getTests = async (
  params: GetAllParamsType,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const { current, pageSize: size, ...rest } = params;
  const restParams = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...restParams,
  };
  const res = await getAllTests(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    tablePolling(list, actionRef);
    result = {
      data: list,
      total,
    };
  }
  return result;
};

// 解析包名
const parsePackageName = (url: string, packageBuildType: DictionariesParamsType[]) => {
  let index = url ? url.lastIndexOf('/') + 1 : 0;
  let packageName = url ? url.substring(index) : '';
  index = packageName.indexOf('.') + 1;
  const extname = packageName.substring(index);
  packageName = packageName.substring(0, index);
  const platform = extname === 'apk' ? '安卓' : '苹果';
  index = packageName.indexOf('_');
  let buildType = packageName.substring(0, index);
  buildType = filterDictionaries(buildType, packageBuildType);
  packageName = packageName.substring(index + 1);
  index = packageName.indexOf('_') + 1;
  const endIndex = packageName.indexOf('_F');
  const branch = packageName.substring(index, endIndex);
  packageName = `${platform}|${buildType}|${branch}`;
  return packageName;
};

/**
 *
 * @param id row id 表格项id
 */
const delTest = async (actionRef: MutableRefObject<ActionType | undefined>, id?: string) => {
  const res = await delTests({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试记录', '删除', true);
  } else {
    notifyInfoTip('测试记录', '删除', false, res.message);
  }
};

/**
 *
 * @param id row id 表格项id
 */

const copyTest = async (actionRef: MutableRefObject<ActionType | undefined>, id?: string) => {
  const res = await copyTests({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试记录', '复制', true);
  } else {
    notifyInfoTip('测试记录', '复制', false, res.message);
  }
};

/**
 *
 * @param id row id 表格项id
 */

const executeTest = async (actionRef: MutableRefObject<ActionType | undefined>, id?: string) => {
  const res = await executeTests({ id });
  if (res?.status === '00000') {
    actionRef.current?.reload();
    notifyInfoTip('测试记录', '执行', true);
  } else {
    notifyInfoTip('测试记录', '执行', false, res.message);
  }
};

/**
 *
 * @param arr 选中的设备uuid字符串
 * @param deviceList 所有的设备列表，用于过滤出设备名称和model
 */

const filterDeviceList = (arr: string, deviceList: DiviceListsParams[]) => {
  if (arr.length === 0 || arr === null) return '';
  const arr1 = arr.split(',');
  const result = deviceList
    .filter((item) => arr1.includes(item.udid))
    .map((item1) => <div key={item1.id}>{`${item1.brand} | ${item1.model} | ${item1.udid}`}</div>);
  return result;
};

const Test: React.FC<TestProps> = (props) => {
  const { taskStatus } = props;
  const defaultForm = {
    name: undefined,
    params: {
      package_url: undefined,
      build_type: undefined,
      server: undefined,
      device_list: undefined,
      airtest_framework_branch: undefined,
    },
  };
  const [packageBuildType, setPackageBuildTypeDict] = useState<DictionariesParamsType[]>([]);
  const [taskStatusDict, setTaskStatusDict] = useState<DictionariesParamsType[]>([]);
  const [deviceList, setDeviceList] = useState<DiviceListsParams[]>([]);
  const [modalTitleVisiable, setModalTitleVisiable] = useState<boolean>(true);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CurrentRowParams>(defaultForm);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    getPackageBuildTypeDictionary(setPackageBuildTypeDict);
    getTaskStatusDictionary(setTaskStatusDict);
    getDeviceList(setDeviceList);
  }, []);

  const onModalCancel = () => {
    setModalTitleVisiable(true);
    setModalVisiable(false);
    actionRef.current?.reload();
  };

  const columns: ProColumnType<TestColumnsParams>[] = [
    {
      title: '标题',
      dataIndex: 'name',
      ellipsis: true,
      render: (_, row) => {
        return (
          <Button
            type="link"
            size="small"
            key="turnto"
            onClick={() => {
              history.push(`/autotest/test/detail/${row.id}`);
            }}
          >
            {row.name}
          </Button>
        );
      },
    },
    {
      title: '测试包名',
      dataIndex: 'package_url',
      renderText: (text) => {
        return (
          <Popover placement="top" content={text} trigger="click">
            <Button type="link" key="pageurlBtn" style={{ padding: 0 }}>
              {parsePackageName(text, packageBuildType)}
            </Button>
          </Popover>
        );
      },
      search: false,
    },
    {
      title: '测试设备',
      dataIndex: 'device_list',
      renderText: (text) => {
        const val = text ? text.split(',').length : 0;
        return (
          <Popover
            placement="top"
            content={filterDeviceList(text ?? '', deviceList)}
            trigger="click"
          >
            <Button
              type="link"
              key="pageurlBtn"
              style={{ padding: 0 }}
              disabled={val === 0}
            >{`${val}台`}</Button>
          </Popover>
        );
      },
      search: false,
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      renderText: (text) => parseDuration(text),
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            {taskStatusDict &&
              taskStatusDict.map((item) => {
                return (
                  <Option key={item.id} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
          </Select>
        );
      },
      valueEnum: taskStatus,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 230,
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="edit"
              size="small"
              disabled={row.status !== -1}
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                const { package_url, build_type, server, airtest_framework_branch, name, id } = row;
                const devLists = row.device_list.split(',');
                const info = {
                  name,
                  id,
                  params: {
                    package_url,
                    build_type,
                    server,
                    device_list: devLists,
                    airtest_framework_branch,
                  },
                };
                setCurrentRow(info);
                setModalTitleVisiable(false);
                setModalVisiable(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              disabled={row.status !== -1}
              key={`z${row.id}`}
              title={
                row.origin === 2 ? (
                  <div>
                    是否<span className={styles.executeRedColor}>执行</span>测试记录{' '}
                    <span className={styles.executeRedColor}>{row.name}</span> ?
                  </div>
                ) : (
                  '此任务由执行记录创建，请跳转至执行记录执行！'
                )
              }
              onConfirm={() => {
                if (row.origin === 2) {
                  executeTest(actionRef, row.id);
                } else {
                  history.push('/task/execution');
                }
              }}
            >
              <Button type="link" key="deleteButton" size="small" disabled={row.status !== -1}>
                执行
              </Button>
            </Popconfirm>
            <Button type="link" key="copy" size="small" onClick={() => copyTest(actionRef, row.id)}>
              复制
            </Button>
            <Button
              type="link"
              key="log"
              size="small"
              disabled={row.status === -1}
              onClick={() => window.open(`/test/log/${row.id}`, '_blank')}
            >
              日志
            </Button>
            <Popconfirm
              trigger="click"
              key={`d${row.id}`}
              disabled={[0, 1].includes(row.status)}
              title={
                <div>
                  是否<span className={styles.delColor}>删除</span>测试记录{' '}
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onConfirm={() => delTest(actionRef, row.id)}
            >
              <Button
                type="link"
                key="deleteButton"
                size="small"
                disabled={[0, 1].includes(row.status)}
              >
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
        actionRef={actionRef}
        rowKey="id"
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
        request={(params) => getTests(params, actionRef)}
      />
      <CreateTest
        modalTitleVisiable={modalTitleVisiable}
        modalVisiable={modalVisiable}
        onModalCancel={onModalCancel}
        currentRow={currentRow}
        caller="executionDetail"
      />
    </PageContainer>
  );
};

export default connect(({ status }: ConnectState) => ({
  taskStatus: status,
}))(Test);
