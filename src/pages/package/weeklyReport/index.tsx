import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { DatePicker, Spin } from 'antd';
import moment from 'moment';
import { getReportsBuildDatas } from '@/services/package/weeklyReport/index';
import ProCard from '@ant-design/pro-card';
import LineChart from './components/LineChart';

interface DealWithChartParams {
  average_time: number;
  count: number;
  total_time: number;
}

const dealWithChartData = (arr: DealWithChartParams[], timeArr: string[]) => {
  if (arr.length === 0) {
    return [];
  }
  const countsArr = arr.map((item, index) => {
    return {
      name: '数量',
      day: timeArr[index],
      value: item.count,
    };
  });
  const sArr = arr.map((item, index) => {
    return {
      name: '平均时长',
      day: timeArr[index],
      value: Number((item.average_time / 60).toPrecision(4)),
    };
  });
  const endData = [...countsArr, ...sArr];
  return endData;
};

const sconcaulateTime = (s: number, e: number) => {
  let time = s;
  const arr = [];
  while (time < e) {
    arr.push(time);
    time += 24 * 3600;
  }
  const timeArr = arr.map((item) => moment(item * 1000).format('YYYY-MM-DD'));
  return timeArr;
};

const PackageWeeklyReport: React.FC<{}> = () => {
  const [showSpinning, setShowSpinning] = useState<boolean>(false);
  const [androidArrs, setAndroidArrs] = useState<never[]>([]);
  const [iOSArrs, setIOSArrs] = useState<never[]>([]);
  const [standaloneArrs, setStandaloneArrs] = useState<never[]>([]);
  const [unetArrs, setUnetArrs] = useState<never[]>([]);
  const getReportsBuildData = async (to: number, from: number) => {
    const res = await getReportsBuildDatas({
      to,
      from,
    });
    if (res?.data) {
      const { android, ios, standalone, unet } = res.data;
      const timeArr = sconcaulateTime(from, to);
      const androidArr = dealWithChartData(android, timeArr);
      setAndroidArrs(androidArr as never[]);
      const iOSArr = dealWithChartData(ios, timeArr);
      setIOSArrs(iOSArr as never[]);
      const standaloneArr = dealWithChartData(standalone, timeArr);
      setStandaloneArrs(standaloneArr as never[]);
      const unetArr = dealWithChartData(unet, timeArr);
      setUnetArrs(unetArr as never[]);
    }
    setShowSpinning(false);
  };
  const onChange = (dateString: string) => {
    setShowSpinning(true);
    const info = `${dateString} 23:59:59`;
    const to = moment(info).unix();
    const from = to + 1 - 3600 * 24 * 7;
    getReportsBuildData(to, from);
  };
  useEffect(() => {
    setShowSpinning(true);
    const to = moment(`${moment().format('YYYY-MM-DD')} 23:59:59`).unix();
    const from = to + 1 - 3600 * 24 * 7;
    getReportsBuildData(to, from);
  }, []);
  return (
    <PageContainer>
      <DatePicker
        onChange={(date, dateString) => onChange(dateString)}
        defaultValue={moment()}
        style={{ marginBottom: '20px' }}
      />
      <ProCard direction="column" ghost gutter={[0, 8]}>
        <ProCard bordered>
          <Spin spinning={showSpinning} tip="loading...">
            <LineChart chartData={androidArrs} title="Android" />
          </Spin>
        </ProCard>
        <ProCard bordered>
          <Spin spinning={showSpinning} tip="loading...">
            <LineChart chartData={iOSArrs} title="iOS" />
          </Spin>
        </ProCard>
        <ProCard bordered>
          <Spin spinning={showSpinning} tip="loading...">
            <LineChart chartData={standaloneArrs} title="Standalone" />
          </Spin>
        </ProCard>
        <ProCard bordered>
          <Spin spinning={showSpinning} tip="loading...">
            <LineChart chartData={unetArrs} title="Unet" />
          </Spin>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default PackageWeeklyReport;
