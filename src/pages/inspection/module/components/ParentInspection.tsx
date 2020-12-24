import React, { useState, useRef, ReactText, MutableRefObject } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm, Switch, Select } from 'antd';
import { InspectionModuleDataType } from '@/services/inspection/module/index.d';
import {
  delInspectionModules,
  getAllInspectionModules,
  editInspectionModules,
} from '@/services/inspection/module/index';
import { PlusOutlined } from '@ant-design/icons';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';
import CreateParentInspection from './CreateParentInspection';

const { Option } = Select;
interface GetDictionayParamsType {
  pageSize?: number;
  current?: number;
}

interface ParentInspectionPropsType {
  getCurrentCheckRow: (record: InspectionModuleDataType) => void;
}

interface RestItemType {
  name?: string;
  description?: string;
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

const getAllInspectionModule = async (
  params: GetDictionayParamsType,
  setTableList: (data: InspectionModuleDataType[]) => void,
  setExpandAllIds: (data: string[]) => void,
) => {
  const { current, pageSize: size, ...rest } = params;
  const filterRestParams = filterRest(rest);
  const info = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    list_style: 'tree',
    ...filterRestParams,
  };
  const res = await getAllInspectionModules(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    result = {
      data: list.map((item: InspectionModuleDataType) => {
        return {
          ...item,
          children: item.hasChildren ? [] : null,
        };
      }),
      total,
    };
    setExpandAllIds([]);
    setTableList(result.data);
  }
  return result;
};

const changeSwitch = async (
  bool: boolean,
  row: InspectionModuleDataType,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const params = {
    ...row,
    enabled: bool ? 1 : 2,
  };
  const res = await editInspectionModules(params);
  if (res?.status === '00000') {
    notifyInfoTip('检查模块', `${bool ? '启用' : '停用'}`, true);
  } else {
    actionRef.current?.reload();
    notifyInfoTip('检查模块', `${bool ? '启用' : '停用'}`, false, res.message);
  }
};

const delInspectionModule = async (
  ids: string,
  actionRef: MutableRefObject<ActionType | undefined>,
) => {
  const res = await delInspectionModules({ id: [ids] });
  if (res?.status === '00000') {
    notifyInfoTip('检查模块', '删除', true);
    actionRef.current?.reload();
  } else {
    notifyInfoTip('检查模块', '删除', false, res.message);
  }
};

const setRowClass = (record: InspectionModuleDataType, currentRowId?: string) => {
  return record.id === currentRowId ? `${styles.rowBgColor}` : '';
};

// 获取子节点
const onExpandTreeTable = async (
  id: string,
  tableList: InspectionModuleDataType[],
  setTableList: (data: InspectionModuleDataType[]) => void,
) => {
  const res = await getAllInspectionModules({
    parent_id: id,
    sort: 'sort,asc',
    list_style: 'tree',
  });

  if (res?.status === '00000') {
    const arr = tableList.map((el: InspectionModuleDataType) => {
      return {
        ...el,
        children: el.id === id ? res.data : el.children,
      };
    });
    setTableList(arr);
  }
};

const onExpandedRowsChange = (
  expandeRows: ReactText[],
  setExpandAllIds: (data: string[]) => void,
) => {
  setExpandAllIds(expandeRows as string[]);
};

const ParentInspection: React.FC<ParentInspectionPropsType> = (props) => {
  const { getCurrentCheckRow } = props;
  const defaultFormInfo = {
    name: '',
    description: '',
    parent_id: undefined,
    id: '',
    enabled: true,
  };
  const actionRef = useRef<ActionType>();
  const [currentRowId, setCurrentRowId] = useState<string>();
  const [currentRow, setCurrentRow] = useState<InspectionModuleDataType>(defaultFormInfo);
  const [tableList, setTableList] = useState<InspectionModuleDataType[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitleVisible, setModalTitleVisible] = useState<boolean>(true);
  const [expandAllIds, setExpandAllIds] = useState<string[]>([]);

  const editDictionary = (row: InspectionModuleDataType) => {
    setModalTitleVisible(false);
    setCurrentRow(row);
    setModalVisible(true);
  };
  const onCancelModal = () => {
    setModalTitleVisible(true);
    setModalVisible(false);
    actionRef.current?.reload();
  };
  const classification: ProColumns<InspectionModuleDataType>[] = [
    {
      title: '模块名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择" allowClear>
            <Option value="true">启用</Option>
            <Option value="false">停用</Option>
          </Select>
        );
      },
      render: (_, row) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked={row.enabled === 1}
          onChange={(e) => changeSwitch(e, row, actionRef)}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
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
              onClick={(e) => {
                e.stopPropagation();
                const info = JSON.parse(JSON.stringify(row));
                info.enabled = info.enabled === 1;
                editDictionary(info);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={`d${row.id}`}
              title={
                <div>
                  是否
                  <span className={styles.delColor}> 删除 </span>检查模块
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                delInspectionModule(row.id, actionRef);
              }}
            >
              <Button
                type="link"
                key="deleteButton"
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ProTable
        rowKey="id"
        columns={classification}
        actionRef={actionRef}
        request={(params) => getAllInspectionModule(params, setTableList, setExpandAllIds)}
        rowClassName={(record) => setRowClass(record, currentRowId)}
        expandedRowKeys={expandAllIds}
        onExpandedRowsChange={(expandeRows) => onExpandedRowsChange(expandeRows, setExpandAllIds)}
        toolBarRender={() => [
          <Button
            key="dictionaryCreate"
            type="primary"
            onClick={() => {
              setModalTitleVisible(true);
              setCurrentRow(defaultFormInfo);
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurrentRowId(record.id);
              getCurrentCheckRow(record);
            },
          };
        }}
        defaultExpandAllRows={false}
        onExpand={(expanded, record) => {
          if (expanded) {
            onExpandTreeTable(record.id, tableList, setTableList);
          }
        }}
        dataSource={tableList}
      />

      <CreateParentInspection
        modalVisible={modalVisible}
        modalTitleVisible={modalTitleVisible}
        currentRow={currentRow}
        onCancelModal={onCancelModal}
      />
    </>
  );
};

export default ParentInspection;
