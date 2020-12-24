import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumnType } from '@ant-design/pro-table';
import { Select, Button, notification } from 'antd';
import { getAllInstallationPackages } from '@/services/package/installation/index';
import { filterDictionaries, parseDuration, parseTime } from '@/utils/utils';
import { getAllChildren } from '@/services/system/dictionary/index';
import IconFont from '@/components/IconFont/index';
import { TableColumnsParams } from '@/services/package/installation/index.d';
import { Link } from 'umi';
import styles from './index.less';

const { Option } = Select;
interface GetAllParamsType {
  current?: number;
  pageSize?: number;
}

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}
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
const getAllInstallationPackage = async (params: GetAllParamsType) => {
  const { current, pageSize: per_page, ...rest } = params;
  const restParams = filterRest(rest);
  const info = {
    page: current,
    per_page,
    sort: 'created_time,desc',
    ...restParams,
  };
  const res = await getAllInstallationPackages(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.data) {
    const { packages, total } = res.data;
    result = {
      data: packages,
      total,
    };
  }
  return result;
};

// 获取字典项 打包版本 环境
const getPackageBuildType = async (setPackageBuildType: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_build_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackageBuildType(res.data);
  }
};

// 获取字典项 用途
const getPackageUseFor = async (setPackageUseFor: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_use_for',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackageUseFor(res.data);
  }
};

// 获取字典项 平台
const getPackagePlatform = async (setPackagePlatform: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_platform',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackagePlatform(res.data);
  }
};

const Installation: React.FC<{}> = () => {
  const [packageBuildType, setPackageBuildType] = useState<DictionaryDataParams[]>([]);
  const [packageUseFor, setPackageUseFor] = useState<DictionaryDataParams[]>([]);
  const [packagePlatform, setPackagePlatform] = useState<DictionaryDataParams[]>([]);

  useEffect(() => {
    getPackageBuildType(setPackageBuildType);
    getPackageUseFor(setPackageUseFor);
    getPackagePlatform(setPackagePlatform);
  }, []);

  const doDownloadReport = async (url: string) => {
    if (!!url === false) {
      notification.info({
        message: '提示',
        description: '暂无下载地址',
      });
    }
    window.open(url, '_self');
  };

  const columns: ProColumnType<TableColumnsParams>[] = [
    {
      title: 'Jenkins',
      dataIndex: 'jenkins',
      ellipsis: true,
      width: 300,
      search: false,
      render: (_, row) => {
        return (
          <Button
            type="link"
            style={{ paddingLeft: '0px' }}
            key={row.id}
            onClick={() => window.open(row.log_url, '_blank')}
          >
            {row.jenkins}
          </Button>
        );
      },
    },
    {
      title: '包名',
      dataIndex: 'name',
      ellipsis: true,
      render: (_, row) => (
        <Link
          className={styles.primaryColor}
          to={`/package/installation/${row.platform}/${row.id}`}
        >
          {row.name}
        </Link>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      render: (_, row) => {
        return (
          <IconFont
            className={row.platform === 'android' ? styles.successColor : ''}
            style={{ fontSize: '16px' }}
            type={`icon-${row.platform}`}
          />
        );
      },
      renderFormItem: () => {
        return (
          <Select placeholder="请选择">
            {packagePlatform &&
              packagePlatform.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '环境',
      dataIndex: 'build_type',
      renderText: (text) => filterDictionaries(text, packageBuildType),
      renderFormItem: () => {
        return (
          <Select placeholder="请选择">
            {packageBuildType &&
              packageBuildType.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '用途',
      dataIndex: 'use_for',
      width: 150,
      renderFormItem: () => {
        return (
          <Select placeholder="请选择">
            {packageUseFor &&
              packageUseFor.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '构建者',
      dataIndex: 'author',
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      search: false,
      renderText: (text) => parseDuration(text),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      search: false,
      renderText: (text) => parseTime(text),
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
            onClick={() => doDownloadReport(row.download_url)}
          >
            下载
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
        request={(params) => getAllInstallationPackage(params)}
      />
    </PageContainer>
  );
};

export default Installation;
