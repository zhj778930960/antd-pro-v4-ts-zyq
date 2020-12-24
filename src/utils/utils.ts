import { parse } from 'querystring';
import { pathToRegexp } from 'path-to-regexp';
import { Route } from '@/models/connect';
import { notification } from 'antd';
import { routers } from '../../config/routers';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export interface RoutersDataType {
  name: string;
  path: string;
  redirect?: string;
  icon?: string;
  authority?: string[];
  key: string;
  hideInMenu?: boolean;
  children?: RoutersDataType[];
}
export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathToRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

// 获取每一个路由的权限
export const getRouteAuthority = (path: string, routeData: Route[], role: string) => {
  let authorities: string[] | string | undefined;
  if (path === '/') return [role];

  routeData.forEach((route) => {
    // match prefix
    if (pathToRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.children) {
        authorities = getRouteAuthority(path, route.children, role) || authorities;
      }
    }
  });
  return authorities;
};

const checkPrivileges = (privileges: string | string[], role: string, key: string) => {
  if (privileges === '*') {
    return [role];
  }
  if (Object.prototype.toString.call(privileges) === '[object Array]') {
    return privileges.includes(key) ? [role] : [];
  }
  return [];
};

const checkAuthChildren = (children: RoutersDataType[], role: string) => {
  if (!children) return [];
  const bool = children.some((item: RoutersDataType) => {
    return item.authority && item.authority.length !== 0;
  });
  return bool ? [role] : [];
};

// 过滤路由，给每一个 子路由都增加权限
const filterChildren = <T extends { key: string }>(
  privileges: string | string[],
  childrens: T[],
  role: string,
): T[] => {
  const arr = childrens.map((item1) => {
    return {
      ...item1,
      authority: checkPrivileges(privileges, role, item1.key),
    };
  });
  return arr;
};

// 输入的方法，给第一层的路由加上路由
export const filterRoutes = (privileges: string | string[], role: string) => {
  const arr = routers.map((item) => {
    return Object.assign(item, {
      children: filterChildren<RoutersDataType>(privileges, item.children, role),
      authority: [role],
    });
  });
  arr.forEach((item1) => {
    item1.authority = item1.key !== 'welcome' ? checkAuthChildren(item1.children, role) : [role];
  });
  return arr;
};

// 解析耗时
export function parseDuration(duration: number | null, defaultTime?: boolean): string {
  if (duration) {
    if (duration < 1) {
      return `${duration * 1000}ms`;
    }
    if (duration < 60) {
      return `${Math.floor(duration)}s`;
    }
    if (duration < 3600) {
      const m = Math.floor(duration / 60);
      const s = Math.floor(duration - 60 * m);
      return `${m}m${s > 0 ? `${s}s` : ''}`;
    }
    if (duration < 3600 * 24) {
      const h = Math.floor(duration / 3600);
      const m = Math.floor((duration - 3600 * h) / 60);
      return `${h}h${m > 0 ? `${m}m` : ''}`;
    }
    const d = Math.floor(duration / (3600 * 24));
    return `${d + parseFloat(((duration - 3600 * 24 * d) / (3600 * 24)).toFixed(1))}d`;
  }
  return defaultTime ? '0s' : '';
}

interface DictionariesType {
  label: string;
  id: string;
  value: string;
}

// 过滤字典项内容
export function filterDictionaries(value: string, data: DictionariesType[]) {
  if (!value || data.length === 0) return '';
  const arr = data.filter((item) => item.value === value);
  const label = arr.length > 0 ? arr[0].label : '';
  return label;
}

// 下载文件
export function downloadFile(obj: File, name?: string, suffix = undefined) {
  const url = window.URL.createObjectURL(new Blob([obj]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  const fileName = name + (suffix ? `.${suffix}` : '');
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseTime(time: number, cFormat?: string) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat ?? '{y}-{m}-{d} {h}:{i}:{s}';
  if (!time) {
    return '';
  }
  const date = new Date(time * 1000);
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`;
    }
    return value || 0;
  });
  return timeStr;
}

export function getfilesize(size: number) {
  if (!size) {
    return '';
  }
  return `${(size / 1024 ** 1).toFixed(2)}G`;
}

/**
 *
 * @param task 任务名称 如字典项...
 * @param type 任务类别 新增 删除 编辑...
 * @param state 任务状态 成功  失败
 * @param message 任务错误信息 接口状态为失败时 后端返回的信息
 */

export function notifyInfoTip(task: string, type: string, state: boolean, message?: string) {
  if (state) {
    notification.success({
      message: '成功',
      description: `${type}${task}成功`,
    });
  } else {
    notification.error({
      message: '失败',
      description: message ? `${message}` : `${type}${task}失败`,
    });
  }
}
