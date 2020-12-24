export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user/login',
        component: './user/login',
      },
    ]
  },
  {
    path: '/:name/log/:id',
    component: './common/log'
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            component: './Welcome',
          },
          {
            path: '/inspection',
            routes: [
              {
                path: '/inspection',
                redirect: '/inspection/weeklyReport'
              },
              {
                path: 'weeklyReport',
                component: './inspection/weeklyReport'
              },
              {
                path: 'inspection',
                component: './inspection/inspection',
              },
              {
                path: ':source/detail/:id',
                component: './inspection/inspectionDetail'
              },
              {
                path: 'module',
                component: './inspection/module'
              },
              {
                path: 'item',
                component: './inspection/item'
              }
            ],
          },
          {
            path: '/package',
            routes: [
              {
                path: '/package',
                redirect: '/package/weeklyReport'
              },
              {
                path: 'weeklyReport',
                component: './package/weeklyReport',
              },
              {
                path: 'installation',
                component: './package/installation',
              },
              {
                path: 'unet',
                component: './package/unet',
              },
              {
                path: 'resources',
                component: './package/resources',
              },
              {
                path: ':source/:platform/:id',
                component: './package/packageDetail'
              },
            ],
          },
          {
            path: '/autotest',
            routes: [
              {
                path: '/autotest',
                redirect: '/autotest/test'
              },
              {
                path: 'test',
                component: './autotest/test',
              },
              {
                path: ':source/detail/:id',
                component: './autotest/testDetail',
              },
              {
                path: 'module',
                component: './autotest/module',
              },
              {
                path: 'case',
                component: './autotest/case',
              },
              {
                path: 'device',
                component: './autotest/device',
              }
            ],
          },
          {
            path: '/task',
            routes: [
              {
                path: '/task',
                redirect: '/task/execution'
              },
              {
                path: 'execution',
                component: './task/execution',
              },
              {
                path: 'execution/detail/:id',
                component: './task/executionDetail',
              },
              {
                path: 'execution/inspection/:source/detail/:id',
                component: './inspection/inspectionDetail'
              },
              {
                path: 'execution/autotest/:source/detail/:id',
                component: './autotest/testDetail'
              },
              {
                path: 'task_template',
                component: './task/taskTemplate'
              },
              {
                path: 'task_template/detail/:id',
                component: './task/taskTemplateDetail'
              },
              {
                path: 'transaction',
                component: './task/transaction'
              },
              {
                path: 'monitoring',
                component: './task/monitoring'
              }
            ],
          },
          {
            path: '/project',
            routes: [
              {
                path: '/project',
                redirect: '/project/repository'
              },
              {
                path: 'repository',
                component: './project/repository',
              },
            ],
          },
          {
            path: '/system',
            routes: [
              {
                path: '/system',
                redirect: '/system/users'
              },
              {
                path: 'users',
                component: './system/users',
              },
              {
                path: 'role',
                component: './system/role',
              },
              {
                path: 'menu',
                component: './system/menu',
              },
              {
                path: 'dictionary',
                component: './system/dictionary',
              },
              {
                path: 'message',
                component: './system/message',
              },
              {
                path: 'variable',
                component: './system/variable',
              },
              {
                path: '/system/interface',
                component: './system/interface',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
