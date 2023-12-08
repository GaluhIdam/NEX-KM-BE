import { Skill } from '@prisma/clients/homepage';
import { SkillDTO } from '../../skill/dtos/skill.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';
export interface SkillServiceInterface {
  getSkill(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
  ): Promise<ResponseDTO<Skill[]>>;

  getSkillByUuid(uuid: string): Promise<Skill>;

  createSkill(dto: SkillDTO): Promise<Skill>;

  updateSkill(uuid: string, dto: SkillDTO): Promise<Skill>;

  deleteSkill(uuid: string): Promise<Skill>;
}
