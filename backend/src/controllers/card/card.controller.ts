import { Controller } from '@nestjs/common';
import { getBaseController } from '../base/base.controller';
import { CardService } from '../../persistence/card/card.service';
import { CardDTO, CreateCardDTO, UpdateCardDTO } from '../../shared/dto/card.dto';

@Controller('api/card')
export class CardController extends getBaseController({
  update: UpdateCardDTO,
  create: CreateCardDTO,
  response: CardDTO,
}) {
  constructor(cardService: CardService) {
    super(cardService);
  }
}
