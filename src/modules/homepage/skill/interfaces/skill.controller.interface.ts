import { Response } from 'express';
import { SkillDTO } from '../dtos/skill.dto';
export interface SkillControllerInterface {
  getSkill(
    res: Response,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<Response>;

  getSkillByUuid(res: Response, uuid: string): Promise<Response>;

  createSkill(res: Response, dto: SkillDTO): Promise<Response>;

  updateSkill(res: Response, uuid: string, dto: SkillDTO): Promise<Response>;

  deleteSkill(res: Response, uuid: string): Promise<Response>;
}
