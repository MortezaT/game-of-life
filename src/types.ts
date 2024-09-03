export type OneRequired<
  TObj,
  TKeys extends keyof TObj = keyof TObj
> = TKeys extends keyof TObj
  ? { [Key in TKeys]-?: Exclude<TObj[Key], undefined> }
  : never;

export type Mutable<T> = { -readonly [key in keyof T]: T[key] };

export type UnsubscribeFn = () => void;

export type LogLevel = 'Debug' | 'Warn' | 'Error';

export type AnyVoidFunction = (...args: any[]) => void

export type Listenable<
  TType extends string = string,
  TCallback extends AnyVoidFunction = AnyVoidFunction
> = {
  addEventListener(type: TType, callback: TCallback): void;
  removeEventListener(type: TType, callback: TCallback): void;
};
