import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Type( ()=> Number )
    limit?:number;


    @IsOptional()
    @Type( ()=> Number )
    @Min(0)
    offset?:number;

}