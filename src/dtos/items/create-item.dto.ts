import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  store!: string;
}
