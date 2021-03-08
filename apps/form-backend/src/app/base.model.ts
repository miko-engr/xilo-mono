export class BaseModel {

    public constructor(entity: any) {
        Object.assign(this, { ...entity });
    }

    public createdAt?: Date;
    public updatedAt?: Date;
}