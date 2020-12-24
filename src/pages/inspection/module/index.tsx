import React, {useState} from 'react'
import { PageContainer, GridContent } from '@ant-design/pro-layout'
import { Row, Col } from 'antd'
import { InspectionModuleDataType } from '@/services/inspection/module/index.d'
import ParentInspection from './components/ParentInspection'
import ChildrenInspection from './components/ChildrenInspection'

const InspectionModule: React.FC<{}> = () => {
  const [currentParentRow, setCurrentParentRow] = useState<InspectionModuleDataType>({
    name: '',
    id: '',
    description: ''
  })
  const getCurrentCheckRow =(record:InspectionModuleDataType) => {  
    setCurrentParentRow(record)
  }
  return (
    <PageContainer>
      <GridContent>
        <Row gutter={24}>
          <Col lg={12} md={24} sm={24} xs={24}  >
            <div>
              <ParentInspection getCurrentCheckRow={(record) => getCurrentCheckRow(record)} />
            </div>
          </Col>
          <Col lg={12} md={24} sm={24} xs={24}  >
            <ChildrenInspection currentRow={currentParentRow} />
          </Col>
        </Row>
      </GridContent>
    </PageContainer>
  )
}

export default InspectionModule