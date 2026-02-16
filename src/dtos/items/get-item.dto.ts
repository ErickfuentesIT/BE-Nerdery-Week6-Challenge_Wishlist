import { IsNotEmpty, IsUUID } from "class-validator";

export class GetItemDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
