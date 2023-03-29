import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
}

//TODO: SE LLAMA PARTIALTYPE DE SWAGGER PARA QUE SE LO PUEDA DOCUMENTAR