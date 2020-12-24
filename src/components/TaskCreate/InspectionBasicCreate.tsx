import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Select } from 'antd';
import { getAllSMBranches } from '@/services/project/repository/index';
import { getAllChildren } from '@/services/system/dictionary/index';
import { myContext } from '@/utils/commonContext';

interface DictionaryDataParams {
  id: string;
  label: string;
  value: string;
}

// 获取香肠派对客户端分支
const getRepositorySmBranches = async (setSmBranches: (data: string[]) => void) => {
  const res = await getAllSMBranches();
  if (res?.status === '00000') {
    setSmBranches(res.data);
  }
};

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

// 获取字典项 打包版本
const getPackageBuildType = async (setPackageBuildType: (data: DictionaryDataParams[]) => void) => {
  const res = await getAllChildren({
    dictName: 'package_build_type',
    sort: 'sort,asc',
  });
  if (res?.status === '00000') {
    setPackageBuildType(res.data);
  }
};

const { Option } = Select;
const InspectionBasicCreate: React.FC<{}> = () => {
  const [smBranches, setSmBranches] = useState<string[]>([]);
  const [packagePlatform, setPackagePlatform] = useState<DictionaryDataParams[]>([]);
  const [packageBuildType, setPackageBuildType] = useState<DictionaryDataParams[]>([]);
  const { showOptionsState }: any = useContext(myContext);
  useEffect(() => {
    getRepositorySmBranches(setSmBranches);
    getPackagePlatform(setPackagePlatform);
    getPackageBuildType(setPackageBuildType);
  }, []);
  return (
    <>
      {/* {['params', 'branch']} 写法就是 取 params.branch 的值 */}
      <Form.Item
        name={['params', 'branch']}
        label="分支"
        rules={[{ required: true, message: '请选择分支' }]}
      >
        <Select placeholder="请选择分支" disabled={showOptionsState}>
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
      <Form.Item
        name={['params', 'platform']}
        label="平台"
        rules={[{ required: true, message: '请选择平台' }]}
      >
        <Select placeholder="请选择平台" disabled={showOptionsState}>
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
      <Form.Item name={['params', 'hashes']} label="哈希">
        <Input placeholder="请输入哈希值" disabled={showOptionsState} />
      </Form.Item>
    </>
  );
};

export default InspectionBasicCreate;
