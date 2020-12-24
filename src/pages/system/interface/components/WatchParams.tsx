import React from 'react'
import { Modal } from 'antd'
import JSONPretty from 'react-json-pretty';

const JSONPrettyMon = require('react-json-pretty/dist/monikai');

interface WatchParamsProps {
  params?: string,
  method?: string,
  interface_name?: string,
  created_time?: string
}
interface PropsParamsType {
  modalParamsVisible: boolean,
  currentRow: WatchParamsProps,
  onModalParamsVisable: () => void
}
const WathchParams: React.FC<PropsParamsType> = (props) => {
  const { modalParamsVisible, currentRow, onModalParamsVisable } = props
  return (
    <Modal title='详情查看' visible={modalParamsVisible} onCancel={onModalParamsVisable} footer={false}>
      <p>请求方式：<span>{currentRow.method}</span></p>
      <p>请求接口：<span>{currentRow.interface_name}</span></p>
      <p>调用时间：<span>{currentRow.created_time}</span></p>
      <p>参数：</p>
      <JSONPretty 
          id="json-pretty" 
          data={currentRow.params ? JSON.parse(currentRow.params) : ''} 
          theme={JSONPrettyMon} />
    </Modal>
  )
}

export default WathchParams