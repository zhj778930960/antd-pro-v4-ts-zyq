import React, { useState, useRef, MutableRefObject } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { DictionaryDataType, GetDictionayParams } from '@/services/system/dictionary/index.d';
import { getAll, del } from '@/services/system/dictionary/index';
import { PlusOutlined } from '@ant-design/icons';
import { notifyInfoTip } from '@/utils/utils';
import styles from '../index.less';
import CreateDictionary from './CreateDictionary';

interface GetDictionayParamsType {
  pageSize?: number;
  current?: number;
}

interface DictionaryPropsType {
  getCurrentCheckRow: (record: DictionaryDataType) => void;
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
    if (rest[item]) {
      restObj[item] = rest[item];
    }
  });
  return restObj;
};

const getAllDictionary = async (params: GetDictionayParamsType) => {
  const { current, pageSize: size, ...rest } = params;
  const filterRestParams = filterRest(rest);
  const info: GetDictionayParams = {
    page: current ? current - 1 : 0,
    size,
    sort: 'created_time,desc',
    ...filterRestParams,
  };
  const res = await getAll(info);
  let result = {
    data: [],
    total: 0,
  };
  if (res?.status === '00000') {
    const { list, total } = res.data;
    result = {
      data: list,
      total,
    };
  }

  return result;
};

/**
 *
 * @param ids 要删除的id
 */

const delDictionary = async (ids: string, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await del({ id: [ids] });
  if (res?.status === '00000') {
    notifyInfoTip('字典', '删除', true);
    actionRef.current?.reload();
  } else {
    notifyInfoTip('字典', '删除', false, res.message);
  }
};
const setRowClass = (record: DictionaryDataType, currentRowId?: string) => {
  return record.id === currentRowId ? `${styles.rowBgColor}` : '';
};
const Dictionary: React.FC<DictionaryPropsType> = (props) => {
  const { getCurrentCheckRow } = props;
  const defaultFormInfo = {
    name: '',
    description: '',
    id: '',
  };
  const actionRef = useRef<ActionType>();
  const [currentRowId, setCurrentRowId] = useState<string>();
  const [currentRow, setCurrentRow] = useState<DictionaryDataType>(defaultFormInfo);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitleVisible, setModalTitleVisible] = useState<boolean>(true);

  const editDictionary = (row: DictionaryDataType) => {
    setModalTitleVisible(false);
    setCurrentRow(row);
    setModalVisible(true);
  };
  const onCancelModal = () => {
    setModalTitleVisible(true);
    setModalVisible(false);
    actionRef.current?.reload();
  };
  const classification: ProColumns<DictionaryDataType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
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
                editDictionary(row);
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
                  <span className={styles.delColor}> 删除 </span>字典
                  <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onCancel={(e) => e?.stopPropagation()}
              onConfirm={(e) => {
                e?.stopPropagation();
                delDictionary(row.id, actionRef);
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
        request={(params) => getAllDictionary(params)}
        rowClassName={(record) => setRowClass(record, currentRowId)}
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
      />

      <CreateDictionary
        modalVisible={modalVisible}
        modalTitleVisible={modalTitleVisible}
        currentRow={currentRow}
        onCancelModal={onCancelModal}
      />
    </>
  );
};

export default Dictionary;
