import { Body, Controller, Post } from '@nestjs/common';
import { FunctionnalityCreate } from 'src/interfaces/tour/FunctionnalityCreate';
import { ItineraryCreate } from 'src/interfaces/tour/ItineraryCreate';
import { LinkedFunctionnality } from 'src/interfaces/tour/LinkedFunctionnality';
import { LinkedItinerary } from 'src/interfaces/tour/LinkedItinerary';
import { Tourbasic } from 'src/interfaces/tour/Tourbasic';
import { TourService } from './tour.service';

@Controller('tour')
export class TourController {
  constructor(private readonly tourservice: TourService) {}

  @Post('createbasic')
  async createbasic(@Body() body: Tourbasic) {
    return this.tourservice.createbasictour(body);
  }

  @Post('createitinerary')
  async createitinerary(@Body() body: ItineraryCreate) {
    return this.tourservice.createitinerary(body);
  }

  @Post('linktour_itinerary')
  async linktourtoitinerary(@Body() body: LinkedItinerary) {
    return this.tourservice.linkitenerarytotour(body);
  }

  @Post('createfunctionnality')
  async createfunctionnality(@Body() body: FunctionnalityCreate) {
    return this.tourservice.functionnalitycreate(body);
  }

  @Post('linktour_functionnality')
  async linktour_functionnality(@Body() body: LinkedFunctionnality) {
    return this.tourservice.linkfunctionnality(body);
  }
}
