import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { parseDuration } from '@/utils/utils';

interface LineCharPropParams {
  chartData: never[];
  title: string;
}

const LineChart: React.FC<LineCharPropParams> = (props) => {
  const defaultConfig = {
    data: [],
    xField: 'day',
    yField: 'value',
    seriesField: 'name',
    smooth: true,
    enterable: true,
    label: {},
    point: {},
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.name,
          value: datum.name === '数量' ? `${datum.value}次` : parseDuration(datum.value * 60, true),
        };
      },
    },
    animateOption: {
      min: 0,
    },
    animation: {
      appear: {
        duration: 5000,
      },
    },
  };
  const { chartData, title } = props;
  const [lineConfig, setLineConfig] = useState(defaultConfig);
  useEffect(() => {
    defaultConfig.data = chartData;
    setLineConfig(defaultConfig);
  }, [chartData]);
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>{title}</h1>
      {chartData && <Line {...lineConfig} />}
    </>
  );
};

export default LineChart;
