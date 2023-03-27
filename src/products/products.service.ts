import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
  ){}


  async create(createProductDto: CreateProductDto) {
    try{
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );

      return product;

    }catch(err){
      this.handleDBExceptions(err);
    }
    
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit=10, offset=0 } = paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne( id: string ) {


    const product = await this.productRepository.findOneBy({ id })
     if(!product)
      throw new NotFoundException(`Product with  ${id} not found`)

     return product;


  }

  async update( id: number, updateProductDto: UpdateProductDto ) {
    return `This action updates a #${id} product`;
  }

  async remove( id: string ) {
    try{
      
      const product = await this.findOne(id);
      await this.productRepository.remove(product);

    }catch(err){
      this.handleDBExceptions( err );
    }
  }

  private handleDBExceptions( err:any ){
    if(err.code === '23505')
      throw new BadRequestException(err.detail);

    this.logger.error(err);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

}
