import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  store?: string;
}
