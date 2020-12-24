import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import moment from 'moment'
import { getReportsInspectionDatas } from '@/services/inspection/weeklyReport/index'
import { getReportsBuildDatas } from '@/services/package/weeklyReport/index'
import { Statistic, Spin, DatePicker } from 'antd';
import LineChart from '@/pages/package/weeklyReport/components/LineChart'
import styles from './Welcome.less';

const { Divider } = ProCard;


interface DataArrParams {
  interrupt: number,
  label: string,
  nopass: number,
  pass: number,
  passingRate: number,
  total: number
}

interface BuildsParams {
  average_time: number,
  count: number,
  total_time: number
}

interface ItemsDataParams {
  name: string,
  builds: BuildsParams[]
}

interface RequestDataParams {
  items: ItemsDataParams[],
  name: string
}

interface OneDealWithDataParams {
  interrupt: number,
  nopass: number,
  pass: number,
  total: number
}

interface OneDealWithData {
  label: string,
  data: OneDealWithDataParams[]
}




const reduceCounts = (data: BuildsParams[]) => {
  const arr = data.map((item) => item.count);
  const total = arr.reduce((acc: number, cur: number) => {
    return acc + cur;
  }, 0);
  const pass = arr[2];
  const nopass = total - pass;
  const interrupt = arr[4];
  return {
    total,
    pass,
    nopass,
    interrupt
  };
}
const dealWithItems = (arr: ItemsDataParams[]) => {
  const a = arr.map((item) => {
    const info = reduceCounts(item.builds);
    return {
      ...info
    };
  });
  return a;
}

const endReduceCounts = (data: OneDealWithDataParams[], label: string) => {
  const total = data.map((item) => item.total).reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  const pass = data.map((item) => item.pass).reduce((acc, cur) => {
    return acc + cur;
  }, 0);;
  const nopass = data.map((item) => item.nopass).reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  const interrupt = data.map((item) => item.interrupt).reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  const passingRate =
    pass !== 0 && total !== 0 ? pass / total : 0;

  return {
    label,
    total,
    pass,
    nopass,
    interrupt,
    passingRate
  };
}



interface DealWithChartParams {
  average_time: number,
  count: number,
  total_time: number
}

const dealWithChartData = (arr: DealWithChartParams[], timeArr: string[]) => {
  if (arr.length === 0) {
    return []
  }
  const countsArr = arr.map((item, index) => {
    return {
      name: '数量',
      day: timeArr[index],
      value: item.count
    }
  })
  const sArr = arr.map((item, index) => {
    return {
      name: '平均时长（分）',
      day: timeArr[index],
      value: Number((item.average_time / 60).toPrecision(4))
    }
  })
  const endData = [...countsArr, ...sArr]
  return endData
}



const sconcaulateTime = (s: number, e: number) => {
  let time = s;
  const arr = [];
  while (time < e) {
    arr.push(time);
    time += 24 * 3600;
  }
  const timeArr = arr.map(item => moment(item * 1000).format('YYYY-MM-DD'));
  return timeArr;
}

const mergetSameDayData = (item1: BuildsParams[]) => {
  const count = item1.reduce((acc, cur) => {
    return acc + cur.count
  }, 0);
  const average_time = item1.reduce((acc, cur) => {
    return acc + cur.average_time
  }, 0);
  const total_time = item1.reduce((acc, cur) => {
    return acc + cur.total_time
  }, 0);
  return {
    count,
    average_time,
    total_time
  }
}


const Welcome: React.FC<{}> = () => {

  const [dateArr, setDateArr] = useState<DataArrParams>({
    interrupt: 0,
    label: '',
    nopass: 0,
    pass: 0,
    passingRate: 0,
    total: 0
  })
  const [showPackageSpinning, setShowPackageSpinning] = useState<boolean>(false)
  const [showInspecSpinning, setShowInspecSpinning] = useState<boolean>(false)

  const [packageDownData, setPackageDownData] = useState<never[]>([])
  const getReportsInspectionData = async (to: number, from: number) => {
    const res = await getReportsInspectionDatas({
      to,
      from
    })
    if (res?.data) {
      const arr = res.data.map((item: RequestDataParams) => {
        const info = dealWithItems(item.items);
        return {
          label: item.name,
          data: info
        };
      });
      const arr1 = arr.map((item1: OneDealWithData) => {
        const infos = endReduceCounts(item1.data, item1.label);
        return {
          ...infos
        };
      });
      const totalPoins = endReduceCounts(arr1, '预检查总运行情况');
      setDateArr(totalPoins)
    }
    setShowInspecSpinning(false)
  }
  const getReportsBuildData = async (to: number, from: number) => {
    const res = await getReportsBuildDatas({
      to,
      from
    })
    if (res?.data) {
      const { android, ios, standalone, unet } = res.data
      const timeArr = sconcaulateTime(from, to)
      const arr: BuildsParams[][] = []
      new Array(timeArr.length).fill(0).forEach((item, index) => {
        arr[index] = []
        arr[index].push(android[index])
        arr[index].push(ios[index])
        arr[index].push(standalone[index])
        arr[index].push(unet[index])
      })
      const endArr: BuildsParams[] = []
      arr.forEach((item1: BuildsParams[]) => {
        endArr.push(mergetSameDayData(item1))
      })
      const endData = dealWithChartData(endArr, timeArr);
      setPackageDownData(endData as never[])
      setShowPackageSpinning(false)
    }
  }

  const onChange = (dateString: string) => {
    setShowPackageSpinning(true)
    setShowInspecSpinning(true)
    const info = `${dateString} 23:59:59`
    const to = moment(info).unix()
    const from = to + 1 - 3600 * 24 * 7;
    getReportsInspectionData(to, from)
    getReportsBuildData(to, from)
  }

  useEffect(() => {
    setShowPackageSpinning(true)
    setShowInspecSpinning(true)
    const to = moment(`${moment().format('YYYY-MM-DD')} 23:59:59`).unix()
    const from = to + 1 - 3600 * 24 * 7;
    getReportsInspectionData(to, from)
    getReportsBuildData(to, from)
  }, [])

  return (
    <PageContainer>
      <DatePicker onChange={(date, dateString) => onChange(dateString)} defaultValue={moment()} style={{marginBottom: '20px'}}/>
      <Spin spinning={showInspecSpinning} tip='loading...'>
        <ProCard.Group title={dateArr.label} style={{ marginBottom: '20px' }} >
          <ProCard>
            <Statistic title="共计" value={dateArr.total} className={styles.totalColor} style={{ color: '#40c9c6', borderColor: 'red' }} />
          </ProCard>
          <Divider />
          <ProCard>
            <Statistic title="通过" className={styles.passColor} value={dateArr.pass} />
          </ProCard>
          <Divider />
          <ProCard>
            <Statistic title="未通过" className={styles.nopassColor} value={dateArr.nopass} />
          </ProCard>
          <ProCard>
            <Statistic title="中断" className={styles.interruptColor} value={dateArr.interrupt} />
          </ProCard>
          <ProCard>
            <Statistic title="通过率" className={styles.passingRateColor} value={dateArr.passingRate * 100} precision={2} suffix='%' />
          </ProCard>
        </ProCard.Group>
      </Spin>
      <ProCard bordered>
        <Spin spinning={showPackageSpinning} tip='loading...'><LineChart chartData={packageDownData} title='包管理' /></Spin>
      </ProCard>
    </PageContainer>
  )
}

export default Welcome