import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { getOneInstallationPackages } from '@/services/package/installation/index';
import { getOneResourcesAssetPackages } from '@/services/package/resources/index';
import ProCard from '@ant-design/pro-card';
import { getfilesize, parseDuration } from '@/utils/utils';
import QRCode from 'qrcode.react';
import Icon from '@/assets/Icon.png';
import { Tooltip } from 'antd';
import IconFont from '@/components/IconFont/index';
import { useParams } from 'umi';
import TableShow from './components/TableShow';
import assetsTableName from './assetsTableName';
import styles from './index.less';

interface TableColumnsParams {
  title: string;
  dataIndex: string;
}

interface RouterUrlParams {
  source: string;
  platform: string;
  id: string;
}

interface GitLabTableData {
  branch: string;
  hash: string;
  repo: string;
}

interface ParametersTableData {
  name: string;
  value: string;
}

interface ConPkgTableDataParams {
  [key: string]: any;
}

interface BuildStagesParams {
  duration: number;
  name: string;
  status: string;
}

interface BuildParams {
  id: number;
  job_name: string;
  stages: BuildStagesParams[];
}

interface CoInfoPkgTableDataParams {
  id: number;
  job_name: string;
  jenkins: string;
  author: string;
  duration: string;
}

interface ReturnDetailInfoParams {
  name: string;
  jenkins: string;
  size: number;
  assets_hash: string;
  dev_version: string;
  version: number;
  assets_version: number;
  hashes: string;
  hash: string;
  build_type: string;
  use_for: string;
  author: string;
  duration: number;
  download_url: string;
  log_url: string;
  install_url: string;
  build: BuildParams;
  gitlab?: GitLabTableData[];
  parameters?: ParametersTableData[];
}

const returnDetailInfo = (res: ReturnDetailInfoParams) => {
  return {
    name: res.name,
    jenkins: res.jenkins,
    size: res.size,
    assets_hash: res.assets_hash,
    dev_version: res.dev_version,
    version: res.version,
    assets_version: res.assets_version,
    hashes: res.hashes,
    hash: res.hash,
    build_type: res.build_type,
    use_for: res.use_for,
    author: res.author,
    duration: res.duration,
    download_url: res.download_url,
    log_url: res.log_url,
    install_url: res.install_url,
    build: res.build,
  };
};

const PackageDetail: React.FC<{}> = () => {
  const urlParams: RouterUrlParams = useParams();
  // 包体信息
  const [detailInfo, setDetailInfo] = useState<ReturnDetailInfoParams>();
  const [pkgInfoTableData, setPkgInfoTableData] = useState<ReturnDetailInfoParams[]>([]);
  const [pkgInfoTableColumns, setPkgInfoTableColumns] = useState<TableColumnsParams[]>([]);

  // gitLab信息
  const [gitLabPkgTableData, setGitLabPkgTableData] = useState<GitLabTableData[]>([]);

  // 构建参数
  const [conPkgTableConfig, setConPkgTableConfig] = useState<TableColumnsParams[]>([]);
  const [conPkgTableData, setConPkgTableData] = useState<ConPkgTableDataParams[]>([]);

  // 构建信息
  const [coInfoPkgTableConfig, setCoInfoPkgTableConfig] = useState<TableColumnsParams[]>([]);
  const [coInfoPkgTableData, setCoInfoPkgTableData] = useState<CoInfoPkgTableDataParams[]>([]);

  // 组装包体信息数据
  const assemblyPkgInfo = async (res: ReturnDetailInfoParams) => {
    const colums = assetsTableName.pkgInfoTableCofigData.filter((item) =>
      item.source.includes(urlParams.source),
    );
    setPkgInfoTableColumns(colums);
    const info = await returnDetailInfo(res);
    setDetailInfo(info);
    const pkgParse = JSON.parse(JSON.stringify(info));
    pkgParse.size = getfilesize(pkgParse.size);
    setPkgInfoTableData([pkgParse]);
  };
  // 组装gitlab数据
  const assemblyGitlabInfo = (res: ReturnDetailInfoParams) => {
    const { gitlab } = res;
    setGitLabPkgTableData(gitlab ?? []);
  };

  // 组装构建参数
  const assemblyconPkgInfo = (res: ReturnDetailInfoParams) => {
    const { parameters } = res;
    const arr = parameters && parameters.length > 0 ? parameters : [];
    const titleArr = arr.map((item: ParametersTableData) => {
      return {
        title: item.name,
        dataIndex: item.name,
      };
    });
    setConPkgTableConfig(titleArr);
    const obj = {};
    arr.forEach((item) => {
      obj[item.name] = item.value;
    });
    setConPkgTableData([obj]);
  };

  // 组装构建信息
  const assemblyconInfoPkg = (res: ReturnDetailInfoParams) => {
    const { build, jenkins, author } = res;
    const obj = {
      id: build.id,
      job_name: build.job_name,
      jenkins,
      author,
      duration: '',
    };
    let allTime = 0;
    const stages = build.stages && build.stages.length > 0 ? build.stages : [];
    const titleStages = stages.map((item, index) => {
      return {
        title: item.name,
        dataIndex: `prop${index}`,
      };
    });

    titleStages.push({
      title: '共计耗时',
      dataIndex: 'duration',
    });
    stages.forEach((item1, index1) => {
      obj[`prop${index1}`] =
        item1.status === '成功'
          ? parseDuration(item1.duration)
          : `${item1.status}（${parseDuration(item1.duration)}`;
      allTime += item1.duration && item1.duration !== null ? item1.duration : 0;
    });
    obj.duration = parseDuration(allTime);
    const endTiltleArr = assetsTableName.coInfoPkgTableConfigData.concat(titleStages);
    setCoInfoPkgTableConfig(endTiltleArr);
    setCoInfoPkgTableData([obj]);
  };

  const getInfoDetails = async () => {
    const res =
      urlParams.source === 'installation'
        ? await getOneInstallationPackages(urlParams.id)
        : await getOneResourcesAssetPackages(urlParams.id);
    if (res?.data) {
      assemblyPkgInfo(res.data);
      assemblyGitlabInfo(res.data);
      assemblyconPkgInfo(res.data);
      assemblyconInfoPkg(res.data);
    }
  };

  useEffect(() => {
    getInfoDetails();
  }, []);
  return (
    <PageContainer>
      <ProCard ghost style={{ marginBottom: '20px' }}>
        <ProCard colSpan={16} bordered>
          <TableShow
            tableColumns={pkgInfoTableColumns}
            tableData={pkgInfoTableData}
            type="box"
            title="包体信息"
            iconColor="#409EFF"
          />
          <div style={{ marginBottom: '20px' }} />
          <TableShow
            tableColumns={assetsTableName.gitLabPkgConfigData}
            tableData={gitLabPkgTableData}
            type="gitlab"
            title="GitLab"
          />
        </ProCard>
        <ProCard
          colSpan={8}
          className={styles.qrcode}
          bordered
          style={{ minWidth: '330px', margin: '0 auto', backgroundColor: '#f0f2f5' }}
        >
          {detailInfo &&
            urlParams.source === 'installation' &&
            urlParams.platform !== 'standalone' && (
              <QRCode
                size={300}
                value={
                  urlParams.platform === 'android'
                    ? detailInfo?.download_url
                    : detailInfo?.install_url
                }
                imageSettings={{
                  src: Icon,
                  height: 80,
                  width: 80,
                }}
              />
            )}
          {!(urlParams.source === 'installation' && urlParams.platform !== 'standalone') && (
            <img src={Icon} alt="默认图片" width={300} height={300} />
          )}
          <div className={styles.iconSyles}>
            <Tooltip placement="top" title="下载">
              <IconFont
                className={styles.iconHover}
                type={`icon-${urlParams.platform}`}
                onClick={() => {
                  window.open(detailInfo?.download_url, '_self');
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title="日志">
              <IconFont
                className={styles.iconHover}
                type="icon-survey1"
                onClick={() => window.open(detailInfo?.log_url, '_blank')}
              />
            </Tooltip>
            <Tooltip placement="top" title="通知">
              <IconFont className={styles.iconHover} type="icon-guide" />
            </Tooltip>
          </div>
        </ProCard>
      </ProCard>
      <ProCard ghost style={{ marginBottom: '20px' }}>
        <ProCard colSpan={24} bordered>
          <TableShow
            tableColumns={conPkgTableConfig}
            tableData={conPkgTableData}
            type="canshuguanli"
            title="构建参数"
            iconColor="#409EFF"
          />
        </ProCard>
      </ProCard>
      <ProCard ghost style={{ marginBottom: '20px' }}>
        <ProCard colSpan={24} bordered>
          <TableShow
            tableColumns={coInfoPkgTableConfig}
            tableData={coInfoPkgTableData}
            type="canshuzhihang"
            title="构建信息"
            iconColor="#409EFF"
          />
        </ProCard>
      </ProCard>
      <ProCard ghost>
        <ProCard colSpan={24} bordered>
          <TableShow
            tableColumns={assetsTableName.checkReportData}
            tableData={[]}
            type="form1"
            title="检查报告"
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default PackageDetail;
