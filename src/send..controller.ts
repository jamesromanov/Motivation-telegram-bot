import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class Request {
  @Get()
  async get() {
    return 'ping';
  }
}
