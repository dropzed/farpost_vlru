import { ApiProperty } from '@nestjs/swagger';

export class InitiatorResponseDto {
  @ApiProperty({ description: 'Название инициатора', example: 'ООО Энергосервис' })
  initiatorName: string;

  @ApiProperty({ description: 'Номер телефона', example: '+7 (423) 123-45-67', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'Email', example: 'contact@energoservice.ru', required: false })
  email?: string;
}
