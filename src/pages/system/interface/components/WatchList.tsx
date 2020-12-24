import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { getWatchListNames, setWatchListNames } from '@/services/system/interface/index';
import { useForm } from 'antd/lib/form/Form';
import { notifyInfoTip } from '@/utils/utils';

const { TextArea } = Input;
interface WatchListPropsParams {
  modalWathchVisiable: boolean;
  onWatchModalCancel: () => void;
}

const WatchList: React.FC<WatchListPropsParams> = (props) => {
  const defaultForm = {
    excluded_list: '',
    included_list: '',
  };
  const { modalWathchVisiable, onWatchModalCancel } = props;
  const [form] = useForm();
  const getWatchList = async () => {
    const res = await getWatchListNames();
    if (res?.status === '00000') {
      const { included_list: iList, excluded_list: eList } = res.data;
      const params = {};
      const includeList = iList.split(';').join('\n');
      const excludedList = eList.split(';').join('\n');
      Object.assign(params, {
        included_list: includeList,
        excluded_list: excludedList,
      });
      form.setFieldsValue(params);
    } else {
      form.setFieldsValue(defaultForm);
    }
  };
  useEffect(() => {
    getWatchList();
  }, [modalWathchVisiable]);
  // 获取名单列表

  const onOkWathchModal = async () => {
    const params = form.getFieldsValue();
    const { included_list: iList, excluded_list: eList } = params;
    const includeList = iList.split('\n').join(';');
    const excludeList = eList.split('\n').join(';');
    const resule = {
      included_list: includeList,
      excluded_list: excludeList,
    };
    const res = await setWatchListNames(resule);
    if (res?.status === '00000') {
      notifyInfoTip('名单', '设置', true);
      onWatchModalCancel();
    } else {
      notifyInfoTip('名单', '设置', false, res.message);
    }
  };
  return (
    <Modal
      forceRender
      destroyOnClose
      title="监听 / 排除名单"
      visible={modalWathchVisiable}
      onOk={onOkWathchModal}
      onCancel={onWatchModalCancel}
    >
      <Form form={form}>
        <Form.Item name="included_list" label="监听名单">
          <TextArea rows={6} placeholder="请输入监听名单" />
        </Form.Item>
        <Form.Item name="excluded_list" label="排除名单">
          <TextArea rows={6} placeholder="请输入排除名单" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WatchList;
