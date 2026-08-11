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
  identifierType: string;
  identifierNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) { }

  static create(props: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    identifierType: string;
    identifierNumber: number;
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

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }
  
  get identifierType() {
    return this.props.identifierType;
  }

  get identifierNumber() {
    return this.props.identifierNumber;
  }

}