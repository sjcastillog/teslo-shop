import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    
  ){}


  async create(createProductDto: CreateProductDto) {
    try{
      const { images = [], ...productDetails } = createProductDto;
      
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url:image}))
      });

      await this.productRepository.save( product );

      return {...product, images};

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

  async findOne( term: string ) {

    let product:Product;

    if( isUUID(term)){
      product = await this.productRepository.findOneBy({ id:term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:title', { 
          title: term.toUpperCase(),
          slug: term.toLowerCase()
         })
        .getOne();
    }
     
    if(!product)
      throw new NotFoundException(`Product with  ${term} not found`)

     return product;


  }

  async update( id: string, updateProductDto: UpdateProductDto ) {
    const product  = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images:[]
    })

    if(!product) throw new NotFoundException(`Product with id ${id} not found`)
    
    try{
      return await this.productRepository.save( product );
    }catch(err){
      this.handleDBExceptions(err)
    }
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
