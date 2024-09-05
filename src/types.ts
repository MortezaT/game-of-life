export type LogLevel = 'Debug' | 'Warn' | 'Error';

export type OneOrMany<T> = T | T[];

export type OneRequired<
  TObj,
  TKeys extends keyof TObj = keyof TObj
> = TKeys extends keyof TObj
  ? { [Key in TKeys]-?: Exclude<TObj[Key], undefined> }
  : never;

export type Mutable<T> = { -readonly [key in keyof T]: T[key] };

export type UnsubscribeFn = () => void;

export type Paths<
  T,
  TMaxDepth = 4,
  TDepth extends any[] = []
> = T extends object
  ? {
      [Key in keyof T]: `${Exclude<
        Key,
        symbol
      >}${TDepth['length'] extends TMaxDepth
        ? ''
        : '' | `.${Paths<T[Key], TMaxDepth, [...TDepth, '']>}`}`;
    }[keyof T]
  : never;

export type LeavesPath<
  T,
  TMaxDepth = 4,
  TDepth extends any[] = []
> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${LeavesPath<T[K]> extends never
        ? ''
        : TDepth['length'] extends TMaxDepth
        ? ''
        : `.${LeavesPath<T[K], TMaxDepth, [...TDepth, '']>}`}`;
    }[keyof T]
  : never;
