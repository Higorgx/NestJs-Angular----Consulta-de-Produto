import { IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class RequestProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  descricao: string;

  @IsNumber()
  @IsOptional()
  custo?: number;

  @IsOptional()
  imagem?: Buffer;
}