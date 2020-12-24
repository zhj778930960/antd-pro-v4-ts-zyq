import React, {useState} from 'react'
import { PageContainer, GridContent } from '@ant-design/pro-layout'
import { Row, Col } from 'antd'
import { DictionaryDataType } from '@/services/system/dictionary/index.d'
import ParentDictionary from './components/ParentDictionary'
import ChildDictionary from './components/ChildrenDictionary'

const Dictionary: React.FC<{}> = () => {
  const [currentParentRow, setCurrentParentRow] = useState({
    name: '',
    id: '',
    description: ''
  })
  const getCurrentCheckRow =(record:DictionaryDataType) => {
    setCurrentParentRow(record)
  }
  return (
    <PageContainer>
      <GridContent>
        <Row gutter={24}>
          <Col lg={12} md={24} sm={24} xs={24}  >
            <div>
              <ParentDictionary getCurrentCheckRow={(a) => getCurrentCheckRow(a)} />
            </div>
          </Col>
          <Col lg={12} md={24} sm={24} xs={24}  >
            <ChildDictionary currentRow={currentParentRow} />
          </Col>
        </Row>
      </GridContent>
    </PageContainer>
  )
}

export default Dictionary