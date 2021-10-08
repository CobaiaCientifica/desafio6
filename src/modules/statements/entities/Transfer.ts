import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../../users/entities/User';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  sender_id: string;

  @ManyToOne(() => User, user => user.statement)
  @JoinColumn({ name: 'sender_id' })
  sender_user: User;

  @Column('uuid')
  target_id: string;

  @ManyToOne(() => User, user => user.statement)
  @JoinColumn({ name: 'target_id' })
  target_user: User;

  @Column()
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}
