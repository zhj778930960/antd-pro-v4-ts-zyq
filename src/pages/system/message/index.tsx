import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Popover } from 'antd';
import { getAllMessage } from '@/services/system/message/index';
import { getAllChildren } from '@/services/system/dictionary/index';
import { getUsers } from '@/services/system/users/index';

interface TableValueDataParams {
  content: string;
  created_time: string;
  id: string;
  receivers: string;
  send_time: string;
  sender?: string;
  status?: number;
  title: string;
  type: number;
}

interface TableRequestParams {
  current?: number;
  pageSize?: number;
}

interface MessageTypeDictionary {
  value: string;
  label: string;
  id: string;
}

interface UsersListType {
  id: string;
  real_name: string;
  user_name: string;
}
const getMessage = async (params: TableRequestParams) => {
  const { current, pageSize: size, ...rest } = params;
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...rest,
  };

  const result = {
    data: [],
    total: 0,
  };
  const res = await getAllMessage(info);
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

// 过滤显示消息内容
const splitRowContent = (message: string) => {
  const infos = message.split('\n');
  return infos.map((item) => <div key={item}>{item}</div>);
};

// 获取字典项详解
const getChildrenDiction = async (setMessageTypes: (data: MessageTypeDictionary[]) => void) => {
  const res = await getAllChildren({
    dictName: 'message_type',
  });

  if (res?.status === '00000') {
    const { data } = res;
    setMessageTypes(data);
  }
};

// 获取用户列表，过滤出接受者
const getAllUsersList = async (setUsersList: (data: UsersListType[]) => void) => {
  const res = await getUsers();
  if (res?.status === '00000') {
    const { data } = res;
    setUsersList(data);
  }
};

// 过滤显示接受者名单
const filterUsersList = (users: string, usersList: UsersListType[]) => {
  const splitUsers = users.split(',');
  const filUsers = usersList.filter((item: UsersListType) => {
    return splitUsers.includes(item.id);
  });
  return filUsers.map((item: UsersListType) => (
    <div key={item.id}>{`${item.real_name} | ${item.user_name}`}</div>
  ));
};

// 根据任务类型的不同过滤出label值
const filterMessageType = (type: number, messageTypes: MessageTypeDictionary[]) => {
  if (!type) return '';
  const result = messageTypes.filter((item: MessageTypeDictionary) => {
    return Number(item.value) === type;
  });
  const info =
    result.length > 0
      ? result[0]
      : {
          label: '',
        };
  return info.label;
};

const SystemMessage: React.FC<{}> = () => {
  const [messageTypes, setMessageTypes] = useState<MessageTypeDictionary[]>([]);
  const [usersList, setUsersList] = useState<UsersListType[]>([]);

  useEffect(() => {
    getChildrenDiction(setMessageTypes);
    getAllUsersList(setUsersList);
  }, []);
  const columns: ProColumns<TableValueDataParams>[] = [
    {
      title: '消息标题',
      dataIndex: 'title',
    },
    {
      title: '消息内容',
      render: (_, row) => {
        return (
          <Popover placement="top" content={() => splitRowContent(row.content)} trigger="click">
            <Button type="link">查看</Button>
          </Popover>
        );
      },
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      search: false,
      renderText: (text) => filterMessageType(text, messageTypes),
    },
    {
      title: '发送时间',
      dataIndex: 'created_time',
      search: false,
    },
    {
      title: '发送者',
      dataIndex: 'sender',
      search: false,
    },
    {
      title: '接收者',
      dataIndex: 'receivers',
      search: false,
      render: (_, row) => {
        return (
          <Popover
            placement="top"
            content={() => filterUsersList(row.receivers, usersList)}
            trigger="click"
          >
            <Button type="link">{row.receivers.split(',').length}人</Button>
          </Popover>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable rowKey="id" columns={columns} request={(params) => getMessage(params)} />
    </PageContainer>
  );
};

export default SystemMessage;
