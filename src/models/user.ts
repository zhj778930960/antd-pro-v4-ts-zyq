import { MenuDataItem } from '@ant-design/pro-layout';
import { Effect, Reducer, history } from 'umi';
import { queryCurrent, query as queryUsers } from '@/services/user';
import Avatar from '@/assets/avatar.png'
import { filterRoutes, RoutersDataType } from '@/utils/utils'
import { notification } from 'antd'

export interface CurrentUser {
  avatar?: any;
  name?: string;
  id?: string,
  email?: string,
  user_name?: string,
  role?: string,
  privileges?: string | string[],
  menuData?: MenuDataItem[]
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const res = yield call(queryCurrent);
      if (res?.status === '00000') {
        const { real_name: name, role, privileges, id, email, user_name } = res.data.user
        const menuData: RoutersDataType[] = filterRoutes(privileges, role)
        yield put({
          type: 'saveCurrentUser',
          payload: {
            name,
            id,
            email,
            user_name,
            avatar: Avatar,
            role,
            privileges,
            menuData
          },
        });
      } else {
        notification.error({
          message: '获取用户信息失败'
        })
        history.replace('/user/login')
      }

    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
