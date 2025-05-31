// app.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello() {
    return 'Hello World!';
  }

  async checkDb() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.dataSource.query('SELECT 1');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { status: 'ok', db: result };
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { status: 'error', error: err.message };
    }
  }
}
