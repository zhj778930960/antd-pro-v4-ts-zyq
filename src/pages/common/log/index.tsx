import React, { useEffect, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { getTaskLogs, getOneDetail } from '@/services/task/executionDetail/index';
import { getChilrenItemsLog, getChilrenItemsDetail } from '@/services/inspection/inspection/index';
import { getTestsLog, getTestsDetails } from '@/services/autotest/test/index';
// require styles
import 'codemirror/lib/codemirror.css';
// require active-line.js
import 'codemirror/addon/selection/active-line.js';
// theme css
import 'codemirror/theme/base16-light.css';
import 'codemirror/mode/python/python';
import { useParams } from 'umi';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';

interface RouterUrlParams {
  id: string;
  name: string;
}

interface DetailInfoParams {
  name: string;
  id: string;
}

const CommonLog: React.FC<{}> = () => {
  const urlParams: RouterUrlParams = useParams();
  const [code, setCode] = useState<string>('');
  const dealWithData = (info: DetailInfoParams, res: string) => {
    const { name, id: iid } = info;
    const codeInfo = `\n名称: ${name}   id：${iid}`;
    const lineLength = Array(codeInfo.length).fill('-').join('-');
    setCode(`${codeInfo}\n\n${lineLength}\n\n${res}`);
  };
  // 获取 task log
  const getTaskLog = async () => {
    const { id } = urlParams;
    const res = await getTaskLogs({ id });
    const info = await getOneDetail({ id });
    if (res?.status === '00000') {
      dealWithData(info.data, res.data);
    } else {
      notifyInfoTip('', '', false, res.message);
    }
  };

  const getChilrenItemsLogs = async () => {
    const { id } = urlParams;
    const res = await getChilrenItemsLog({ id });
    const info = await getChilrenItemsDetail({ id });
    if (res?.status === '00000') {
      dealWithData(info.data, res.data);
    } else {
      notifyInfoTip('', '', false, res.message);
    }
  };

  const getTestLogs = async () => {
    const { id } = urlParams;
    const res = await getTestsLog({ id });
    const info = await getTestsDetails({ id });
    if (res?.status === '00000') {
      dealWithData(info.data, res.data);
    } else {
      notifyInfoTip('', '', false, res.message);
    }
  };

  const checkName = (name: string) => {
    switch (name) {
      case 'test':
        getTestLogs();
        break;
      case 'task':
        getTaskLog();
        break;
      case 'inspectionContent':
        getChilrenItemsLogs();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const { name } = urlParams;
    checkName(name);
  }, []);

  return (
    <div className={styles.container}>
      <CodeMirror
        className={styles.mirrorHeight}
        value={code}
        options={{
          tabSize: 4,
          mode: 'text/x-python',
          theme: 'base64-light',
          lineNumbers: true,
          smartIndent: true,
          line: true,
          lineWrapping: true, // 自动换行
          readOnly: true,
          styleActiveLine: true,
        }}
      />
    </div>
  );
};

export default CommonLog;
