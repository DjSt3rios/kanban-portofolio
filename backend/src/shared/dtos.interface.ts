import { ClassConstructor } from 'class-transformer';

export interface IDTOs {
  create?: ClassConstructor<any>;
  update?: ClassConstructor<any>;
  response?: ClassConstructor<any>;
  deleteResponse?: ClassConstructor<any>;
}
