import React, { useEffect, useState } from 'react';
import { Button, Statistic, Select, Popover, notification, Tooltip } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProTable, { ProColumnType } from '@ant-design/pro-table';
import { getAllChildren } from '@/services/system/dictionary/index';
import { filterDictionaries, parseDuration, downloadFile } from '@/utils/utils';
import { getDeviceLists } from '@/services/autotest/device/index';
import { getChildCases, getTestsDetails } from '@/services/autotest/test/index';
import { getDownloadFile } from '@/services/autotest/testDetail/index';
import { TestContentParams } from '@/services/autotest/testDetail/index.d';
import { getOneDetail } from '@/services/task/executionDetail/index';
import { useParams } from 'umi';
import styles from './index.less';

const { Option } = Select;
const { Divider } = ProCard;

interface DictionariesParamsType {
  label: string;
  id: string;
  value: string;
}

interface StatisticDataParams {
  totalNumbers: number;
  passesNumbers: number;
  failuresNumber: number;
  passingRate: number;
}

interface DiviceListsParams {
  id: string;
  brand: string;
  udid: string;
  model: string;
}

interface RouterUrlParams {
  source: string;
  id: string;
}

interface GetAllParamsType {
  current?: number;
  pageSize?: number;
}

interface DetailInfoParams {
  name: string;
  branch: string;
  package_info: string;
  version: string;
  device_list: string[];
  duration: string;
  server: string;
}

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

// 解析包名 解析出分支信息
const parsingPackageUrl = (url: string, coin: string | boolean): string => {
  if (!url) {
    return '';
  }
  const info = url.substring(url.lastIndexOf('/') + 1);
  if (coin === 'name') {
    return info;
  }
  const nodeBranch = info.substring(0, info.indexOf('_F'));
  const branch = nodeBranch.split('_');
  const result = coin ? branch.slice(2, 5).join('_') : branch.slice(3, 4).join();
  return result;
};

/**
 *  去除getUsersList 方法中 rest 输入型参数为空字符串导致搜索有问题
 * @param rest Protable 中 requst 方法传递回来的params
 */
const filterRest = (rest: GetAllParamsType) => {
  const restObj: GetAllParamsType = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};

// 表格信息
const getChildCase = async (params: GetAllParamsType, parent_id: string) => {
  const { current, pageSize: size, ...rest } = params;
  const restParams = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    parent_id,
    is_expanded: true,
    sort: 'created_time,desc',
    ...restParams,
  };
  const res = await getChildCases(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    result = {
      data: list,
      total,
    };
  }
  return result;
};

// 统计数据信息
const getAllChildCase = async (
  parent_id: string,
  setStatisticalData: (data: StatisticDataParams) => void,
) => {
  const info = {
    parent_id,
    is_expanded: true,
    sort: 'created_time,desc',
  };
  const res = await getChildCases(info);
  if (res?.status === '00000') {
    const totalNumbers = res.data.length;
    const passesNumbers =
      totalNumbers !== 0
        ? res.data.filter((item: TestContentParams) => {
            return item.status === 2;
          }).length
        : 0;
    const failuresNumber =
      totalNumbers !== 0
        ? res.data.filter((item: TestContentParams) => {
            return item.status === 3 || item.status === 4;
          }).length
        : 0;
    const passingRate =
      totalNumbers !== 0 && passesNumbers !== 0 ? (passesNumbers / totalNumbers) * 100 : 0;
    setStatisticalData({
      totalNumbers,
      passesNumbers,
      failuresNumber,
      passingRate,
    });
  }
};

const TestDetail: React.FC<{}> = () => {
  const urlParams: RouterUrlParams = useParams();
  const [detailInfo, setDetailInfo] = useState<DetailInfoParams>({
    name: '',
    branch: '',
    package_info: '',
    version: '',
    device_list: [],
    duration: '',
    server: '',
  });
  const [taskStatusDict, setTaskStatusDict] = useState<DictionariesParamsType[]>([]);
  const [deviceList, setDeviceList] = useState<DiviceListsParams[]>([]);
  const [statisticalData, setStatisticalData] = useState<StatisticDataParams>({
    totalNumbers: 0,
    passesNumbers: 0,
    failuresNumber: 0,
    passingRate: 0,
  });

  const filterDeviceListInfo = (arr: string): string[] => {
    if (arr.length === 0 || arr === null) return [];
    const arr1 = arr.split(',');
    const result = deviceList
      .filter((item) => arr1.includes(item.udid))
      .map((item1) => `${item1.brand} | ${item1.model} | ${item1.udid}`);
    return result;
  };

  // 获取基本信息
  const getTestsDetail = async (id: string) => {
    const res =
      urlParams.source === 'test' ? await getTestsDetails({ id }) : await getOneDetail({ id });
    if (res?.status === '00000') {
      if (urlParams.source === 'test') {
        const { name, package_url, device_list, duration, server } = res.data;
        setDetailInfo({
          name,
          branch: parsingPackageUrl(package_url, true),
          package_info: parsingPackageUrl(package_url, 'name'),
          version: parsingPackageUrl(package_url, false),
          device_list: filterDeviceListInfo(device_list),
          duration: parseDuration(duration ?? 0),
          server,
        });
      } else {
        const { name, duration, params } = res.data;
        const info = JSON.parse(params);
        setDetailInfo({
          name,
          branch: parsingPackageUrl(info.package_url, true),
          package_info: parsingPackageUrl(info.package_url, 'name'),
          version: parsingPackageUrl(info.package_url, false),
          device_list: filterDeviceListInfo(info.device_list),
          duration: parseDuration(duration ?? 0),
          server: info.server,
        });
      }
    }
  };

  const doDownloadReport = async (row: TestContentParams) => {
    if (!row.report_url) {
      return notification.info({
        message: '提示',
        description: '该条用例暂无下载地址',
      });
    }
    const reportUrl = row.report_url;
    const result = await getDownloadFile(reportUrl);
    const start = reportUrl ? reportUrl.lastIndexOf('/') + 1 : 0;
    let filename = reportUrl ? reportUrl.substring(start) : '';
    filename = `${detailInfo.name}_${row.name}`;
    return downloadFile(result, filename);
  };

  useEffect(() => {
    getDeviceList(setDeviceList);
    getTaskStatusDictionary(setTaskStatusDict);
    getAllChildCase(urlParams.id, setStatisticalData);
  }, []);

  useEffect(() => {
    getTestsDetail(urlParams.id);
  }, [deviceList]);
  const columns: ProColumnType<TestContentParams>[] = [
    {
      title: '用例',
      dataIndex: 'name',
    },
    {
      title: '所属模块',
      dataIndex: 'module_name',
    },
    {
      title: '测试设备',
      dataIndex: 'device_list',
      search: false,
      renderText: (text) => {
        return <span>{filterDeviceListInfo(text ?? '')}</span>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      search: false,
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      search: false,
      renderText: (text) => parseDuration(text),
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
      renderText: (text) => (
        <span className={styles[`status${text}`]}>
          {filterDictionaries(String(text), taskStatusDict)}
        </span>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 50,
      fixed: 'right',
      render: (_, row) => {
        return (
          <Button
            type="link"
            size="small"
            key="download"
            style={{ paddingLeft: '0px' }}
            onClick={() => doDownloadReport(row)}
          >
            下载
          </Button>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProCard.Group title="基本信息">
        <ProCard>
          <div className="ant-statistic-title">内容名称</div>
          <div className="ant-statistic-content">{detailInfo.name}</div>
        </ProCard>
        <Divider />
        <ProCard>
          <div className="ant-statistic-title">分支信息</div>
          <div className="ant-statistic-content">{detailInfo.branch}</div>
        </ProCard>
        <Divider />
        <ProCard>
          <div className="ant-statistic-title">测试包信息</div>
          <div className={styles.packageUrlSty}>
            <Tooltip placement="top" title={detailInfo.package_info}>
              {detailInfo.package_info}
            </Tooltip>
          </div>
        </ProCard>
      </ProCard.Group>
      <ProCard.Group style={{ marginBottom: '20px' }}>
        <ProCard>
          <div className="ant-statistic-title">版本号</div>
          <div className="ant-statistic-content">{detailInfo.version}</div>
        </ProCard>
        <Divider />
        <ProCard>
          <div className="ant-statistic-title">设备信息</div>
          <div className="ant-statistic-content">
            <Popover
              placement="top"
              content={detailInfo.device_list.map((item) => {
                return <div key={item}>{item}</div>;
              })}
              trigger="click"
            >
              <Button type="link" key="pageurlBtn" style={{ padding: 0 }}>
                {`${detailInfo.device_list.length}台`}
              </Button>
            </Popover>
          </div>
        </ProCard>
        <Divider />
        <ProCard>
          <div className="ant-statistic-title">共计耗时</div>
          <div className="ant-statistic-content">{detailInfo.duration}</div>
        </ProCard>
        <ProCard>
          <div className="ant-statistic-title">服务器</div>
          <div className="ant-statistic-content">{detailInfo.server}</div>
        </ProCard>
      </ProCard.Group>
      <ProCard.Group style={{ marginBottom: '20px' }} title="统计信息">
        <ProCard>
          <Statistic title="总用例数" value={statisticalData.totalNumbers} />
        </ProCard>
        <Divider />
        <ProCard>
          <Statistic title="通过数" value={statisticalData.passesNumbers} />
        </ProCard>
        <Divider />
        <ProCard>
          <Statistic title="失败数" value={statisticalData.failuresNumber} />
        </ProCard>
        <ProCard>
          <Statistic title="通过率" value={statisticalData.passingRate} suffix="%" precision={2} />
        </ProCard>
      </ProCard.Group>
      <ProTable
        columns={columns}
        rowKey="id"
        request={(params) => getChildCase(params, urlParams.id)}
      />
    </PageContainer>
  );
};

export default TestDetail;
