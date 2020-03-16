import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  // ID Column
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  firstName: string;

  // @Column("text")
  // lastName: string;

  // @Column()
  // age: number;

  @Column("varchar", { length: 255 })
  email: string;

  // @Column()
  // phoneNumber: number;

  @Column("text")
  password: string;
  @Column("boolean", { default: false })
  confirmed: boolean;
}
