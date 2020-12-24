import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import IconFont from '@/components/IconFont/index';
import { RoleDataType } from '@/services/system/role/index.d';
import { add, edit } from '@/services/system/role/index';
import { notifyInfoTip } from '@/utils/utils';
import { MenuList } from '../../../../../config/routers';
import styles from '../index.less';

interface RoleFormProps {
  dialogVisible: boolean;
  dialogVisibleTitle: boolean;
  onCancleModal: () => void;
  formInfo: RoleDataType;
}

interface nodeData extends DataNode {
  name?: string;
}
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
interface RoutersDataType {
  name: string;
  path: string;
  redirect?: string;
  icon?: string;
  authority?: string[];
  key: string;
  hideInMenu?: boolean;
  children?: RoutersDataType[];
}
// 设置数据，如果为星号 则要选中所有的节点
const dealWithPrivileges = (privileges: string[] | number[] | string) => {
  let arr: string[] = [];
  if (privileges === '*') {
    MenuList.forEach((item: RoutersDataType) => {
      const arr1 = item.children
        ? item.children.map((item1) => {
            return item1.key;
          })
        : [];
      arr = arr.concat(arr1);
    });

    return arr;
  }
  if (Object.prototype.toString.call(privileges) === '[object Array]') {
    return JSON.parse(JSON.stringify(privileges));
  }
  return arr;
};

// 新增
const addRole = async (data: RoleDataType, onCancleModal: () => void) => {
  const res = await add(data);
  if (res.data.id) {
    notifyInfoTip('角色', '新增', true);
    onCancleModal();
  } else {
    notifyInfoTip('角色', '新增', false, res.message);
  }
};

// 编辑
const editRole = async (id: number | undefined, data: RoleDataType, onCancleModal: () => void) => {
  const res = await edit(data, id);
  if (res.data.id) {
    notifyInfoTip('角色', '编辑', true);
    onCancleModal();
  } else {
    notifyInfoTip('角色', '编辑', false, res.message);
  }
};

const RoleForm: React.FC<RoleFormProps> = (props) => {
  const { dialogVisible, dialogVisibleTitle, onCancleModal, formInfo } = props;
  const [selectPrivileges, setSelectPrivileges] = useState<string[] | number[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formInfo);
    const arr = dealWithPrivileges(formInfo.privileges);
    setSelectPrivileges(arr);
  }, [formInfo]);

  const checkTrees = (
    checkedKeys:
      | React.ReactText[]
      | {
          checked: React.ReactText[];
          halfChecked: React.ReactText[];
        },
  ) => {
    const { checked } = JSON.parse(JSON.stringify(checkedKeys));
    form.setFieldsValue({
      privileges: checked || [],
    });
  };

  const modelOk = () => {
    form.validateFields().then((data) => {
      const obj: RoleDataType = {
        name: '',
        privileges: [],
      };
      Object.assign(obj, data);
      if (dialogVisibleTitle) {
        addRole(obj, onCancleModal);
      } else {
        editRole(formInfo.id, obj, onCancleModal);
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      getContainer={false}
      title={`${dialogVisibleTitle ? '新增' : '编辑'}角色`}
      visible={dialogVisible}
      onOk={modelOk}
      onCancel={onCancleModal}
    >
      <Form {...layout} form={form}>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          label="菜单权限"
          name="privileges"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <div className={styles.treeWrapper}>
            <Tree
              className={styles.treeFatherCheckbox}
              treeData={MenuList}
              titleRender={(node: nodeData) => {
                return (
                  <>
                    {node.icon ? (
                      <IconFont type={`${node.icon}`} className={styles.showIconPadding} />
                    ) : null}
                    <span>{node.name}</span>
                  </>
                );
              }}
              defaultCheckedKeys={selectPrivileges}
              checkable
              defaultExpandAll
              checkStrictly
              onCheck={(checkedKeys) => checkTrees(checkedKeys)}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;
