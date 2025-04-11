import { Injectable } from '@nestjs/common';
import { RequestProductDto } from './dto/request-product.dto';
import { ResponseProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  create(RequestProductDto: RequestProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, ResponseProductDTO: ResponseProductDTO) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
