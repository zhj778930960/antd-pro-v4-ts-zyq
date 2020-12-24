import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { addExecutionTask, editExecutionTask } from '@/services/task/executionDetail/index';
import {
  addTaskTemplateTasks,
  editTaskTemplateTasks,
} from '@/services/task/taskTemplateDetail/index';
import { AddExecutionParams } from '@/services/task/executionDetail/index.d';
import { myContext } from '@/utils/commonContext';
import InspectionBasicCreate from '@/components/TaskCreate/InspectionBasicCreate';
import TestBasicCreate from '@/components/TaskCreate/TestBasicCreate';
import PackageBasicCreate from '@/components/TaskCreate/PackageBasicCreate';
import TransitionBasicCreate from '@/components/TaskCreate/TransitionBasicCreate';
import TaskTemplateBasicCreate from '@/components/TaskCreate/TaskTemplateBasicCreate';
import InspectionItemTable from '@/components/TaskCreate/InspectionItemTable';
import TestCaseTable from '@/components/TaskCreate/TestCaseTable';
import { FormOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import { notifyInfoTip } from '@/utils/utils';
import styles from './index.less';

interface DictionariesParamsType {
  label: string;
  id: string;
  value: string;
}

interface RouterUrlParams {
  id: string;
}
interface CurrentRowParams {
  id?: string;
  content_type?: string | null;
  params?: any;
}
interface CreateTaskProps {
  taskContentType: DictionariesParamsType[];
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
const { Option } = Select;

// 根据类型的不同处理不同的参数
const dealWithAddOrEditParms = (
  data: AddExecutionParams,
  curContentType: string,
  urlParams: RouterUrlParams,
) => {
  const info = JSON.parse(JSON.stringify(data));
  info.parent_id = urlParams.id;
  if (['1', '2', '3'].includes(curContentType)) {
    if (curContentType === '3') {
      info.params.device_list = info.params.device_list.join(',');
    }
    info.params = JSON.stringify(info.params);
  }
  return info;
};

const additionalMap = new Map([
  [
    '1',
    {
      platform: null,
      build_type: null,
      branch: null,
      hashes: '',
    },
  ],
  [
    '2',
    {
      platform: null,
      pack_type: null,
      build_type: null,
      build_mode: null,
      branch: null,
      hashes: '',
      is_profile: false,
      is_auto_test: false,
    },
  ],
  [
    '3',
    {
      package_url: null,
      build_type: null,
      server: null,
      device_list: [],
      airtest_framework_branch: null,
    },
  ],
  [
    '4',
    {
      transaction_id: null,
    },
  ],
  [
    '5',
    {
      task_template_id: null,
    },
  ],
]);

const contentDomList = {
  '1': <InspectionBasicCreate />,
  '2': <PackageBasicCreate />,
  '3': <TestBasicCreate />,
  '4': <TransitionBasicCreate />,
  '5': <TaskTemplateBasicCreate />,
};

const CreateTask: React.FC<CreateTaskProps> = (props) => {
  const {
    taskContentType,
    modalVisiable,
    modalTitleVisiable,
    onModalCancel,
    currentRow,
    caller,
  } = props;
  const urlParams: RouterUrlParams = useParams();
  const [curContentType, setCurContentType] = useState<string>('');
  const [currentId, setCurrentId] = useState<string>('');
  const [showEditIcon, setShowEditIcon] = useState<boolean>(false);

  // 控制 选项是否可以使用， 和图标的使用等状态
  const [showOptionsState, setShowOptionsState] = useState<boolean>(true);

  const [isTestOrInspection, setIsTestOrInspection] = useState<boolean>(false);

  const [form] = useForm();

  const addOrEditTasks = () => {
    if (currentRow.id) {
      setCurContentType(currentRow.content_type ?? '');
      setCurrentId(currentRow.id);
      setShowEditIcon(true);
    } else {
      form.resetFields();
      setCurContentType('');
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
    setIsTestOrInspection(['1', '3'].includes(curContentType));
    setShowOptionsState(
      ['1', '3'].includes(curContentType) &&
        !((modalTitleVisiable && !currentId) || (!modalTitleVisiable && !showEditIcon)),
    );
  }, [modalTitleVisiable, showEditIcon, currentId, curContentType]);

  // 新增任务项
  const addExecutionTasks = async (data: AddExecutionParams, state?: boolean) => {
    const res =
      caller === 'executionDetail'
        ? await addExecutionTask(data)
        : await addTaskTemplateTasks(data);
    if (res?.status === '00000') {
      form.setFieldsValue({
        id: res.data,
      });
      setCurrentId(res.data);
      notifyInfoTip('任务项', '新增', true);
      if (state) {
        onModalCancel();
      }
    } else {
      notifyInfoTip('任务项', '新增', false, res.message);
    }
  };

  // 编辑
  const editExecutionTasks = async (data: AddExecutionParams, state?: boolean) => {
    const res =
      caller === 'executionDetail'
        ? await editExecutionTask(data)
        : await editTaskTemplateTasks(data);
    if (res?.status === '00000') {
      if (state) {
        onModalCancel();
      } else {
        const info = form.getFieldsValue();
        Object.assign(currentRow, {
          ...info,
        });
        setShowEditIcon(true);
      }
      notifyInfoTip('任务项', '编辑', true);
    } else {
      notifyInfoTip('任务项', '编辑', false, res.message);
    }
  };

  const onModalOk = (state?: boolean) => {
    form.validateFields().then((data) => {
      const info = dealWithAddOrEditParms(data, curContentType, urlParams);
      if (modalTitleVisiable) {
        addExecutionTasks(info, state);
      } else {
        const params = {
          ...info,
          id: currentId,
        };
        editExecutionTasks(params, state);
      }
    });
  };

  const changeContentType = (val: string) => {
    const info = additionalMap.get(val);
    const params = ['1', '2', '3'].includes(val)
      ? {
          params: info,
        }
      : info;
    form.setFieldsValue(params);

    setCurContentType(val);
  };

  const CustomizeFooter: React.FC<{}> = () => {
    return (
      <>
        <Button key="back" onClick={onModalCancel}>
          取消
        </Button>
        {(!isTestOrInspection || !curContentType) && (
          <Button key="submit" type="primary" onClick={() => onModalOk(true)}>
            确定
          </Button>
        )}
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
          {isTestOrInspection && showEditIcon && !modalTitleVisiable && (
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
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入任务名称" disabled={showOptionsState} />
        </Form.Item>
        <Form.Item
          name="content_type"
          label="类型"
          rules={[{ required: true, message: '请选择任务类型' }]}
        >
          <Select
            placeholder="请选择任务类型"
            allowClear
            onChange={changeContentType}
            disabled={!modalTitleVisiable || (!!currentId && modalTitleVisiable)}
          >
            {taskContentType &&
              taskContentType.map((item) => {
                return (
                  <Option key={item.id} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>

        <myContext.Provider value={{ form, showOptionsState }}>
          {/* {curContentType === '1' && <InspectionBasicCreate />}
          {curContentType === '2' && <PackageBasicCreate />}
          {curContentType === '3' && <TestBasicCreate />}
          {curContentType === '4' && <TransitionBasicCreate />}
          {curContentType === '5' && <TaskTemplateBasicCreate />} */}
          {contentDomList[curContentType]}
        </myContext.Provider>
      </Form>
      {isTestOrInspection && (
        <div style={{ textAlign: 'center', height: '32px' }}>
          <Space>
            {
              // 编辑 并且不展示icon 和 新增没有id 的时候 展示保存按钮
              // ((!modalTitleVisiable && !showEditIcon) || (modalTitleVisiable && !currentId))
              !showOptionsState && (
                <Button type="primary" onClick={() => onModalOk(false)}>
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
      )}
      {isTestOrInspection && currentId && (
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
        {curContentType === '1' && currentId && <InspectionItemTable />}
        {curContentType === '3' && currentId && <TestCaseTable />}
      </myContext.Provider>
    </Modal>
  );
};

export default CreateTask;
