import { Controller } from '@nestjs/common';
import { getBaseController } from '../base/base.controller';
import { CardDTO, CreateCardDTO, UpdateCardDTO } from '../../shared/dto/card.dto';
import { BlCardService } from '../../business-logic/bl-card/bl-card.service';

@Controller('api/card')
export class CardController extends getBaseController({
  update: UpdateCardDTO,
  create: CreateCardDTO,
  response: CardDTO,
}) {
  constructor(cardService: BlCardService) {
    super(cardService);
  }
}
