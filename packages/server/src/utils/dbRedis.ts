import Redis from 'ioredis';
import { tmpMaxAge } from '../config';

export enum RedisPrefix {
  TmpImage = 'tmpImg:',
  TmpFile = 'tmpFile:'
}

export const expiryTime = {
  tmp: tmpMaxAge + 60 * 60 * 24
};

class DbRedis {
  public client: Redis.Redis;

  public createConnection(): void {
    this.client = new Redis({
      host: 'localhost',
      port: 6379
    });
  }
}

export default new DbRedis();
