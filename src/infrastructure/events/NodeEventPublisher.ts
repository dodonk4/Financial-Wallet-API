import { EventEmitter } from "node:events";

import type { DomainEvent } from "../../domain/events/DomainEvent";
import { IEventPublisher } from "../../application/ports/output/IEventPublisher";

//I define the handler here. The project doesn't need the complexity of having several handlers types
type EventHandler<T extends DomainEvent> =
  (event: T) => Promise<void> | void;

export class NodeEventPublisher implements IEventPublisher {
  private readonly emitter = new EventEmitter();

  async publish(event: DomainEvent): Promise<void> {
    this.emitter.emit(event.eventName, event);
  }

  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    this.emitter.on(eventName, async (event: T) => {
      await handler(event);
    });
  }
}