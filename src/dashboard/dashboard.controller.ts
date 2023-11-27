import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':time')
  getDashboardInfo(@Param('time', ParseIntPipe) time) {
    return this.dashboardService.dashboardInfo(time);
  }
}
