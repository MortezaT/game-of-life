// export type OneRequired<TObj, TKeys = keyof TObj> = TKeys extends keyof TObj
//   ? { [key in TKeys]-?: TObj[key] } & (TObj[TKeys] extends undefined
//       ? never
//       : OneRequired<Exclude<TObj, TKeys>>)
//   : never;

export type OneRequired<
  TObj,
  TKeys extends keyof TObj = keyof TObj
> = TKeys extends keyof TObj
  ? { [Key in TKeys]-?: Exclude<TObj[Key], undefined> }
  : never;
