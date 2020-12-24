import React from 'react'
import ProTable from '@ant-design/pro-table'
import IconFont from '@/components/IconFont/index'

interface TableColumnsParams {
  title: string,
  dataIndex: string
}
interface TableDataParams {
  [key: string]: any
}



interface TableShowProps {
  tableColumns: TableColumnsParams[],
  tableData: TableDataParams[],
  type: string,
  title: string,
  iconColor?: string
}


const TableShow: React.FC<TableShowProps> = (props) => {
  const { tableColumns, tableData, type, title, iconColor } = props
  return (
    <>
      <p><IconFont type={`icon-${type}`} style={{fontSize: '18px', color: iconColor}}/> <span>{title}</span></p>
      <ProTable columns={tableColumns} rowKey='name' search={false} pagination={false} options={false} dataSource={tableData} />
    </>
  )
}

export default TableShow