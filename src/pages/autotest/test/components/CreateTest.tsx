import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { addExecutionTask, editExecutionTask } from '@/services/task/executionDetail/index';
import { AddExecutionParams } from '@/services/task/executionDetail/index.d';
import { myContext } from '@/utils/commonContext';
import TestBasicCreate from '@/components/TaskCreate/TestBasicCreate';
import TestCaseTable from '@/components/TaskCreate/TestCaseTable';
import { FormOutlined } from '@ant-design/icons';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';

interface CurrentRowParams {
  id?: string;
  content_type?: string | null;
  params?: any;
}
interface CreateTaskProps {
  modalVisiable: boolean;
  modalTitleVisiable: boolean;
  onModalCancel: () => void;
  currentRow: CurrentRowParams;
  caller: string;
}
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

// 根据类型的不同处理不同的参数
const dealWithAddOrEditParms = (data: AddExecutionParams) => {
  const info = JSON.parse(JSON.stringify(data));
  info.content_type = '3';
  info.params.device_list = info.params.device_list.join(',');
  info.params = JSON.stringify(info.params);
  return info;
};

const CreateTest: React.FC<CreateTaskProps> = (props) => {
  const { modalVisiable, modalTitleVisiable, onModalCancel, currentRow, caller } = props;
  const [currentId, setCurrentId] = useState<string>('');
  const [showEditIcon, setShowEditIcon] = useState<boolean>(false);

  // 控制 选项是否可以使用， 和图标的使用等状态
  const [showOptionsState, setShowOptionsState] = useState<boolean>(true);
  const [form] = useForm();
  const addOrEditTasks = () => {
    form.resetFields();
    if (currentRow.id) {
      setCurrentId(currentRow.id);
      setShowEditIcon(true);
    } else {
      setCurrentId('');
      setShowEditIcon(false);
    }
    form.setFieldsValue(currentRow);
  };

  useEffect(() => {
    addOrEditTasks();
  }, [currentRow]);

  // 状态
  useEffect(() => {
    setShowOptionsState(
      !((modalTitleVisiable && !currentId) || (!modalTitleVisiable && !showEditIcon)),
    );
  }, [modalTitleVisiable, showEditIcon, currentId]);

  // 新增任务项
  const addExecutionTasks = async (data: AddExecutionParams) => {
    const res = await addExecutionTask(data);
    if (res?.status === '00000') {
      form.setFieldsValue({
        id: res.data,
      });
      setCurrentId(res.data);
      notifyInfoTip('任务项', '新增', true);
    } else {
      notifyInfoTip('任务项', '新增', false, res.message);
    }
  };

  // 编辑
  const editExecutionTasks = async (data: AddExecutionParams) => {
    const res = await editExecutionTask(data);
    if (res?.status === '00000') {
      const info = form.getFieldsValue();
      Object.assign(currentRow, {
        ...info,
        content_type: '3',
      });
      setShowEditIcon(true);
      notifyInfoTip('任务项', '编辑', true);
    } else {
      notifyInfoTip('任务项', '编辑', false, res.message);
    }
  };

  const onModalOk = () => {
    form.validateFields().then((data) => {
      const info = dealWithAddOrEditParms(data);
      if (modalTitleVisiable) {
        addExecutionTasks(info);
      } else {
        const params = {
          ...info,
          id: currentId,
        };
        editExecutionTasks(params);
      }
    });
  };

  const CustomizeFooter: React.FC<{}> = () => {
    return (
      <>
        <Button key="back" onClick={onModalCancel}>
          取消
        </Button>
      </>
    );
  };
  return (
    <Modal
      forceRender
      destroyOnClose
      visible={modalVisiable}
      title={`${modalTitleVisiable ? '新建' : '编辑'}任务项`}
      onCancel={onModalCancel}
      footer={<CustomizeFooter />}
    >
      <Row gutter={16}>
        <Col span={12}>
          <div className={styles.projectData}>
            <div className={styles.leftSign} />
            <span className={styles.rightData}>任务资料</span>
          </div>
        </Col>
        <Col span={12}>
          {showEditIcon && !modalTitleVisiable && (
            <div style={{ textAlign: 'right' }}>
              <FormOutlined
                className={styles.editIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditIcon(false);
                }}
              />
            </div>
          )}
        </Col>
      </Row>
      <Form {...formLayout} form={form}>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入标题" disabled={showOptionsState} />
        </Form.Item>

        <myContext.Provider value={{ form, showOptionsState }}>
          <TestBasicCreate />
        </myContext.Provider>
      </Form>
      <div style={{ textAlign: 'center', height: '32px' }}>
        <Space>
          {
            // 编辑 并且不展示icon 和 新增没有id 的时候 展示保存按钮
            // ((!modalTitleVisiable && !showEditIcon) || (modalTitleVisiable && !currentId))
            !showOptionsState && (
              <Button type="primary" onClick={onModalOk}>
                保存
              </Button>
            )
          }
          {
            // 新增的时候不展示， 只有编辑且icon 不显示的时候才展示取消按钮
            !modalTitleVisiable && !showEditIcon && (
              <Button
                type="default"
                onClick={() => {
                  form.setFieldsValue(currentRow);
                  setShowEditIcon(true);
                }}
              >
                取消
              </Button>
            )
          }
        </Space>
      </div>
      {currentId && (
        <Row gutter={16}>
          <Col span={24}>
            <div className={styles.projectData}>
              <div className={styles.leftSign} />
              <span className={styles.rightData}>任务内容</span>
            </div>
          </Col>
        </Row>
      )}

      <myContext.Provider value={{ currentId, caller }}>
        {currentId && <TestCaseTable />}
      </myContext.Provider>
    </Modal>
  );
};

export default CreateTest;
