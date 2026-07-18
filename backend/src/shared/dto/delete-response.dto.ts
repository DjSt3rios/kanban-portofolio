import { ApiProperty } from '@nestjs/swagger';

export interface IDeleteResponse {
  success: boolean;
}

export class DeleteResponseDTO implements IDeleteResponse {
  @ApiProperty({ readOnly: true })
  success: true;
}