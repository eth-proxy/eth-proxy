export type ObjKey = string | number | symbol;
export type Data<T> = DataNotAsked | DataLoading | DataLoaded<T> | DataError;

export interface DataNotAsked {
  status: 'NotAsked';
}

export interface DataLoading {
  status: 'Loading';
}

export interface DataLoaded<T> {
  status: 'Loaded';
  value: T;
}

export interface DataError {
  status: 'Error';
  value: any;
}
