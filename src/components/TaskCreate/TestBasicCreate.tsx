import React, { useEffect, useState, useContext } from 'react';
import { Form, Select } from 'antd';
import { getAllInstallationPackages } from '@/services/package/installation/index';
import { getAllChildren } from '@/services/system/dictionary/index';
import { getServerOptionData } from '@/services/autotest/test/index';
import { getDeviceLists } from '@/services/autotest/device/index';
import { getAirtestFrameBranches } from '@/services/project/repository/index';
import { getAll } from '@/services/system/variable/index';
import { myContext } from '@/utils/commonContext';

const { Option } = Select;

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

interface TestPackagesDataParams {
  name: string;
  download_url: string;
  platform: string;
  build_type: string;
  id: string;
}

interface ServerOptionsParams {
  name: string;
  branch: string;
}

interface DiviceListsParams {
  id: string;
  brand: string;
  udid: string;
  model: string;
}

// 获取测试包
const getTestPackages = async (setTestPackages: (data: TestPackagesDataParams[]) => void) => {
  const res = await getAllInstallationPackages({
    page: 1,
    per_page: 100,
    use_for: 2,
  });
  if (res?.data) {
    const { packages } = res.data;
    setTestPackages(packages);
  }
};

// 获取字典项 打包环境
const getPackageBuildType = async (setPackageBuildType: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_build_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackageBuildType(res.data);
  }
};

// 获取 服务器
const getServerOptions = async (setPackagePlatform: (data: ServerOptionsParams[]) => void) => {
  const res = await getServerOptionData();
  if (res?.status === '00000') {
    const arr: ServerOptionsParams[] = Object.values(res.data);
    setPackagePlatform(arr);
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

// 获取框架分支
const getAirtestFrameBranche = async (setAirtestFrameBranches: (data: string[]) => void) => {
  const res = await getAirtestFrameBranches();
  if (res?.status === '00000') {
    setAirtestFrameBranches(res.data);
  }
};

// 获取系统变量 airtest_framework_branch 来确定是否启用默认值
const getAirtestFrameworkState = async (mainForm: any) => {
  const res = await getAll({
    variable: 'airtest_framework_branch',
  });
  if (res?.status === '00000') {
    const { enabled, value } = res.data[0];
    if (enabled === 1) {
      mainForm.setFieldsValue({
        params: {
          airtest_framework_branch: value,
        },
      });
    }
  }
};

// 根据测试包名来找出对应的服务器
const searchServer = (name: string, serverOptions: ServerOptionsParams[]) => {
  if (!name) return null;
  const sliceName = name.substring(0, name.indexOf('_F'));
  const endName = sliceName.split('_').slice(2).join('_');
  const arr = serverOptions.filter((item) => {
    return item.branch === endName;
  });
  const server = arr.length > 0 ? arr[0].name : null;
  return server;
};

const TestBasicCreate: React.FC<{}> = () => {
  const [testPackages, setTestPackages] = useState<TestPackagesDataParams[]>([]);
  const [packageBuildType, setPackageBuildType] = useState<DictionaryDataParams[]>([]);
  const [serverOptions, setServerOptions] = useState<ServerOptionsParams[]>([]);
  const [deviceList, setDeviceList] = useState<DiviceListsParams[]>([]);
  const [airtestFrameBranches, setAirtestFrameBranches] = useState<string[]>([]);
  const { form, showOptionsState }: any = useContext(myContext);
  useEffect(() => {
    getTestPackages(setTestPackages);
    getServerOptions(setServerOptions);
    getPackageBuildType(setPackageBuildType);
    getDeviceList(setDeviceList);
    getAirtestFrameBranche(setAirtestFrameBranches);
    getAirtestFrameworkState(form);
  }, []);

  // 处理选择测试包发生改变
  const handlePackageChange = (val: string) => {
    const packageList = testPackages.filter((item) => {
      return item.download_url === val;
    });
    const insPackage = packageList.length > 0 ? packageList[0] : undefined;
    form.setFieldsValue({
      params: {
        build_type: insPackage ? insPackage.build_type : null,
        server: searchServer(insPackage?.name ?? '', serverOptions),
      },
    });
  };

  return (
    <>
      {/* {['params', 'branch']} 写法就是 取 params.branch 的值 */}
      <Form.Item
        name={['params', 'package_url']}
        label="测试包"
        rules={[{ required: true, message: '请选择测试包' }]}
      >
        <Select
          placeholder="请选择测试包"
          showSearch
          onChange={handlePackageChange}
          disabled={showOptionsState}
        >
          {testPackages &&
            testPackages.map((item) => {
              return (
                <Option value={item.download_url} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        name={['params', 'build_type']}
        label="环境"
        rules={[{ required: true, message: '请选择环境' }]}
      >
        <Select placeholder="请选择环境" disabled={showOptionsState}>
          {packageBuildType &&
            packageBuildType.map((item) => {
              return (
                <Option value={item.value} key={item.id}>
                  {item.label}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        name={['params', 'server']}
        label="服务器"
        rules={[{ required: true, message: '请选择服务器' }]}
      >
        <Select placeholder="请选择服务器" disabled={showOptionsState}>
          {serverOptions &&
            serverOptions.map((item) => {
              return (
                <Option value={item.name} key={item.name}>
                  {item.name}
                </Option>
              );
            })}
        </Select>
      </Form.Item>

      <Form.Item
        name={['params', 'device_list']}
        label="设备"
        rules={[{ required: true, message: '请选择设备' }]}
      >
        <Select placeholder="请选择设备" mode="multiple" disabled={showOptionsState}>
          {deviceList &&
            deviceList.map((item) => {
              return (
                <Option
                  value={item.udid}
                  key={item.id}
                >{`${item.brand} | ${item.model} | ${item.udid}`}</Option>
              );
            })}
        </Select>
      </Form.Item>

      <Form.Item
        name={['params', 'airtest_framework_branch']}
        label="框架分支"
        rules={[{ required: true, message: '请选择框架分支' }]}
      >
        <Select placeholder="请选择框架分支" disabled={showOptionsState}>
          {airtestFrameBranches &&
            airtestFrameBranches.map((item) => {
              return (
                <Option value={item} key={item}>
                  {item}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
    </>
  );
};

export default TestBasicCreate;
