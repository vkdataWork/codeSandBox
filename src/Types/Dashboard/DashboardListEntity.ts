import IEntity from '@/Types/Base/IEntity';

export default class DashboardListEntity implements IEntity<number> {
  public id: number = 0;
  public name: string = '';
  public description: string = '';
  public environmentId: number = 1;
  public systemId:number = 0;

  constructor(obj: any | undefined = undefined) {
    Object.assign(this, obj);
  }
}
