export interface RefreshTokenProps {
  id: string;
  ownerUserId: string;
  targetAccountId: string;
  alias: string;
  deletedAt: Date;
}

export class RefreshToken {
  constructor(private readonly props: RefreshTokenProps) {}

  get id() {
    return this.props.id;
  }

  get ownerUserId() {
    return this.props.ownerUserId;
  }

  get targetAccountId() {
    return this.props.targetAccountId;
  }

  get alias() {
    return this.props.alias;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  // ...
}