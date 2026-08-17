export interface RefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string;
  used: boolean;
  revoked: boolean;
  expiresAt: Date;
  deviceInfo: String | null;
  createdAt: Date;
}

export class RefreshToken {
  private constructor(
    private readonly props: RefreshTokenProps,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
    deviceInfo: String | null;
  }): RefreshToken {

    return new RefreshToken({
      ...props,
      used: false,
      revoked: false,
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
    return this.props.tokenHash;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get familyId() {
    return this.props.familyId;
  }

  get used() {
    return this.props.used;
  }

  get revoked() {
    return this.props.revoked;
  }

  get deviceInfo() {
    return this.props.deviceInfo;
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.expiresAt <= referenceDate;
  }
}