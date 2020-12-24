import request from '@/utils/request';
import { GetAllRepository, RepositoryTableData, DelRepositoryType } from './index.d';

export function getAllRepository(params: GetAllRepository) {
  return request('/api/repository', {
    params,
  });
}

export function addRepository(data: RepositoryTableData) {
  return request('/api/repository/add', {
    method: 'post',
    data,
  });
}

export function editRepository(data: RepositoryTableData) {
  return request('/api/repository/edit', {
    method: 'put',
    data,
  });
}

export function delRepository(data: DelRepositoryType) {
  return request('/api/repository/del', {
    method: 'delete',
    data,
  });
}

// 获取香肠派对客户端分支
export async function getAllSMBranches() {
  // 先获取到所有香肠的仓库标识，在获取对应下的所有的分支
  const res = await request('/api/repository');
  let params = ''
  if (res?.status === '00000') {
    const arr: RepositoryTableData[] = Object.prototype.toString.call(res.data) === '[object Array]' ? res.data : [];
    params = arr.map(item => {
      const { label } = item;
      const splitLabel = label?.split('_');
      if (label && label.startsWith('sm_') && splitLabel?.length === 2) {
        return label;
      }
      return undefined
    }).filter(item1 => item1 !== undefined).join();
  }

  return request('/api/repository/branches', {
    params: {
      label: params
    }
  });
}

// 获取JK脚本分支
export function getJenkinsScriptBranches() {
  return request('/api/repository/branches', {
    params: {
      label: 'jenkins_scripts'
    }
  });
}

// 获取airtest_frame分支
export function getAirtestFrameBranches() {
  return request('/api/repository/branches', {
    params: {
      label: 'airtest_frame'
    }
  });
}