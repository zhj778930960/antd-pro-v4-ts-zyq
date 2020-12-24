export const WelcomeMenu = [
  {
    name: '首页',
    path: '/welcome',
    key: 'welcome',
    icon: 'icon-shujukanban',
    children: [],
  }
];
export const MenuList = [
  {
    name: '预检查',
    path: '/inspection',
    redirect: '/inspection/inspection',
    icon: 'icon-inspection',
    key: 'inspectionContent',
    checkable: false,
    children: [
      {
        name: '周数据',
        path: '/inspection/weeklyReport',
        key: 'inspectionWeeklyReport'
      },
      {
        name: '检查记录',
        path: '/inspection/inspection',
        key: 'inspection',
      },
      {
        name: '检查记录详情',
        path: '/inspection/:source/detail/:id',
        key: 'inspectionDetail',
        hideInMenu: true,
      },
      {
        name: '检查模块',
        path: '/inspection/module',
        key: 'inspectionModule',
      },
      {
        name: '检查项目',
        path: '/inspection/item',
        key: 'item',
      },
    ],
  },
  {
    name: '包管理',
    path: '/package',
    icon: 'icon-similarproduct',
    key: 'package',
    redirect: '/package/weeklyReport',
    checkable: false,
    children: [
      {
        name: '周数据',
        path: '/package/weeklyReport',
        key: 'packageWeeklyReport'
      },
      {
        name: '安装包',
        path: '/package/installation',
        key: 'installationPackage'
      },
      {
        name: '包详情',
        path: '/package/:source/:platform/:id',
        key: 'packageDetail',
        hideInMenu: true,
      },
      {
        name: 'Unet包',
        path: '/package/unet',
        key: 'unetPackage',
      },
      {
        name: '资源包',
        path: '/package/resources',
        key: 'resourcesPackage',
      },
    ],
  },
  {
    name: '自动化测试',
    path: '/autotest',
    key: 'autotest',
    icon: 'icon-xinicon_huabanfuben',
    redirect: '/autotest/test',
    checkable: false,
    children: [
      {
        name: '测试记录',
        path: '/autotest/test',
        key: 'test',
      },
      {
        name: '测试记录详情',
        path: '/autotest/:source/detail/:id',
        key: 'testDetail',
        hideInMenu: true,
      },
      {
        name: '测试模块',
        path: '/autotest/module',
        key: 'testModule',
      },
      {
        name: '测试用例',
        path: '/autotest/case',
        key: 'case',
      },
      {
        name: '设备列表',
        path: '/autotest/device',
        key: 'device',
      },
    ],
  },
  {
    name: '任务管理',
    path: '/task',
    key: 'task',
    icon: 'icon-survey1',
    redirect: '/task/execution',
    checkable: false,
    children: [
      {
        name: '执行记录',
        path: 'execution',
        key: 'execution',
      },
      {
        name: '执行记录详情',
        path: 'execution/detail/:id',
        key: 'executionDetail',
        hideInMenu: true,
      },
      {
        name: '执行记录预检查详情',
        path: 'execution/inspection/:source/detail/:id',
        key: 'taskExecutionInspection',
        hideInMenu: true,
      },
      {
        name: '执行记录自动化测试详情',
        path: 'execution/autotest/:source/detail/:id',
        key: 'taskExecutionAutotest',
        hideInMenu: true,
      },
      {
        name: '任务模板',
        path: 'task_template',
        key: 'taskTemplate',
      },
      {
        name: '任务模板详情',
        path: 'task_template/detail/:id',
        hideInMenu: true,
        key: 'taskTemplateDetail',
      },
      {
        name: '事务列表',
        path: 'transaction',
        key: 'transaction',
      },
      {
        name: '事件监听',
        path: 'monitoring',
        key: 'eventMonitoring',
      },
    ],
  },
  {
    name: '项目管理',
    path: '/project',
    key: 'project',
    icon: 'icon-jifen',
    redirect: '/project/repository',
    checkable: false,
    children: [
      {
        name: '源码仓库',
        path: '/project/repository',
        key: 'repository',
      },
    ],
  },
  {
    name: '系统管理',
    path: '/system',
    redirect: '/system/users',
    key: 'system',
    icon: 'icon-set',
    checkable: false,
    children: [
      {
        name: '用户管理',
        path: '/system/users',
        key: 'User',
      },
      {
        name: '角色管理',
        path: '/system/role',
        key: 'Role',
      },
      // {
      //   'name': '菜单管理',
      //   'path': '/system/menu',
      //   'key': 'Menu'
      // },
      {
        name: '消息管理',
        path: '/system/message',
        key: 'Message',
      },
      {
        name: '字典管理',
        path: '/system/dictionary',
        key: 'Dictionary',
      },
      {
        name: '系统变量',
        path: '/system/variable',
        key: 'Variable',
      },
      {
        name: '接口日志',
        path: '/system/interface',
        key: 'Interface',
      },
    ],
  },
];

export const routers = [...WelcomeMenu, ...MenuList];
