import { NotificationType } from "./NotificationType"

interface NotificationProps {
    id: string,
    userId: string,
    type: NotificationType,
    payload: JSON,
    read: boolean,
    createdAt: Date,
}

export class Notification {
    constructor(private readonly props: NotificationProps) { }

    static(props: {
        id: string,
        userId: string,
        type: NotificationType,
        payload: JSON,
    }){
        return new Notification({
            ...props,
            read: false,
            createdAt: new Date(),
        })
    }

    get getProps(): NotificationProps {
        return this.props;
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get type(): NotificationType {
        return this.props.type;
    }

    get payload(): JSON {
        return this.props.payload;
    }

    get read(): boolean {
        return this.props.read;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}