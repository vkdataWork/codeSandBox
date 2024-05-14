import ProjectListEntity from '@/Types/Project/ProjectListEntity';
import BaseEntity from '@/Types/Base/BaseEntity';
import { EnvironmentEnum } from '@/Types/EnvironmentEnum';

export default class DashboardEntity extends BaseEntity<number> {
  public id: number = 0;
  public name: string = '';
  public description: string = '';
  public environmentId: EnvironmentEnum = 1;
  public projects: ProjectListEntity[] = [];
  public systemId: number = 0;
  constructor(obj: any | undefined = undefined) {
    super();

    Object.assign(this, obj);
  }
}
