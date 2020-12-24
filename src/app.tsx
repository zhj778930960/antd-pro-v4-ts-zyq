// import { Route } from '@/models/connect';
// import { queryCurrent } from '@/services/user';
import Cookies from 'js-cookie'
import { history } from 'umi'
// import { notification } from 'antd'
// import { filterRoutes } from '@/utils/utils'
// import { pathToRegexp} from 'path-to-regexp'

// interface RouteDataType {
//   routes: Route[]
// }

// let extraRoutes: Route[];
const loginPath: string[] = ['/user', '/user/login']

// const updateRouteAuthority = (path: string, routeData: Route[], sAuth: string[] | string | undefined) => {
//   if(routeData && Array.isArray(routeData)){
//     routeData.forEach(route => {
//       if(route.path){
//         if((route.path === '/') || (pathToRegexp(`${route.path}/(.*)`).test(`${path}/`))){
//           if (route.path === path && sAuth) {
//             route.authority = sAuth;
//           }
//           if (route.routes) {
//             updateRouteAuthority(path, route.routes, sAuth);
//           }
//         }
//       }
//     });
//   }
// };

// const patchEachRoute = (serverRoute: Route[], routes:Route[])=>{
//   if(serverRoute && Array.isArray(serverRoute)){
//     serverRoute.forEach(eRoute => {
//       updateRouteAuthority(`${eRoute.path}`, routes, eRoute.authority);
//       if(eRoute.children){
//         patchEachRoute(eRoute.children, routes)
//       }
//     });
//   }
// };
// // patch

// export function patchRoutes(routes: RouteDataType) {
//   if (extraRoutes) {
//     patchEachRoute(extraRoutes, routes.routes);
//   }
// }


// const getAutonInfo = async (oldRender: () => void) => {
//   const res = await queryCurrent()
//   if (res?.status === '00000') {
//     const { privileges, user_name } = res.data.user
//     extraRoutes = filterRoutes(privileges, user_name)
//   } else {
//     notification.error({
//       message: '获取用户信息失败'
//     })
//     history.replace('/user/login')
//   }
//   oldRender();
// }
export function render(oldRender: () => void) {
  const token = Cookies.get('Authorization')
  // 没有token
  if (!token) {
    history.replace('/user/login')
    oldRender()
    return
  }
  if (loginPath.includes(window.location.pathname)) {
    history.replace('/welcome')
    oldRender();
    
  }
  oldRender()
  // getAutonInfo(oldRender)
}

