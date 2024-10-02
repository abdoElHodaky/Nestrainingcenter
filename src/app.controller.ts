import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from "@nestjs/swagger";

//@UseGuards(OptionalJwtAuthGuard)
@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {}
  
  @Redirect("/docs")
  @Get("")
  async index(@Res() res:Response ){   
    
    
   }
}
