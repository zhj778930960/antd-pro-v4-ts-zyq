import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Button, Statistic, Tooltip, Row, Col, Space } from 'antd';
import { SnippetsOutlined, FileSearchOutlined, RedoOutlined } from '@ant-design/icons';
import { getChilrenItems, getItemsDetails } from '@/services/inspection/inspection/index';
import { filterDictionaries } from '@/utils/utils';
import { getAllChildren } from '@/services/system/dictionary/index';
import { getOneDetail } from '@/services/task/executionDetail/index';
import { useParams } from 'umi';
import FailureDetail from './components/FailureDetail';
import NotifyUsers from './components/NotifyUsers';

import styles from './index.less';
// 用户管理http
const { Divider } = ProCard;

interface RouterUrlParams {
  id: string;
  source: string;
}

interface ChildrenItemsParams {
  branch: string;
  status: number;
  name: string;
  report_url: string;
  updated_time: string;
  id: string;
  hashes: string;
  build_type?: string;
  abort_reason?: string;
}

interface DictionariesParamsType {
  label: string;
  id: string;
  value: string;
}

// 获取task_status 字典项
const getTaskStatusDictionary = async (
  setTaskStatusDict: (data: DictionariesParamsType[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'task_status',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setTaskStatusDict(res.data);
  }
};

// 获取package_build_type 字典项
const getPackageBuildTypeDictionary = async (
  setPackageBuildTypeDict: (data: DictionariesParamsType[]) => void,
) => {
  const res = await getAllChildren({
    dictName: 'package_build_type',
    sort: 'value,asc',
  });
  if (res?.status === '00000') {
    setPackageBuildTypeDict(res.data);
  }
};

interface PassCheckParams {
  pass: number;
  total: number;
}

const getChilrenItemsDetails = async (
  id: string,
  source: string,
  setInspectionDetailInfo: (data: ChildrenItemsParams) => void,
) => {
  const res = source === 'inspection' ? await getItemsDetails({ id }) : await getOneDetail({ id });
  if (res?.status === '00000') {
    setInspectionDetailInfo(res.data);
  }
};

const InspectionDetail: React.FC<{}> = () => {
  const params: RouterUrlParams = useParams();
  const [taskStatusDict, setTaskStatusDict] = useState<DictionariesParamsType[]>([]);
  const [packageBuildType, setPackageBuildTypeDict] = useState<DictionariesParamsType[]>([]);
  const [childInspectionItems, setChildInspectionItems] = useState<ChildrenItemsParams[]>([]);
  const [modalVisiable, setModalVisiable] = useState<boolean>(false);
  const [reportUrl, setReportUrl] = useState<string>('');
  const [passCheckParams, setPassCheckParams] = useState<PassCheckParams>({
    pass: 0,
    total: 0,
  });
  const [cardLoading, setCardLoading] = useState<boolean>(false);
  const [inspectionDetailInfo, setInspectionDetailInfo] = useState<ChildrenItemsParams>();

  const getChilrenItem = async () => {
    const res = await getChilrenItems({
      parent_id: params.id,
      is_expanded: true,
      sort: 'created_time,desc',
    });
    if (res?.status === '00000') {
      setChildInspectionItems(res.data);
      setCardLoading(false);
      const pass = res.data.filter((item: ChildrenItemsParams) => item.status === 2).length ?? 0;
      const total = res.data.length ?? 0;
      setPassCheckParams({
        pass,
        total,
      });
    }
  };

  const refreshPage = () => {
    setCardLoading(true);
    getChilrenItemsDetails(params.id, params.source, setInspectionDetailInfo);
    getTaskStatusDictionary(setTaskStatusDict);
    getPackageBuildTypeDictionary(setPackageBuildTypeDict);
    getChilrenItem();
  };

  useEffect(() => {
    refreshPage();
  }, []);

  return (
    <PageContainer>
      <ProCard.Group title="基本信息" style={{ marginBottom: '10px' }}>
        <ProCard>
          <div className="ant-statistic-title">任务名称</div>
          <div className="ant-statistic-content">{inspectionDetailInfo?.name}</div>
        </ProCard>
        <Divider />
        <ProCard>
          <div className="ant-statistic-title">版本</div>
          <div className="ant-statistic-content">
            {filterDictionaries(inspectionDetailInfo?.build_type ?? '', packageBuildType)}
          </div>
        </ProCard>
        <Divider />
        <ProCard>
          <div className="ant-statistic-title">分支名称</div>
          <div className="ant-statistic-content">{inspectionDetailInfo?.branch}</div>
        </ProCard>
        <Divider />
        <ProCard>
          <Statistic
            title="通过检查"
            value={passCheckParams.pass}
            suffix={`/ ${passCheckParams.total}`}
          />
        </ProCard>
        <ProCard>
          <div className="ant-statistic-title">操作</div>
          <div className="ant-statistic-content">
            <Space>
              <RedoOutlined className={styles.iconFontSize} onClick={refreshPage} />
              <NotifyUsers />
            </Space>
          </div>
        </ProCard>
      </ProCard.Group>
      <Row gutter={15}>
        {childInspectionItems &&
          childInspectionItems.map((item) => {
            return (
              <Col
                xxl={6}
                xl={8}
                lg={8}
                md={12}
                sm={24}
                xs={24}
                style={{ marginBottom: '10px' }}
                key={`col${item.id}`}
              >
                <ProCard
                  loading={cardLoading}
                  title={item.name}
                  key={item.id}
                  headerBordered
                  actions={[
                    <Tooltip placement="top" title="详情">
                      <Button
                        type="link"
                        key={`snippetBtn${item.id}`}
                        disabled={item.status !== 3}
                        onClick={() => {
                          setReportUrl(item.report_url);
                          setModalVisiable(true);
                        }}
                      >
                        <SnippetsOutlined key="snippets" />
                      </Button>
                    </Tooltip>,
                    <Tooltip placement="top" title="日志">
                      <Button
                        type="link"
                        key={`api${item.id}`}
                        disabled={item.status <= 0}
                        onClick={() => window.open(`/inspectionContent/log/${item.id}`, '_blank')}
                      >
                        <FileSearchOutlined key="fileSearch" />
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <div style={{ height: '250px', overflowY: 'auto' }} key={`content${item.id}`}>
                    <p>分支信息：{item.branch}</p>
                    <p>
                      库信息：<span className={styles.textWordWrap}>{item.hashes}</span>
                    </p>
                    <p>执行时间：{item.updated_time}</p>
                    <p>
                      结果：{' '}
                      <span className={styles[`status${item.status}`]}>
                        {filterDictionaries(String(item.status), taskStatusDict)}
                      </span>
                    </p>
                    {item.status === 4 && (
                      <p>
                        中断原因：{' '}
                        <span className={styles.delColor}>{item.abort_reason ?? '无'}</span>
                      </p>
                    )}
                  </div>
                </ProCard>
              </Col>
            );
          })}
      </Row>
      <FailureDetail
        modalVisiable={modalVisiable}
        reportUrl={reportUrl}
        onModalCancel={() => setModalVisiable(false)}
      />
    </PageContainer>
  );
};

export default InspectionDetail;
