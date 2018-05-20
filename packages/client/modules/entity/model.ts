import { InitializedTransaction, TransactionWithHash } from '../transaction';
import { EventMetadata } from '../events';

export interface TransactionHandler<E, MD> {
  handle: (
    state: E,
    next: MD extends { in: any } ? MD['in'] : never,
    transaction: InitializedTransaction | TransactionWithHash
  ) => E;
  identity: (
    e: MD extends { in: any } ? MD['in'] : never,
    transaction: InitializedTransaction | TransactionWithHash
  ) => string | number;
  root?: boolean;
}
export interface EventHandler<Entity, Event> {
  handle: (
    state: Entity,
    next: Event extends { payload: infer Payload } ? Payload : never,
    meta: EventMetadata
  ) => Entity;
  identity: (
    e: Event extends { payload: infer Payload } ? Payload : never
  ) => string | number;
  root?: boolean;
}

export type EntityModel<
  E,
  EventsByType extends {},
  Contracts extends {}
> = Partial<
  {
    [C in keyof Partial<EventsByType>]: Partial<
      {
        [P in keyof Partial<EventsByType[C]>]: EventHandler<
          E,
          EventsByType[C][P]
        >
      }
    >
  } &
    {
      [C in keyof Partial<Contracts>]: {
        [P in keyof Partial<Contracts[C]>]: TransactionHandler<
          E,
          Contracts[C][P]
        >
      }
    }
> &
  object;
