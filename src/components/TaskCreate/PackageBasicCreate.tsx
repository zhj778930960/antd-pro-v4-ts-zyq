import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import { getAllSMBranches } from '@/services/project/repository/index';
import { getAllChildren } from '@/services/system/dictionary/index';
import { myContext } from '@/utils/commonContext';

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

// 获取字典项 打包平台
const getPackagePlatform = async (setPackagePlatform: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_platform',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackagePlatform(res.data);
  }
};

// 获取字典项 打包类型
const getPackType = async (setPackType: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'pack_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackType(res.data);
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

// 获取字典项 打包模式
const getBuildMode = async (setBuildMode: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'build_mode',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setBuildMode(res.data);
  }
};

// 获取香肠派对客户端分支
const getRepositorySmBranches = async (setSmBranches: (data: string[]) => void) => {
  const res = await getAllSMBranches();
  if (res?.status === '00000') {
    setSmBranches(res.data);
  }
};

const { Option } = Select;

const packTypeQuery = new Map([
  ['1', ['1', 'dev']],
  ['2', ['1', 'first-test']],
  ['3', ['1', 'release']],
  ['4', ['2', 'dev']],
  ['5', ['2', 'first-test']],
]);
const PackageBasicCreate: React.FC<{}> = () => {
  const [smBranches, setSmBranches] = useState<string[]>([]);
  const [packType, setPackType] = useState<DictionaryDataParams[]>([]);
  const [packagePlatform, setPackagePlatform] = useState<DictionaryDataParams[]>([]);
  const [buildMode, setBuildMode] = useState<DictionaryDataParams[]>([]);
  const [packageBuildType, setPackageBuildType] = useState<DictionaryDataParams[]>([]);
  const { form }: any = useContext(myContext);
  useEffect(() => {
    getRepositorySmBranches(setSmBranches);
    getPackagePlatform(setPackagePlatform);
    getPackType(setPackType);
    getBuildMode(setBuildMode);
    getPackageBuildType(setPackageBuildType);
  }, []);

  // 打包类型切换
  const packTypeChange = (val: string) => {
    const modeType: string[] | undefined = packTypeQuery.get(val);
    const params = { build_type: modeType?.[1], build_mode: modeType?.[0] };
    form.setFieldsValue({
      params,
    });
  };
  return (
    <>
      {/* {['params', 'branch']} 写法就是 取 params.branch 的值 */}
      <Form.Item
        name={['params', 'platform']}
        label="平台"
        rules={[{ required: true, message: '请选择平台' }]}
      >
        <Select placeholder="请选择平台">
          {packagePlatform &&
            packagePlatform.map((item) => {
              return (
                <Option value={item.value} key={item.id}>
                  {item.label}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        name={['params', 'pack_type']}
        label="打包类型"
        rules={[{ required: true, message: '请选择打包类型' }]}
      >
        <Select placeholder="请选择打包类型" onChange={packTypeChange}>
          {packType &&
            packType.map((item) => {
              return (
                <Option value={item.value} key={item.id}>
                  {item.label}
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
        <Select placeholder="请选择环境">
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
        name={['params', 'build_mode']}
        label="打包模式"
        rules={[{ required: true, message: '请选择打包模式' }]}
      >
        <Select placeholder="请选择打包模式">
          {buildMode &&
            buildMode.map((item) => {
              return (
                <Option value={item.value} key={item.id}>
                  {item.label}
                </Option>
              );
            })}
        </Select>
      </Form.Item>

      <Form.Item
        name={['params', 'branch']}
        label="分支"
        rules={[{ required: true, message: '请选择分支' }]}
      >
        <Select placeholder="请选择分支">
          {smBranches &&
            smBranches.map((item) => {
              return (
                <Option value={item} key={item}>
                  {item}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item name={['params', 'hashes']} label="哈希">
        <Input placeholder="请输入哈希值" />
      </Form.Item>
      <Form.Item name={['params', 'is_profile']} label=" " colon={false} valuePropName="checked">
        <Checkbox>开启profile</Checkbox>
      </Form.Item>
      <Form.Item name={['params', 'is_auto_test']} label=" " colon={false} valuePropName="checked">
        <Checkbox>开启自动化测试</Checkbox>
      </Form.Item>
    </>
  );
};

export default PackageBasicCreate;
