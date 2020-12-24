import React, {useState} from 'react'
import { PageContainer, GridContent } from '@ant-design/pro-layout'
import { Row, Col } from 'antd'
import { TestModuleDataType } from '@/services/autotest/module/index.d'
import ParentInspection from './components/ParentTest'
import ChildrenInspection from './components/ChildrenTest'

const InspectionModule: React.FC<{}> = () => {
  const [currentParentRow, setCurrentParentRow] = useState<TestModuleDataType>({
    name: '',
    id: '',
    description: ''
  })
  const getCurrentCheckRow =(record:TestModuleDataType) => {  
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