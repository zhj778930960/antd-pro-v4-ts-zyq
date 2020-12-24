import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Tooltip } from 'antd';
import { getAllRepository } from '@/services/project/repository/index';
import { CopyOutlined, ReloadOutlined, StarOutlined, LockOutlined } from '@ant-design/icons';
import {
  unbindHookEventMonitorings,
  bindHookEventMonitorings,
  getAllEventMonitorings,
  refreshHookEventMonitorings,
} from '@/services/task/monitoring/index';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';

const { Option } = Select;
interface RepositoriesParams {
  name: string;
  id: string;
}

interface CurrentRowParams {
  name?: string;
  type?: string;
  task_template_id?: string;
  id?: string;
  enabled?: boolean;
  params?: {
    [key: string]: any;
  };
}

interface WarehouseSubmissionProps {
  form: any;
  currentRow: CurrentRowParams;
  modalTitleVisiable: boolean;
}
const getRepositories = async (setRepositories: (data: RepositoriesParams[]) => void) => {
  const res = await getAllRepository({
    sort: 'created_time,desc',
  });
  if (res?.status === '00000') {
    setRepositories(res.data);
  }
};

const WarehouseSubmission: React.FC<WarehouseSubmissionProps> = (props) => {
  const { form, currentRow, modalTitleVisiable } = props;
  const [repositories, setRepositories] = useState<RepositoriesParams[]>([]);
  const [iconState, setIconState] = useState<boolean>(false);
  useEffect(() => {
    setIconState(currentRow?.params?.is_bound);
    getRepositories(setRepositories);
  }, []);

  const unbindHookEventMonitoring = async () => {
    const res = await unbindHookEventMonitorings({ id: currentRow?.id });
    if (res?.status === '00000') {
      form.setFieldsValue({
        params: {
          is_bound: false,
        },
      });
      Object.assign(currentRow, {
        params: {
          is_bound: false,
        },
      });
      setIconState(false);
      notifyInfoTip('webHook', '解绑', true);
    } else {
      notifyInfoTip('webHook', '解绑', false, res.message);
    }
  };
  const getOneMonitoring = async () => {
    const res = await getAllEventMonitorings({ id: currentRow?.id });
    if (res?.status === '00000') {
      const { params } = res.data[0];
      form.setFieldsValue({
        params: JSON.parse(params),
      });
      Object.assign(currentRow, {
        params: JSON.parse(params),
      });
    } else {
      notifyInfoTip('', '', false, res.message);
    }
  };

  const bindHookEventMonitoring = async () => {
    const res = await bindHookEventMonitorings({ id: currentRow?.id });
    if (res?.status === '00000') {
      getOneMonitoring();
      setIconState(true);
      notifyInfoTip('webHook', '绑定', true);
    } else {
      notifyInfoTip('webHook', '绑定', false, res.message);
    }
  };

  const refreshHookEventMonitoring = async () => {
    const res = await refreshHookEventMonitorings({
      id: currentRow?.id,
      repository_id: currentRow?.params?.repository_id,
    });
    if (res?.status === '00000') {
      getOneMonitoring();
      notifyInfoTip('webHook', '刷新', true);
    } else {
      notifyInfoTip('webHook', '刷新', false, res.message);
    }
  };
  const copyWebHook = () => {
    const input: any = document.querySelector('#webHook');
    input?.select?.();
    document.execCommand('Copy');
    notifyInfoTip('webHook', '复制', true);
  };
  return (
    <>
      <Form.Item
        name={['params', 'repository_id']}
        label="源码仓库"
        rules={[{ required: true, message: '请选择源码仓库' }]}
      >
        <Select placeholder="请选择源码仓库">
          {repositories &&
            repositories.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item name="branch_pattern" label="仓库关键字">
        <Input placeholder="请输入仓库关键字" />
      </Form.Item>
      {!modalTitleVisiable && currentRow.type === '1' && (
        <>
          <Form.Item label="webHook地址" className={styles.webHookUrl}>
            <Form.Item
              name={['params', 'webhook_url']}
              style={{ width: '75%', marginBottom: '0px' }}
            >
              <Input placeholder="请输入webHook地址" id="webHook" readOnly />
            </Form.Item>
            <span>
              <Tooltip placement="top" title="复制">
                <CopyOutlined className={styles.hoverIcon} onClick={copyWebHook} />
              </Tooltip>
              {iconState && (
                <>
                  <Tooltip placement="top" title="刷新">
                    <ReloadOutlined
                      className={styles.hoverIcon}
                      onClick={refreshHookEventMonitoring}
                    />
                  </Tooltip>
                  <Tooltip placement="top" title="解绑">
                    <StarOutlined
                      className={styles.hoverIcon}
                      onClick={unbindHookEventMonitoring}
                    />
                  </Tooltip>
                </>
              )}
              {!iconState && (
                <Tooltip placement="top" title="绑定">
                  <LockOutlined className={styles.hoverIcon} onClick={bindHookEventMonitoring} />
                </Tooltip>
              )}
            </span>
          </Form.Item>
          <Form.Item name={['params', 'webhook_token']} label="访问令牌">
            <Input placeholder="请输入webHook地址" readOnly />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default WarehouseSubmission;
