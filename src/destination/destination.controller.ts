import { Body, Controller, Get, Post } from '@nestjs/common';
import { DestinationCreate } from 'src/interfaces/destination/Destinationcreate';
import { DestinationService } from './destination.service';

@Controller('destination')
export class DestinationController {
  constructor(private readonly destinationservice: DestinationService) {}

  @Get('list')
  async getdestinationlist() {
    return this.destinationservice.getdestinations();
  }

  @Post('create')
  async createdestination(@Body() body: DestinationCreate) {
    return this.destinationservice.createbasisDestination(body);
  }
}
