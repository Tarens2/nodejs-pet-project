import { getRepository, MigrationInterface } from 'typeorm';
import { User, UserRole } from '../entity/User';

export class CreateAdminUser1563343619901 implements MigrationInterface {
  public async up() {
    const user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = UserRole.ADMIN;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down() {
    const userRepository = getRepository(User);
    await userRepository.delete({ username: 'admin' });
  }
}
