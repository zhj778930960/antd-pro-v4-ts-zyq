import React, { useState } from 'react'
import { GridContent, PageContainer } from '@ant-design/pro-layout'
import { Row, Col, Card, Button, Tree, Input, Modal } from 'antd'
import { ApartmentOutlined, DeleteOutlined } from '@ant-design/icons'
import { MenuTreeDataType } from '@/services/system/menu/index.d'
import { DataNode } from 'antd/lib/tree'
import { MenuList } from "../../../../config/routers"
import MenuForm from './components/MenuForm'
import styles from './index.less'

interface TreeTitleType {
  cardTitle: string,
  createOrDel: boolean,
  onOpen: () => void
}

interface nodeData extends DataNode {
  name?: string
}
const TreeTitle: React.FC<TreeTitleType> = (props) => {
  const { cardTitle, createOrDel, onOpen } = props
  return (
    <div className={styles.titleContainer} >
      <span>{cardTitle}</span>
      {
        createOrDel ?
          <Button type='primary' size='middle' onClick={onOpen}><ApartmentOutlined />新建</Button> :
          <Button type='ghost' danger size='middle' onClick={onOpen}><DeleteOutlined />删除</Button>
      }
    </div>
  )
}

const cardHeight = {
  height: '80vh'
}

const Menu: React.FC<{}> = () => {
  const [showVisible, setShowVisible] = useState(false)
  const [formInfo, setformInfo] = useState<MenuTreeDataType>({
    name: '',
    id: '',
    parentId: '',
    icon: '',
    hideInMenu: false,
    path: '',
    key: ''
  })
  const openCreate = () => {
    setShowVisible(true)
  }
  const cancelTreeCreate = () => {
    setShowVisible(false)
  }
  return (
    <PageContainer>
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24} sm={24} xs={24}  >
            <Card
              title={<TreeTitle cardTitle='菜单树' createOrDel onOpen={() => openCreate()} />}
              bordered={false}
              style={{ ...cardHeight, marginBottom: '10px' }}>
              <Input />
              <div>
                <Tree treeData={MenuList} titleRender={(node: nodeData) => {
                  return <span>{node.name}</span>
                }}
                  onSelect={(selectedKeys, { selectedNodes }) => {
                    const params = JSON.parse(JSON.stringify(selectedNodes[0]))
                    setformInfo(params)
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col lg={17} md={24} sm={24} xs={24}  >
            <Card title={<TreeTitle cardTitle='详情' createOrDel={false} onOpen={() => openCreate()} />} bordered={false} style={{ ...cardHeight }}>
              <MenuForm trees={MenuList} formInfo={formInfo} isCreate={false} onCancelModal={() => { }} />
            </Card>
          </Col>
        </Row>
      </GridContent>
      <Modal className={styles.menuFormModalBody} title='新建菜单' footer={false} destroyOnClose getContainer={false} visible={showVisible} onCancel={cancelTreeCreate}>
        <MenuForm trees={MenuList} formInfo={formInfo} isCreate onCancelModal={cancelTreeCreate} />
      </Modal>
    </PageContainer>
  )
}

export default Menu