import React, { useState, useEffect } from 'react'
import { getInspectionDetailCode } from '@/services/inspection/inspection/index'
import { Modal, Spin } from 'antd'
import { UnControlled as CodeMirror } from 'react-codemirror2'
// require styles
import 'codemirror/lib/codemirror.css';
// require active-line.js
import 'codemirror/addon/selection/active-line.js';
// theme css
import 'codemirror/theme/base16-light.css';
import 'codemirror/mode/python/python';
import styles from '../index.less'

interface FailureDetailProps {
  modalVisiable: boolean,
  reportUrl: string,
  onModalCancel: () => void
}

const FailureDetail: React.FC<FailureDetailProps> = (props) => {
  const { modalVisiable, reportUrl, onModalCancel } = props
  const [code, setCode] = useState<string>('')
  const [showSpinning, setShowSpinning] = useState<boolean>(false)
  const getDetailLogInfo = async () => {
    if (!reportUrl) {
      setShowSpinning(false) 
      return
    }
    const res = await getInspectionDetailCode(reportUrl)
    setCode(res)
    setShowSpinning(false)
  }
  useEffect(() => {
    setShowSpinning(true)
    getDetailLogInfo()
  }, [reportUrl])
  return (
    <Modal forceRender destroyOnClose title='不通过详情' visible={modalVisiable} footer={false} onCancel={onModalCancel} width="80%">
      <Spin spinning={showSpinning}>
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
              styleActiveLine: true
            }}
          />
        </div>
      </Spin>
    </Modal>

  )
}
export default FailureDetail