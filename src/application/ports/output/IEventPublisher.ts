export interface IEventPublisher {
  publish(event: object): Promise<void>;
}