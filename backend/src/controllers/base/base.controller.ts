import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { IDTOs } from '../../shared/dtos.interface';
import { DeleteResponseDTO } from '../../shared/dto/delete-response.dto';
import { IBaseService } from '../../shared/base-service.interface';

export function getBaseController(dtos: IDTOs) {
  const createDTO = dtos.create;
  const updateDTO = dtos.update;
  const responseDTO = dtos.response;
  const deleteResponseDTO = dtos.deleteResponse ?? DeleteResponseDTO;

  class BaseController {
    constructor(public service: IBaseService) {}

    @ApiOkResponse({ type: responseDTO, isArray: true })
    @Get('all')
    getAll() {
      return this.service.getAll();
    }

    @ApiParam({
      name: 'id',
      description: 'Object ID',
    })
    @ApiOkResponse({ type: responseDTO })
    @Get(':id')
    read(@Param('id', ParseIntPipe) id: number) {
      return this.service.read(id);
    }

    @ApiParam({
      name: 'id',
      description: 'Object ID',
    })
    @ApiOkResponse({ type: deleteResponseDTO })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.service.delete(id);
    }

    @ApiParam({
      name: 'id',
      description: 'Object ID',
    })
    @ApiBody({
      type: updateDTO,
    })
    @ApiOkResponse({ type: responseDTO })
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body(
        new ValidationPipe({
          expectedType: updateDTO,
          whitelist: true,
        }),
      )
      body: typeof updateDTO,
    ) {
      return this.service.update(id, body);
    }

    @ApiBody({
      type: createDTO,
    })
    @ApiCreatedResponse({
      type: responseDTO,
    })
    @Post('create')
    create(
      @Body(
        new ValidationPipe({
          expectedType: createDTO,
          whitelist: true,
        }),
      )
      body: typeof createDTO,
    ) {
      return this.service.create(body);
    }
  }

  return BaseController;
}
