import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Dashboard")
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':time')
  getDashboardInfo(@Param('time', ParseIntPipe) time) {
    return this.dashboardService.dashboardInfo(time);
  }
}
