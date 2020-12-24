import { MenuDataItem, getMenuData, getPageTitle, Settings as ProSettings } from '@ant-design/pro-layout'; // DefaultFooter
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, ConnectProps, connect, FormattedMessage } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import logo from '../assets/Icon.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: ProSettings
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
    settings
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title1 = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
    ...settings
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title1}</title>
        <meta name="description" content={title1} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{settings.title}</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="pages.layouts.userLayout.title"
                defaultMessage=""
              />
            </div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({
  settings
}))(UserLayout);
