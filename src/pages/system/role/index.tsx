import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RoleDataType } from '@/services/system/role/index.d';
import { getAll, del } from '@/services/system/role/index';
import { notifyInfoTip } from '@/utils/utils';
import RoleForm from './components/RoleForm';

interface GetRolesParamsType {
  current?: number;
  pageSize?: number;
}

const filterSearchParams = (rest: GetRolesParamsType) => {
  const info = {};
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item];
    }
  });
  return info;
};

const getAllRoles = async (params: GetRolesParamsType) => {
  const { current, pageSize, ...rest } = params;
  const restParams = filterSearchParams(rest);
  const res = await getAll({
    page: current,
    per_page: pageSize,
    ...restParams,
  });
  const { roles, total } = res.data;
  return {
    total,
    data: roles,
    success: true,
  };
};

const delRole = async (id: number | undefined, onCancelModal: () => void) => {
  const res = await del(id);
  if (res) {
    notifyInfoTip('角色', '删除', true);
    onCancelModal();
  } else {
    notifyInfoTip('角色', '删除', false, res.message);
  }
};

const Roles: React.FC<{}> = () => {
  const defaultFormInfo = {
    id: undefined,
    name: '',
    privileges: [],
  };
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitleState, setModalTitleState] = useState<boolean>(true);
  const actionRef = useRef<ActionType>();
  const [formInfo, setFormInfo] = useState<RoleDataType>(defaultFormInfo);
  const onCancelModal = () => {
    setModalVisible(false);
    setFormInfo(defaultFormInfo);
    actionRef.current?.reload();
  };
  const editRole = (row: RoleDataType) => {
    setFormInfo(row);
    setModalTitleState(false);
    setModalVisible(true);
  };

  const columns: ProColumns<RoleDataType>[] = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="edit"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={() => editRole(row)}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              title={
                <div>
                  是否删除角色 <span style={{ color: '#1890ff' }}>{row.name}</span> ?
                </div>
              }
              onConfirm={() => delRole(row.id, onCancelModal)}
            >
              <Button type="link" key="deleteButton" size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setModalTitleState(true);
              setModalVisible(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        request={(params) => getAllRoles(params)}
      />
      <RoleForm
        dialogVisible={modalVisible}
        dialogVisibleTitle={modalTitleState}
        onCancleModal={onCancelModal}
        formInfo={formInfo}
      />
    </PageContainer>
  );
};

export default Roles;
