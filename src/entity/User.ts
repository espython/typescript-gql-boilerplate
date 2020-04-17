import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  // ID Column
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  name: string;

  @Column("text", { nullable: true })
  facebookId: string | null;

  // @Column("text")
  // lastName: string;

  // @Column()
  // age: number;

  @Column("varchar", { length: 255, nullable: true })
  email: string | null;

  // @Column()
  // phoneNumber: number;

  @Column("text", { nullable: true })
  password: string | null;

  @Column("boolean", { default: false })
  confirmed: boolean;
}
