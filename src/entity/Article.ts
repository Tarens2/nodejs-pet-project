import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';
import { Image } from './Image';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.articles)
  user: User;

  @OneToMany(() => Image, image => image.article)
  images: Image[];

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(4, 100)
  label: string;
}
