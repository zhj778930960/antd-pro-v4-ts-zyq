import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useMemo, useRef } from 'react';
import { Link, useIntl, connect, Dispatch, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import { getRouteAuthority } from '@/utils/utils';
import logo from '@/assets/Icon.png';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="网管说这个页面你不能进......"
    extra={
      <Button type="primary">
        <Link to="/welcome">返回首页</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  user: any;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  const arr = menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
  return arr;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    user,
  } = props;

  const { menuData, role } = user?.currentUser;
  const serverMenuItem = (): MenuDataItem[] => {
    const transMenuItem: MenuDataItem[] = [];
    if (Array.isArray(menuData)) {
      menuData.forEach((v) => {
        const localV = { ...v, children: v.children ? menuDataRender(v.children) : [] };
        const localMenuDataItem = Authorized.check(v.authority, localV, null) as MenuDataItem;
        transMenuItem.push(localMenuDataItem);
      });
    }
    return transMenuItem;
  };
  const menuDataRef = useRef<MenuDataItem[]>([]);
  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  // get children authority
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname ?? '/', menuDataRef.current).pop() ?? {
        authority: getRouteAuthority(location.pathname ?? '', menuData, role) ?? '',
      },
    [location.pathname],
  );
  const { formatMessage } = useIntl();

  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      {...props}
      {...settings}
      menuDataRender={serverMenuItem}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(rts = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...rts,
      ]}
      menu={{
        locale: false,
      }}
      footerRender={() => null}
      rightContentRender={() => <RightContent />}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
      <SettingDrawer
        settings={settings}
        hideCopyButton
        hideHintAlert
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </ProLayout>
  );
};

export default connect(({ global, settings, user }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  user,
}))(BasicLayout);
