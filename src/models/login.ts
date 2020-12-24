// import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { message } from 'antd';
import  Cookies from 'js-cookie'

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(fakeAccountLogin, payload); 
      // Login successfully
      if (res.status === '00000') {
        yield put({
          type: 'changeLoginStatus',
          payload: res.data.user.role,
        });
        Cookies.set('Authorization', res.data.token, { expires: 1/24})
        message.success('🎉 🎉 🎉  登录成功！');
        window.location.href = '/welcome'
      }
    },

    logout() {
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login') {
        Cookies.remove('Authorization')
        localStorage.removeItem('antd-pro-authority')
        history.replace({
          pathname: '/user/login'
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
