import { JSEncrypt } from 'jsencrypt';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0M8fgvpJ7JYYZRxWb/KUPTDaD\n' +
  'siXfBqsKqa3HAoFNZVTWqktlfY5MMqWhAAK7WRPqwwTX7yzoEfF6WxIxB9W+kqC+\n' +
  'hI4BxwhvRFptWAWBR/qGdZvFx3N8bMetQpW66wGmWq/P8oP+RfqyKYeY7EhxjZMx\n' +
  'pu6ZDqhvRNBeGUsiGwIDAQAB';

const privateKey: string = '';

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(txt);
}
