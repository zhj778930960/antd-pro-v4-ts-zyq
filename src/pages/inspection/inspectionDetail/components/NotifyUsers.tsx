import React, { useState, useEffect } from 'react';
import { Popover, Form, Button, Select, Space, Input } from 'antd';
import IconFont from '@/components/IconFont/index';
import { getUsers } from '@/services/system/users/index';
import { useForm } from 'antd/lib/form/Form';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect.d';
import { notifyEwechat } from '@/services/inspection/inspection/index';
import { NotifyEwechatParams } from '@/services/inspection/inspection/index.d';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';

const { Option } = Select;

interface AllUsersType {
  real_name: string;
  id: string;
  user_name: string;
}

interface NotifyUsersProps {
  real_name?: string;
}

// 获取用户列表
const getAllUsers = async (setAllUsers: (data: AllUsersType[]) => void) => {
  const res = await getUsers({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setAllUsers(res.data);
  }
};

const notifyUsers = async (
  data: NotifyEwechatParams,
  setPopverVisiable: (data: boolean) => void,
) => {
  const res = await notifyEwechat(data);
  if (res?.data) {
    notifyInfoTip('用户', '通知', true);
    setPopverVisiable(false);
  } else {
    notifyInfoTip('用户', '通知', false, res.message);
  }
};

const mergeContent = (content: string, real_name?: string): string => {
  return `发送者：${real_name} \n消息：${content ?? '无'} \n地址：${window.location.href}`;
};

const NotifyUsers: React.FC<NotifyUsersProps> = (props) => {
  const { real_name } = props;
  const [popverVisiable, setPopverVisiable] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<AllUsersType[]>([]);
  const [form] = useForm();

  const sendUserMessage = () => {
    form.validateFields().then((data) => {
      const params = {
        content: mergeContent(data.content, real_name),
        tousers: data.tousers.join('|'),
      };
      notifyUsers(params, setPopverVisiable);
    });
  };
  useEffect(() => {
    getAllUsers(setAllUsers);
  }, []);

  useEffect(() => {
    if (popverVisiable) {
      form.setFieldsValue({
        content: undefined,
        tousers: undefined,
      });
    }
  }, [popverVisiable]);

  return (
    <Popover
      content={() => {
        return (
          <>
            <Form form={form}>
              <Form.Item name="content">
                <Input placeholder="请输入消息信息" />
              </Form.Item>
              <Form.Item name="tousers" rules={[{ required: true, message: '请选择用户' }]}>
                <Select
                  placeholder="请选择用户"
                  allowClear
                  mode="multiple"
                  style={{ width: '100%' }}
                >
                  {allUsers &&
                    allUsers.map((item) => {
                      return (
                        <Option key={item.id} value={item.user_name}>
                          {item.real_name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Form>
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              <Space>
                <Button type="default" size="small" onClick={() => setPopverVisiable(false)}>
                  取消
                </Button>
                <Button type="primary" size="small" onClick={sendUserMessage}>
                  发送
                </Button>
              </Space>
            </div>
          </>
        );
      }}
      title="用户"
      trigger="click"
      visible={popverVisiable}
      onVisibleChange={() => setPopverVisiable(true)}
    >
      <IconFont type="icon-guide" className={styles.iconFontSize} />
    </Popover>
  );
};

export default connect(({ user }: ConnectState) => ({
  real_name: user.currentUser?.name,
}))(NotifyUsers);
