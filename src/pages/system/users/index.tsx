import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Switch, Button, Popconfirm, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { getUsers, editUser, delUser } from '@/services/system/users';
import { getAll } from '@/services/system/role';
import { EditFormColumn, RestItemType } from '@/services/system/users/index.d';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';

import CreateForm from './components/CreateForm';

const { Option } = Select;
interface GetUsersParamsType {
  current?: number;
  pageSize?: number;
}

interface RoleDataType {
  id: number;
  name: string;
}
/**
 *  去除getUsersList 方法中 rest 输入型参数为空字符串导致搜索有问题
 * @param rest Protable 中 requst 方法传递回来的params
 */
const filterRest = (rest: RestItemType) => {
  const restObj: RestItemType = {};
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};
const getUsersList = async (params: GetUsersParamsType) => {
  const { current, pageSize: psize, ...rest } = params;
  const filterRestObj = filterRest(rest);
  const res = await getUsers({
    page: current && current > 0 ? current - 1 : 0,
    size: psize,
    sort: 'created_time,desc',
    ...filterRestObj,
  });
  const result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    Object.assign(result, {
      data: list,
      total,
      success: true,
    });
  }
  return result;
};

// 删除
const currentDelUser = async (id: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await delUser({ id: [id] });
  if (res.data) {
    notifyInfoTip('角色', '删除', true);
    actionRef.current?.reload();
  } else {
    notifyInfoTip('角色', '删除', false, res.message);
  }
};
// 获取用户
const getAllRoles = async (setRoleArrData: (data: RoleDataType[]) => void) => {
  const res = await getAll({
    page: 1,
    per_page: 10000,
  });
  if (res.data) {
    const { roles } = res.data;
    setRoleArrData(roles);
  }
};

const changeSwitch = async (
  state: boolean,
  row: EditFormColumn,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const currentRow = JSON.parse(JSON.stringify(row));
  currentRow.enabled = state === false ? 2 : 1;
  const res = await editUser(currentRow);
  if (res.data) {
    notifyInfoTip('角色', `${state ? '启用' : '停用'}`, true);
    actionRef.current?.reload();
  } else {
    notifyInfoTip('角色', `${state ? '启用' : '停用'}`, false, res.message);
  }
};
const Users: React.FC<{}> = () => {
  const staticForm = {
    id: '',
    user_name: '',
    real_name: '',
    email: '',
    password: '',
    role: null,
    enabled: 1,
    create_time: '',
  };
  const actionRef = useRef<ActionType>();
  const [modalVisiable, setmodalVisiable] = useState<boolean>(false);
  const [modalTitleState, setmodalmodalTitleState] = useState<boolean>(true);
  const [roleArrData, setRoleArrData] = useState<RoleDataType[]>([]);
  const [formInfo, setformInfo] = useState<EditFormColumn>(staticForm);

  useEffect(() => {
    getAllRoles(setRoleArrData);
  }, []);

  const columns: ProColumns<EditFormColumn>[] = [
    {
      title: '账号名称',
      dataIndex: 'user_name',
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInTable: true,
      search: false,
    },
    {
      title: '用户名称',
      dataIndex: 'real_name',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'role',
      ellipsis: true,
      renderFormItem: () => {
        return (
          <Select placeholder="请选择">
            {roleArrData &&
              roleArrData.map((item) => (
                <Option key={item.id} value={item.name}>
                  {item.name}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      ellipsis: true,
      valueEnum: {
        true: {
          text: '启用',
          status: 'success',
        },
        false: {
          text: '停用',
          status: 'error',
        },
      },
      render: (_, row) => {
        return (
          <Switch
            checked={row.enabled === '1'}
            key="checkedChange"
            checkedChildren="启用"
            unCheckedChildren="停用"
            onChange={(e) => changeSwitch(e, row, actionRef)}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      valueType: 'date',
      ellipsis: true,
      hideInForm: true,
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      fixed: 'right',
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              key="editButton"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                setmodalVisiable(true);
                setformInfo(row);
                setmodalmodalTitleState(false);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={row.id}
              title={
                <div>
                  是否<span className={styles.delColor}>删除</span>用户{' '}
                  <span className={styles.delColor}>{row.real_name}</span> ?
                </div>
              }
              onConfirm={() => currentDelUser(row.id ?? '', actionRef)}
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
    <div className={styles.editWrapper}>
      <PageContainer>
        <ProTable<EditFormColumn>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          toolBarRender={() => [
            <Button
              key="createButton"
              type="primary"
              onClick={() => {
                setmodalmodalTitleState(true);
                setmodalVisiable(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={async (params) => getUsersList(params)}
        />

        <CreateForm
          modalTitleState={modalTitleState}
          modalVisiable={modalVisiable}
          formInfo={formInfo}
          roleArrData={roleArrData}
          onCancel={() => {
            setformInfo(staticForm);
            setmodalVisiable(false);
            actionRef.current?.reload();
          }}
        />
      </PageContainer>
    </div>
  );
};

export default Users;
