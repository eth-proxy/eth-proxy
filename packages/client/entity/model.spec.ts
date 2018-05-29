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

const x: EntityModel<MyEntity, EventsByType, Contracts> = {
  ERC20: {
    approve: {
      handle: (x, y, z) => ({ a: 12 }),
      identity: x => 13
    },
    event1: {
      handle: (x, y, z) => ({ a: 12 }),
      identity: x => 12
    }
    //not vaid
    //appro: {}
  }
  // invalid
  // other: {}
};
