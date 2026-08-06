export abstract class BaseRestService<CreateDto, UpdateDto, FindDto, EntityDto> {
  abstract create?(data: CreateDto): Promise<EntityDto | null>;
  abstract update?(id: string | number, data: UpdateDto): Promise<EntityDto | null>;
  abstract delete?(id: string | number): Promise<boolean>;
  abstract find?(params: FindDto): Promise<EntityDto | EntityDto[] | null>;
}
