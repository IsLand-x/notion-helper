import { cloud } from '@tarojs/taro';
import { CloudFnRes } from './type';

export async function callCloudFunction<T>(name: string, data = {}): Promise<CloudFnRes<T>> {
  const { result } = await cloud.callFunction({ name, data })
  return result as any
}