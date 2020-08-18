import Redis from 'ioredis';

export enum RedisPrefix {
  TmpImage = 'tmpImg:',
  TmpFile = 'tmpFile:'
}

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
