import { UserRole } from "./UserRole.ts";
import { UserStatus } from "./UserStatus.ts";

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  static create(props: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): User {
    return new User({
      ...props,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  // ...
}