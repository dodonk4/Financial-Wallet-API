export interface RefreshTokenProps {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export class RefreshToken {
  private constructor(
    private readonly props: RefreshTokenProps,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  }): RefreshToken {

    return new RefreshToken({
      ...props,
      createdAt: new Date(),
    });

  }

  static restore(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(props);
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get token() {
    return this.props.token;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.expiresAt <= referenceDate;
  }
}