import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable, { ProColumnType } from '@ant-design/pro-table'
import { Select, Button } from 'antd'
import { getAllChildren } from '@/services/system/dictionary/index'
import { filterDictionaries, parseTime } from '@/utils/utils';
import { getAllUnetImagesPackages } from '@/services/package/unet/index'
import { TableColumnsParams } from '@/services/package/unet/index.d'
import { getServerOptionData } from '@/services/autotest/test/index'

const { Option } = Select
interface DictionaryDataParams {
  id: string,
  label: string,
  value: string
}

interface GetAllParamsType {
  current?: number;
  pageSize?: number;
}


interface ServerOptionsParams {
  name: string,
  branch: string
}


// 获取字典项 打包版本 环境
const getPackageBuildType = async (setPackageBuildType: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_build_type',
    sort: 'sort,asc'
  })
  if (res?.status === '00000') {
    setPackageBuildType(res.data)
  }
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
const getAllResourcesAssetPackage = async (params: GetAllParamsType) => {
  const { current, pageSize: per_page, ...rest } = params;
  const restParams = filterRest(rest);
  const info = {
    page: current,
    per_page,
    sort: 'created_time,desc',
    ...restParams,
  };
  const res = await getAllUnetImagesPackages(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.data) {
    const { unet_images, total } = res.data;
    result = {
      data: unet_images,
      total,
    };
  }
  return result;
};


// 获取 服务器
const getServerOptions = async (setPackagePlatform: (data: ServerOptionsParams[]) => void) => {
  const res = await getServerOptionData()
  if (res?.status === '00000') {
    const arr: ServerOptionsParams[] = Object.values(res.data);
    setPackagePlatform(arr)
  }
}


const Unet: React.FC<{}> = () => {
  const [packageBuildType, setPackageBuildType] = useState<DictionaryDataParams[]>([])
  const [serverOptions, setServerOptions] = useState<ServerOptionsParams[]>([])
  useEffect(() => {
    getPackageBuildType(setPackageBuildType)
    getServerOptions(setServerOptions)
  }, [])

  const columns: ProColumnType<TableColumnsParams>[] = [
    {
      title: 'JenKins',
      dataIndex: 'jenkins',
      render: (_, row) => {
        return (
          <Button type='link' style={{ paddingLeft: '0px' }} key={row.id} onClick={() => window.open(row.log_url, '_blank')}>{row.jenkins}</Button>
        )
      }
    },
    {
      title: '分支名称',
      dataIndex: 'branch',
      search: false
    },
    {
      title: '服务器',
      dataIndex: 'server',
      renderFormItem: () => {
        return (
          <Select placeholder='请选择'>
            {
              serverOptions && serverOptions.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
            }
          </Select>
        )
      }
    },
    {
      title: '仓库版本',
      dataIndex: 'hashes',
      search: false
    },
    {
      title: '镜像版本号',
      dataIndex: 'version_code',
      search: false
    },
    {
      title: '环境',
      dataIndex: 'build_type',
      renderText: (text) => filterDictionaries(text, packageBuildType),
      renderFormItem: () => {
        return (
          <Select placeholder='请选择'>
            {
              packageBuildType && packageBuildType.map(item => <Option key={item.id} value={item.value}>{item.label}</Option>)
            }
          </Select>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 200,
      search: false,
      renderText: (text) => parseTime(text)
    }
  ]

  return (
    <PageContainer>
      <ProTable columns={columns} rowKey='id' request={(params) => getAllResourcesAssetPackage(params)} />
    </PageContainer>
  )
}

export default Unet