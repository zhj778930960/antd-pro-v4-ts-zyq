import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { DatePicker, Statistic, Spin } from 'antd'
import moment from 'moment'
import { getReportsInspectionDatas } from '@/services/inspection/weeklyReport/index'
import ProCard from '@ant-design/pro-card';
import styles from './index.less'

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
const InspectionWeeklyReport: React.FC<{}> = () => {
  const [showSpinning, setShowSpinning] = useState<boolean>(false)
  const [dateArr, setDateArr] = useState<DataArrParams[]>([])
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
      const totalPoins = endReduceCounts(arr1, '总运行情况');
      const endArr = [
        totalPoins,
        ...arr1
      ];
      setDateArr(endArr)
    }
    setShowSpinning(false)
  }
  const onChange = (dateString: string) => {
    setShowSpinning(true)
    const info = `${dateString} 23:59:59`
    const to = moment(info).unix()
    const from = to + 1 - 3600 * 24 * 7;
    getReportsInspectionData(to, from)
  }

  useEffect(() => {
    setShowSpinning(true)
    const to = moment(`${moment().format('YYYY-MM-DD')} 23:59:59`).unix()
    const from = to + 1 - 3600 * 24 * 7;
    getReportsInspectionData(to, from)
  }, [])
  return (
    <PageContainer>
      <DatePicker onChange={(date, dateString) => onChange(dateString)} defaultValue={moment()} style={{ marginBottom: '20px' }} />
      {
        dateArr && dateArr.map((item) => {
          return (
            <Spin spinning={showSpinning} tip='loading...' key={`${item.label}`}>
              <ProCard.Group title={item.label}  style={{ marginBottom: '20px' }} >
                <ProCard>
                  <Statistic title="共计" value={item.total} className={styles.totalColor} style={{ color: '#40c9c6', borderColor: 'red' }} />
                </ProCard>
                <Divider />
                <ProCard>
                  <Statistic title="通过" className={styles.passColor} value={item.pass} />
                </ProCard>
                <Divider />
                <ProCard>
                  <Statistic title="未通过" className={styles.nopassColor} value={item.nopass} />
                </ProCard>
                <ProCard>
                  <Statistic title="中断" className={styles.interruptColor} value={item.interrupt} />
                </ProCard>
                <ProCard>
                  <Statistic title="通过率" className={styles.passingRateColor} value={item.passingRate * 100} precision={2} suffix='%' />
                </ProCard>
              </ProCard.Group>
            </Spin>
          )
        })
      }
    </PageContainer>
  )
}

export default InspectionWeeklyReport