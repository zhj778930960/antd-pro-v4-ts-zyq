const pkgInfoTableCofigData = [
  {
    title: '包大小',
    dataIndex: 'size',
    source: ['installation', 'resources']
  },
  {
    title: '开发版本号',
    dataIndex: 'dev_version',
    source: ['installation']
  },
  {
    title: '对外版本号',
    dataIndex: 'version',
    source: ['installation']
  },
  {
    title: '资源版本号',
    dataIndex: 'assets_version',
    source: ['installation']
  },
  {
    title: '资源版本号',
    dataIndex: 'version',
    source: ['resources']
  },
  {
    title: '热更仓库Hash',
    dataIndex: 'assets_hash',
    source: ['installation']
  },
  {
    title: '资源仓库Hash',
    dataIndex: 'hash',
    source: ['resources']
  },
  {
    title: '环境',
    dataIndex: 'build_type',
    source: ['installation', 'resources']
  },
  {
    title: '用途',
    dataIndex: 'use_for',
    source: ['installation']
  }
];

const gitLabPkgConfigData = [
  {
    title: '仓库名称',
    dataIndex: 'repo'
  },
  {
    title: '分支',
    dataIndex: 'branch'
  },
  {
    title: '节点',
    dataIndex: 'hash'
  }
];

const conPkgTableConfigData = [
  {
    title: 'branch',
    dataIndex: 'branch'
  },
  {
    title: 'platform',
    dataIndex: 'platform'
  },
  {
    title: 'build_type',
    dataIndex: 'build_type'
  },
  {
    title: 'is_profile',
    dataIndex: 'is_profile'
  },
  {
    title: 'is_auto_test',
    dataIndex: 'is_auto_test'
  },
  {
    title: 'is_match',
    dataIndex: 'is_match'
  },
  {
    title: 'clear_assetbundle',
    dataIndex: 'clear_assetbundle'
  },
  {
    title: 'hashes',
    dataIndex: 'hashes'
  }
];

const coInfoPkgTableConfigData = [
  {
    title: '构建任务名称',
    dataIndex: 'job_name'
  },
  {
    title: 'Jenkins',
    dataIndex: 'jenkins'
  },
  {
    title: '构建者',
    dataIndex: 'author'
  }
];

const checkReportData = [
  {
    title: '检查项',
    dataIndex: 'name'
  },
  {
    title: '结果',
    dataIndex: 'status'
  },
  {
    title: '详情',
    dataIndex: 'detail'
  }
];

export default {
  pkgInfoTableCofigData,
  gitLabPkgConfigData,
  conPkgTableConfigData,
  coInfoPkgTableConfigData,
  checkReportData
};
