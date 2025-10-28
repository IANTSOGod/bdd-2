import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FunctionnalityCreate } from 'src/interfaces/tour/FunctionnalityCreate';
import { ItineraryCreate } from 'src/interfaces/tour/ItineraryCreate';
import { LinkedFunctionnality } from 'src/interfaces/tour/LinkedFunctionnality';
import { LinkedItinerary } from 'src/interfaces/tour/LinkedItinerary';
import { Tourbasic } from 'src/interfaces/tour/Tourbasic';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TourService {
  constructor(private readonly prismaservice: PrismaService) {}

  async createbasictour(data: Tourbasic) {
    const { destination, title, price } = data;

    const currentdestination = await this.prismaservice.destination.findUnique({
      where: {
        id: destination,
      },
    });

    if (currentdestination) {
      const newtour = await this.prismaservice.tour.create({
        data: {
          title: title,
          destination: destination,
          price: price,
        },
      });
      if (newtour) {
        return newtour;
      } else {
        throw new InternalServerErrorException({
          message: 'Erreur de création tour basique',
        });
      }
    } else {
      throw new NotFoundException({ message: 'destination non trouvé' });
    }
  }

  async createitinerary(data: ItineraryCreate) {
    const { name } = data;
    try {
      await this.prismaservice.itinerary.create({
        data: {
          name: name,
        },
      });
      return { message: 'Itinéraire créé' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Erreur lors de la création itinéraire',
      });
    }
  }

  async linkitenerarytotour(data: LinkedItinerary) {
    const { tour_id, itinerary_id } = data;

    const currenttour = await this.prismaservice.tour.findUnique({
      where: {
        id: tour_id,
      },
    });

    const currentitinerary = await this.prismaservice.itinerary.findUnique({
      where: {
        id: itinerary_id,
      },
    });

    if (currentitinerary && currenttour) {
      const currentlinked = await this.prismaservice.tour_Itinerary.create({
        data: {
          tour_id: currenttour.id,
          itinerary_id: currentitinerary.id,
          day: data.day ? data.day : 0,
          night: data.night ? data.night : 0,
          hours: data.hours ? data.hours : 0,
        },
      });
      if (currentlinked) {
        return currentlinked;
      } else {
        throw new InternalServerErrorException({
          message: 'Erreur de liaison',
        });
      }
    } else {
      throw new NotFoundException({
        message: 'Aucun itineraire et tour correspondant',
      });
    }
  }

  async functionnalitycreate(data: FunctionnalityCreate) {
    const { name } = data;

    const newfunctionnality = await this.prismaservice.functionnality.create({
      data: {
        name: name,
      },
    });
    if (newfunctionnality) {
      return newfunctionnality;
    } else {
      throw new InternalServerErrorException({
        message: 'Erreur lors de la création de fonctionnalité',
      });
    }
  }

  async linkfunctionnality(data: LinkedFunctionnality) {
    const { tour_id, functionnality_id, availability } = data;

    const currenttour = await this.prismaservice.tour.findUnique({
      where: {
        id: tour_id,
      },
    });

    const currentfunctionnality =
      await this.prismaservice.functionnality.findUnique({
        where: {
          id: functionnality_id,
        },
      });

    if (currenttour && currentfunctionnality) {
      const newlinkedfunctionnality =
        await this.prismaservice.tours_Functionnality.create({
          data: {
            tour_id: tour_id,
            functionnality_id: functionnality_id,
            availability: availability,
          },
        });
      if (newlinkedfunctionnality) {
        return newlinkedfunctionnality;
      } else {
        throw new InternalServerErrorException({ message: 'Erreur serveur' });
      }
    } else {
      throw new NotFoundException({
        message: 'Tour or functionnality not found',
      });
    }
  }
}
