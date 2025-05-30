// app.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDb() {
    try {
      const result = await this.dataSource.query('SELECT 1');
      return { status: 'ok', db: result };
    } catch (err) {
      return { status: 'error', error: err.message };
    }
  }
}
