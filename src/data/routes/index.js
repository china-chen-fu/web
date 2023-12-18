export const pageRoutes = {
  code: 200,
  msg: '操作成功',
  type: 0,
  data: [
    {
      path: '/',
      hidden: false,
      component: 'Layout',
      children: [
        {
          name: 'Home',
          path: 'home',
          hidden: false,
          component: 'index',
          meta: {
            title: '首页',
            englishName: '',
            icon: 'energy-dn-kanban',
            noCache: false,
            link: null
          },
          platformId: 1
        }
      ],
      platformId: 1
    },
    {
      name: 'Project',
      path: '/project',
      hidden: false,
      redirect: 'noRedirect',
      component: 'Layout',
      alwaysShow: true,
      meta: {
        title: '项目DEMO',
        englishName: '',
        icon: 'energy-dn-houtai',
        noCache: false,
        link: null
      },
      children: [
        {
          name: 'Yunboo',
          path: 'yunboo',
          hidden: false,
          redirect: 'noRedirect',
          component: 'ParentView',
          alwaysShow: true,
          meta: {
            title: '鼋博',
            englishName: null,
            icon: '',
            noCache: false,
            link: null
          },
          children: [
            {
              name: 'MindMap',
              path: 'mindMap',
              hidden: false,
              component: 'project/yunboo/mindMap/index',
              meta: {
                title: '脑图',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            },
            {
              name: 'GaussianDistribution',
              path: 'gaussianDistribution',
              hidden: false,
              component: 'project/yunboo/gaussianDistribution/index',
              meta: {
                title: '正态分布',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            },
            {
              name: 'MassData',
              path: 'massData',
              hidden: false,
              component: 'project/yunboo/massData/index',
              meta: {
                title: '表格大量数据',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            },
            {
              name: 'Cascader',
              path: 'cascader',
              hidden: false,
              component: 'project/yunboo/cascader/index',
              meta: {
                title: '级联选择器',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            },
            {
              name: 'JsonEditor',
              path: 'jsonEditor',
              hidden: false,
              component: 'project/yunboo/jsonEditor/index',
              meta: {
                title: 'json编辑器',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            },
            {
              name: 'SlidingVerificationCode',
              path: 'slidingVerificationCode',
              hidden: false,
              component: 'project/yunboo/slidingVerificationCode/index',
              meta: {
                title: '滑动校验',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            }
          ],
          platformId: 1
        }
      ],
      platformId: 1
    },
    {
      name: 'Technology',
      path: '/technology',
      hidden: false,
      redirect: 'noRedirect',
      component: 'Layout',
      alwaysShow: true,
      meta: {
        title: '技术栈',
        englishName: '',
        icon: 'energy-dn-houtai',
        noCache: false,
        link: null
      },
      children: [
        {
          name: 'HTML',
          path: 'HTML',
          hidden: false,
          redirect: 'noRedirect',
          component: 'ParentView',
          alwaysShow: true,
          meta: {
            title: 'HTML',
            englishName: null,
            icon: '',
            noCache: false,
            link: null
          },
          children: [
            {
              name: 'VNode',
              path: 'VNode',
              hidden: false,
              component: 'technology/HTML/VNode/index',
              meta: {
                title: '虚拟节点',
                englishName: null,
                icon: '',
                noCache: false,
                link: null
              },
              platformId: 1
            }
          ],
          platformId: 1
        }
      ],
      platformId: 1
    }
  ]
}
