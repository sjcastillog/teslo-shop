import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example:'550e8400-e29b-41d4-a716-446655440000',
        description:'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'T-Shirt teslo',
        description:'Product title',
        uniqueItems: true
    })
    @Column('text',{
        unique:true,
    })
    title:string;

    @ApiProperty({
        example:0,
        description:'Product price',
    })
    @Column('float',{ 
        default:0 
    })
    price:number;

    @ApiProperty({
        example:'Veniam mollit laboris est fugiat officia.',
        description:'Product description',
        default:null
    })
    @Column({
        type:'text',
        nullable:true
    })
    description:string;

    @ApiProperty({
        example:'t_shirt_teslo',
        description:'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text',{
        unique:true
    })
    slug: string;

    @ApiProperty({
        example:10,
        description:'Product stock',
        default:0
    })
    @Column('int',{
        default:0
    })
    stock: number;


    @ApiProperty({
        example:['xl', 'lg', 's'],
        description:'Product sizes',
    })
    @Column('text',{
        array:true
    })
    sizes: string[];

    @ApiProperty({
        example:'women',
        description:'Product Gender',
    })
    @Column('text')
    gender: string;


    @ApiProperty()
    @Column({
        type:'text',
        array:true,
        default:[]
    })
    tags: string[];
    
    @ApiProperty()
    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        { 
            cascade: true,
            eager: true //TODO: MUESTRA LAS RELACIONES EN CADA CONSULTA
        }
    )
    images?:ProductImage[]

    @ApiProperty()
    @ManyToOne(
        ()=>User,
        ( user ) => user.product,
        { eager:true }
    )
    user:User;

    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .split(' ')
            .join('_')
            .split("'")
            .join('')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
        .toLowerCase()
        .split(' ')
        .join('_')
        .split("'")
        .join('')
    }

}
