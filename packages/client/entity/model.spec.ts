import { EntityModel } from './model';

interface MyEntity {
  a: 12;
}
interface EventsByType {
  ERC20: {
    event1: {
      payload: {
        a: 13;
      };
    };
  };
}
interface Contracts {
  ERC20: {
    approve: {
      in: string;
    };
  };
}

export const x: EntityModel<MyEntity, EventsByType, Contracts> = {
  ERC20: {
    approve: {
      handle: () => ({ a: 12 }),
      identity: () => 13
    },
    event1: {
      handle: () => ({ a: 12 }),
      identity: () => 12
    }
    // not vaid
    // appro: {}
  }
  // invalid
  // other: {}
};
