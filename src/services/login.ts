import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
  code?: string
}
// auth/login
export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/auth/login', {
    method: 'post',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
