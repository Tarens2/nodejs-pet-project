import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import generateRandomPassword from '../lib/generateRandomPassword';

export type UserRoleType = 'admin' | 'common' | 'ghost';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  username: string;

  @Column({ nullable: true })
  githubId: string | null;

  @Column({ nullable: true })
  token: string | null;

  @Column({ nullable: true })
  email: string | null;

  @Column()
  @Length(4, 100)
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'common', 'ghost'],
    default: 'ghost',
  })
  role: UserRoleType;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    if (this.githubId) {
      this.password = bcrypt.hashSync(generateRandomPassword(), 8);
    } else {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
