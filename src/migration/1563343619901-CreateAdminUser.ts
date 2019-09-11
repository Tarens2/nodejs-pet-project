import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entity/User";

export class CreateAdminUser1563343619901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = "admin";
    user.password = "admin";
    user.hashPassword();
    user.role = "admin";
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
