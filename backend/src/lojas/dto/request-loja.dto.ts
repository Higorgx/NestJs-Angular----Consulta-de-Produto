import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export class RequestLojaDto {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Loja Centro',
    description: 'Nome ou descrição da loja (máx. 60 caracteres)',
    maxLength: 60,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  descricao: string;
}
