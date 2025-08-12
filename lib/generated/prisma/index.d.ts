
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Node
 * 
 */
export type Node = $Result.DefaultSelection<Prisma.$NodePayload>
/**
 * Model VpnUser
 * 
 */
export type VpnUser = $Result.DefaultSelection<Prisma.$VpnUserPayload>
/**
 * Model ActionLog
 * 
 */
export type ActionLog = $Result.DefaultSelection<Prisma.$ActionLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const NodeStatus: {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  UNKNOWN: 'UNKNOWN',
  ERROR: 'ERROR'
};

export type NodeStatus = (typeof NodeStatus)[keyof typeof NodeStatus]


export const VpnCertificateStatus: {
  VALID: 'VALID',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
  UNKNOWN: 'UNKNOWN'
};

export type VpnCertificateStatus = (typeof VpnCertificateStatus)[keyof typeof VpnCertificateStatus]


export const ActionType: {
  CREATE_USER: 'CREATE_USER',
  REVOKE_USER: 'REVOKE_USER',
  RESTART_NODE: 'RESTART_NODE',
  GET_LATEST_OVPN: 'GET_LATEST_OVPN'
};

export type ActionType = (typeof ActionType)[keyof typeof ActionType]


export const ActionStatus: {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus]

}

export type NodeStatus = $Enums.NodeStatus

export const NodeStatus: typeof $Enums.NodeStatus

export type VpnCertificateStatus = $Enums.VpnCertificateStatus

export const VpnCertificateStatus: typeof $Enums.VpnCertificateStatus

export type ActionType = $Enums.ActionType

export const ActionType: typeof $Enums.ActionType

export type ActionStatus = $Enums.ActionStatus

export const ActionStatus: typeof $Enums.ActionStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Nodes
 * const nodes = await prisma.node.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Nodes
   * const nodes = await prisma.node.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.node`: Exposes CRUD operations for the **Node** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Nodes
    * const nodes = await prisma.node.findMany()
    * ```
    */
  get node(): Prisma.NodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vpnUser`: Exposes CRUD operations for the **VpnUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VpnUsers
    * const vpnUsers = await prisma.vpnUser.findMany()
    * ```
    */
  get vpnUser(): Prisma.VpnUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.actionLog`: Exposes CRUD operations for the **ActionLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActionLogs
    * const actionLogs = await prisma.actionLog.findMany()
    * ```
    */
  get actionLog(): Prisma.ActionLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Node: 'Node',
    VpnUser: 'VpnUser',
    ActionLog: 'ActionLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "node" | "vpnUser" | "actionLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Node: {
        payload: Prisma.$NodePayload<ExtArgs>
        fields: Prisma.NodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          findFirst: {
            args: Prisma.NodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          findMany: {
            args: Prisma.NodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>[]
          }
          create: {
            args: Prisma.NodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          createMany: {
            args: Prisma.NodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>[]
          }
          delete: {
            args: Prisma.NodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          update: {
            args: Prisma.NodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          deleteMany: {
            args: Prisma.NodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>[]
          }
          upsert: {
            args: Prisma.NodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NodePayload>
          }
          aggregate: {
            args: Prisma.NodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNode>
          }
          groupBy: {
            args: Prisma.NodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<NodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.NodeCountArgs<ExtArgs>
            result: $Utils.Optional<NodeCountAggregateOutputType> | number
          }
        }
      }
      VpnUser: {
        payload: Prisma.$VpnUserPayload<ExtArgs>
        fields: Prisma.VpnUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VpnUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VpnUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>
          }
          findFirst: {
            args: Prisma.VpnUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VpnUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>
          }
          findMany: {
            args: Prisma.VpnUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>[]
          }
          create: {
            args: Prisma.VpnUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>
          }
          createMany: {
            args: Prisma.VpnUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VpnUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>[]
          }
          delete: {
            args: Prisma.VpnUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>
          }
          update: {
            args: Prisma.VpnUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>
          }
          deleteMany: {
            args: Prisma.VpnUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VpnUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VpnUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>[]
          }
          upsert: {
            args: Prisma.VpnUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VpnUserPayload>
          }
          aggregate: {
            args: Prisma.VpnUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVpnUser>
          }
          groupBy: {
            args: Prisma.VpnUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<VpnUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.VpnUserCountArgs<ExtArgs>
            result: $Utils.Optional<VpnUserCountAggregateOutputType> | number
          }
        }
      }
      ActionLog: {
        payload: Prisma.$ActionLogPayload<ExtArgs>
        fields: Prisma.ActionLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>
          }
          findFirst: {
            args: Prisma.ActionLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>
          }
          findMany: {
            args: Prisma.ActionLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>[]
          }
          create: {
            args: Prisma.ActionLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>
          }
          createMany: {
            args: Prisma.ActionLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>[]
          }
          delete: {
            args: Prisma.ActionLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>
          }
          update: {
            args: Prisma.ActionLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>
          }
          deleteMany: {
            args: Prisma.ActionLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ActionLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>[]
          }
          upsert: {
            args: Prisma.ActionLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionLogPayload>
          }
          aggregate: {
            args: Prisma.ActionLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActionLog>
          }
          groupBy: {
            args: Prisma.ActionLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionLogCountArgs<ExtArgs>
            result: $Utils.Optional<ActionLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    node?: NodeOmit
    vpnUser?: VpnUserOmit
    actionLog?: ActionLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type NodeCountOutputType
   */

  export type NodeCountOutputType = {
    vpnUsers: number
    actionLogs: number
  }

  export type NodeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vpnUsers?: boolean | NodeCountOutputTypeCountVpnUsersArgs
    actionLogs?: boolean | NodeCountOutputTypeCountActionLogsArgs
  }

  // Custom InputTypes
  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NodeCountOutputType
     */
    select?: NodeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeCountVpnUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VpnUserWhereInput
  }

  /**
   * NodeCountOutputType without action
   */
  export type NodeCountOutputTypeCountActionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionLogWhereInput
  }


  /**
   * Count Type VpnUserCountOutputType
   */

  export type VpnUserCountOutputType = {
    actionLogs: number
  }

  export type VpnUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actionLogs?: boolean | VpnUserCountOutputTypeCountActionLogsArgs
  }

  // Custom InputTypes
  /**
   * VpnUserCountOutputType without action
   */
  export type VpnUserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUserCountOutputType
     */
    select?: VpnUserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VpnUserCountOutputType without action
   */
  export type VpnUserCountOutputTypeCountActionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Node
   */

  export type AggregateNode = {
    _count: NodeCountAggregateOutputType | null
    _avg: NodeAvgAggregateOutputType | null
    _sum: NodeSumAggregateOutputType | null
    _min: NodeMinAggregateOutputType | null
    _max: NodeMaxAggregateOutputType | null
  }

  export type NodeAvgAggregateOutputType = {
    cpuUsage: number | null
    ramUsage: number | null
  }

  export type NodeSumAggregateOutputType = {
    cpuUsage: number | null
    ramUsage: number | null
  }

  export type NodeMinAggregateOutputType = {
    id: string | null
    name: string | null
    ip: string | null
    token: string | null
    lastSeen: Date | null
    location: string | null
    status: $Enums.NodeStatus | null
    cpuUsage: number | null
    ramUsage: number | null
    serviceStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NodeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ip: string | null
    token: string | null
    lastSeen: Date | null
    location: string | null
    status: $Enums.NodeStatus | null
    cpuUsage: number | null
    ramUsage: number | null
    serviceStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NodeCountAggregateOutputType = {
    id: number
    name: number
    ip: number
    token: number
    lastSeen: number
    location: number
    status: number
    cpuUsage: number
    ramUsage: number
    serviceStatus: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NodeAvgAggregateInputType = {
    cpuUsage?: true
    ramUsage?: true
  }

  export type NodeSumAggregateInputType = {
    cpuUsage?: true
    ramUsage?: true
  }

  export type NodeMinAggregateInputType = {
    id?: true
    name?: true
    ip?: true
    token?: true
    lastSeen?: true
    location?: true
    status?: true
    cpuUsage?: true
    ramUsage?: true
    serviceStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NodeMaxAggregateInputType = {
    id?: true
    name?: true
    ip?: true
    token?: true
    lastSeen?: true
    location?: true
    status?: true
    cpuUsage?: true
    ramUsage?: true
    serviceStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NodeCountAggregateInputType = {
    id?: true
    name?: true
    ip?: true
    token?: true
    lastSeen?: true
    location?: true
    status?: true
    cpuUsage?: true
    ramUsage?: true
    serviceStatus?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Node to aggregate.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Nodes
    **/
    _count?: true | NodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NodeMaxAggregateInputType
  }

  export type GetNodeAggregateType<T extends NodeAggregateArgs> = {
        [P in keyof T & keyof AggregateNode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNode[P]>
      : GetScalarType<T[P], AggregateNode[P]>
  }




  export type NodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NodeWhereInput
    orderBy?: NodeOrderByWithAggregationInput | NodeOrderByWithAggregationInput[]
    by: NodeScalarFieldEnum[] | NodeScalarFieldEnum
    having?: NodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NodeCountAggregateInputType | true
    _avg?: NodeAvgAggregateInputType
    _sum?: NodeSumAggregateInputType
    _min?: NodeMinAggregateInputType
    _max?: NodeMaxAggregateInputType
  }

  export type NodeGroupByOutputType = {
    id: string
    name: string
    ip: string
    token: string
    lastSeen: Date | null
    location: string | null
    status: $Enums.NodeStatus
    cpuUsage: number
    ramUsage: number
    serviceStatus: string
    createdAt: Date
    updatedAt: Date
    _count: NodeCountAggregateOutputType | null
    _avg: NodeAvgAggregateOutputType | null
    _sum: NodeSumAggregateOutputType | null
    _min: NodeMinAggregateOutputType | null
    _max: NodeMaxAggregateOutputType | null
  }

  type GetNodeGroupByPayload<T extends NodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NodeGroupByOutputType[P]>
            : GetScalarType<T[P], NodeGroupByOutputType[P]>
        }
      >
    >


  export type NodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ip?: boolean
    token?: boolean
    lastSeen?: boolean
    location?: boolean
    status?: boolean
    cpuUsage?: boolean
    ramUsage?: boolean
    serviceStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vpnUsers?: boolean | Node$vpnUsersArgs<ExtArgs>
    actionLogs?: boolean | Node$actionLogsArgs<ExtArgs>
    _count?: boolean | NodeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["node"]>

  export type NodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ip?: boolean
    token?: boolean
    lastSeen?: boolean
    location?: boolean
    status?: boolean
    cpuUsage?: boolean
    ramUsage?: boolean
    serviceStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["node"]>

  export type NodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ip?: boolean
    token?: boolean
    lastSeen?: boolean
    location?: boolean
    status?: boolean
    cpuUsage?: boolean
    ramUsage?: boolean
    serviceStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["node"]>

  export type NodeSelectScalar = {
    id?: boolean
    name?: boolean
    ip?: boolean
    token?: boolean
    lastSeen?: boolean
    location?: boolean
    status?: boolean
    cpuUsage?: boolean
    ramUsage?: boolean
    serviceStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "ip" | "token" | "lastSeen" | "location" | "status" | "cpuUsage" | "ramUsage" | "serviceStatus" | "createdAt" | "updatedAt", ExtArgs["result"]["node"]>
  export type NodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vpnUsers?: boolean | Node$vpnUsersArgs<ExtArgs>
    actionLogs?: boolean | Node$actionLogsArgs<ExtArgs>
    _count?: boolean | NodeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Node"
    objects: {
      vpnUsers: Prisma.$VpnUserPayload<ExtArgs>[]
      actionLogs: Prisma.$ActionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ip: string
      token: string
      lastSeen: Date | null
      location: string | null
      status: $Enums.NodeStatus
      cpuUsage: number
      ramUsage: number
      serviceStatus: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["node"]>
    composites: {}
  }

  type NodeGetPayload<S extends boolean | null | undefined | NodeDefaultArgs> = $Result.GetResult<Prisma.$NodePayload, S>

  type NodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NodeCountAggregateInputType | true
    }

  export interface NodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Node'], meta: { name: 'Node' } }
    /**
     * Find zero or one Node that matches the filter.
     * @param {NodeFindUniqueArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NodeFindUniqueArgs>(args: SelectSubset<T, NodeFindUniqueArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Node that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NodeFindUniqueOrThrowArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NodeFindUniqueOrThrowArgs>(args: SelectSubset<T, NodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Node that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeFindFirstArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NodeFindFirstArgs>(args?: SelectSubset<T, NodeFindFirstArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Node that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeFindFirstOrThrowArgs} args - Arguments to find a Node
     * @example
     * // Get one Node
     * const node = await prisma.node.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NodeFindFirstOrThrowArgs>(args?: SelectSubset<T, NodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Nodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Nodes
     * const nodes = await prisma.node.findMany()
     * 
     * // Get first 10 Nodes
     * const nodes = await prisma.node.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nodeWithIdOnly = await prisma.node.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NodeFindManyArgs>(args?: SelectSubset<T, NodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Node.
     * @param {NodeCreateArgs} args - Arguments to create a Node.
     * @example
     * // Create one Node
     * const Node = await prisma.node.create({
     *   data: {
     *     // ... data to create a Node
     *   }
     * })
     * 
     */
    create<T extends NodeCreateArgs>(args: SelectSubset<T, NodeCreateArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Nodes.
     * @param {NodeCreateManyArgs} args - Arguments to create many Nodes.
     * @example
     * // Create many Nodes
     * const node = await prisma.node.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NodeCreateManyArgs>(args?: SelectSubset<T, NodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Nodes and returns the data saved in the database.
     * @param {NodeCreateManyAndReturnArgs} args - Arguments to create many Nodes.
     * @example
     * // Create many Nodes
     * const node = await prisma.node.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Nodes and only return the `id`
     * const nodeWithIdOnly = await prisma.node.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NodeCreateManyAndReturnArgs>(args?: SelectSubset<T, NodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Node.
     * @param {NodeDeleteArgs} args - Arguments to delete one Node.
     * @example
     * // Delete one Node
     * const Node = await prisma.node.delete({
     *   where: {
     *     // ... filter to delete one Node
     *   }
     * })
     * 
     */
    delete<T extends NodeDeleteArgs>(args: SelectSubset<T, NodeDeleteArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Node.
     * @param {NodeUpdateArgs} args - Arguments to update one Node.
     * @example
     * // Update one Node
     * const node = await prisma.node.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NodeUpdateArgs>(args: SelectSubset<T, NodeUpdateArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Nodes.
     * @param {NodeDeleteManyArgs} args - Arguments to filter Nodes to delete.
     * @example
     * // Delete a few Nodes
     * const { count } = await prisma.node.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NodeDeleteManyArgs>(args?: SelectSubset<T, NodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Nodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Nodes
     * const node = await prisma.node.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NodeUpdateManyArgs>(args: SelectSubset<T, NodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Nodes and returns the data updated in the database.
     * @param {NodeUpdateManyAndReturnArgs} args - Arguments to update many Nodes.
     * @example
     * // Update many Nodes
     * const node = await prisma.node.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Nodes and only return the `id`
     * const nodeWithIdOnly = await prisma.node.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NodeUpdateManyAndReturnArgs>(args: SelectSubset<T, NodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Node.
     * @param {NodeUpsertArgs} args - Arguments to update or create a Node.
     * @example
     * // Update or create a Node
     * const node = await prisma.node.upsert({
     *   create: {
     *     // ... data to create a Node
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Node we want to update
     *   }
     * })
     */
    upsert<T extends NodeUpsertArgs>(args: SelectSubset<T, NodeUpsertArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Nodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeCountArgs} args - Arguments to filter Nodes to count.
     * @example
     * // Count the number of Nodes
     * const count = await prisma.node.count({
     *   where: {
     *     // ... the filter for the Nodes we want to count
     *   }
     * })
    **/
    count<T extends NodeCountArgs>(
      args?: Subset<T, NodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Node.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NodeAggregateArgs>(args: Subset<T, NodeAggregateArgs>): Prisma.PrismaPromise<GetNodeAggregateType<T>>

    /**
     * Group by Node.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NodeGroupByArgs['orderBy'] }
        : { orderBy?: NodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Node model
   */
  readonly fields: NodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Node.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vpnUsers<T extends Node$vpnUsersArgs<ExtArgs> = {}>(args?: Subset<T, Node$vpnUsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    actionLogs<T extends Node$actionLogsArgs<ExtArgs> = {}>(args?: Subset<T, Node$actionLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Node model
   */
  interface NodeFieldRefs {
    readonly id: FieldRef<"Node", 'String'>
    readonly name: FieldRef<"Node", 'String'>
    readonly ip: FieldRef<"Node", 'String'>
    readonly token: FieldRef<"Node", 'String'>
    readonly lastSeen: FieldRef<"Node", 'DateTime'>
    readonly location: FieldRef<"Node", 'String'>
    readonly status: FieldRef<"Node", 'NodeStatus'>
    readonly cpuUsage: FieldRef<"Node", 'Float'>
    readonly ramUsage: FieldRef<"Node", 'Float'>
    readonly serviceStatus: FieldRef<"Node", 'String'>
    readonly createdAt: FieldRef<"Node", 'DateTime'>
    readonly updatedAt: FieldRef<"Node", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Node findUnique
   */
  export type NodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node findUniqueOrThrow
   */
  export type NodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node findFirst
   */
  export type NodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Nodes.
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Nodes.
     */
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Node findFirstOrThrow
   */
  export type NodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Node to fetch.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Nodes.
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Nodes.
     */
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Node findMany
   */
  export type NodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter, which Nodes to fetch.
     */
    where?: NodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Nodes to fetch.
     */
    orderBy?: NodeOrderByWithRelationInput | NodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Nodes.
     */
    cursor?: NodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Nodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Nodes.
     */
    skip?: number
    distinct?: NodeScalarFieldEnum | NodeScalarFieldEnum[]
  }

  /**
   * Node create
   */
  export type NodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * The data needed to create a Node.
     */
    data: XOR<NodeCreateInput, NodeUncheckedCreateInput>
  }

  /**
   * Node createMany
   */
  export type NodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Nodes.
     */
    data: NodeCreateManyInput | NodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Node createManyAndReturn
   */
  export type NodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * The data used to create many Nodes.
     */
    data: NodeCreateManyInput | NodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Node update
   */
  export type NodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * The data needed to update a Node.
     */
    data: XOR<NodeUpdateInput, NodeUncheckedUpdateInput>
    /**
     * Choose, which Node to update.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node updateMany
   */
  export type NodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Nodes.
     */
    data: XOR<NodeUpdateManyMutationInput, NodeUncheckedUpdateManyInput>
    /**
     * Filter which Nodes to update
     */
    where?: NodeWhereInput
    /**
     * Limit how many Nodes to update.
     */
    limit?: number
  }

  /**
   * Node updateManyAndReturn
   */
  export type NodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * The data used to update Nodes.
     */
    data: XOR<NodeUpdateManyMutationInput, NodeUncheckedUpdateManyInput>
    /**
     * Filter which Nodes to update
     */
    where?: NodeWhereInput
    /**
     * Limit how many Nodes to update.
     */
    limit?: number
  }

  /**
   * Node upsert
   */
  export type NodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * The filter to search for the Node to update in case it exists.
     */
    where: NodeWhereUniqueInput
    /**
     * In case the Node found by the `where` argument doesn't exist, create a new Node with this data.
     */
    create: XOR<NodeCreateInput, NodeUncheckedCreateInput>
    /**
     * In case the Node was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NodeUpdateInput, NodeUncheckedUpdateInput>
  }

  /**
   * Node delete
   */
  export type NodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
    /**
     * Filter which Node to delete.
     */
    where: NodeWhereUniqueInput
  }

  /**
   * Node deleteMany
   */
  export type NodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Nodes to delete
     */
    where?: NodeWhereInput
    /**
     * Limit how many Nodes to delete.
     */
    limit?: number
  }

  /**
   * Node.vpnUsers
   */
  export type Node$vpnUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    where?: VpnUserWhereInput
    orderBy?: VpnUserOrderByWithRelationInput | VpnUserOrderByWithRelationInput[]
    cursor?: VpnUserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VpnUserScalarFieldEnum | VpnUserScalarFieldEnum[]
  }

  /**
   * Node.actionLogs
   */
  export type Node$actionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    where?: ActionLogWhereInput
    orderBy?: ActionLogOrderByWithRelationInput | ActionLogOrderByWithRelationInput[]
    cursor?: ActionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionLogScalarFieldEnum | ActionLogScalarFieldEnum[]
  }

  /**
   * Node without action
   */
  export type NodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Node
     */
    select?: NodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Node
     */
    omit?: NodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NodeInclude<ExtArgs> | null
  }


  /**
   * Model VpnUser
   */

  export type AggregateVpnUser = {
    _count: VpnUserCountAggregateOutputType | null
    _min: VpnUserMinAggregateOutputType | null
    _max: VpnUserMaxAggregateOutputType | null
  }

  export type VpnUserMinAggregateOutputType = {
    id: string | null
    username: string | null
    nodeId: string | null
    status: $Enums.VpnCertificateStatus | null
    expirationDate: Date | null
    revocationDate: Date | null
    serialNumber: string | null
    isActive: boolean | null
    lastConnected: Date | null
    ovpnFileContent: string | null
    lastSeen: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VpnUserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    nodeId: string | null
    status: $Enums.VpnCertificateStatus | null
    expirationDate: Date | null
    revocationDate: Date | null
    serialNumber: string | null
    isActive: boolean | null
    lastConnected: Date | null
    ovpnFileContent: string | null
    lastSeen: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VpnUserCountAggregateOutputType = {
    id: number
    username: number
    nodeId: number
    status: number
    expirationDate: number
    revocationDate: number
    serialNumber: number
    isActive: number
    lastConnected: number
    ovpnFileContent: number
    lastSeen: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VpnUserMinAggregateInputType = {
    id?: true
    username?: true
    nodeId?: true
    status?: true
    expirationDate?: true
    revocationDate?: true
    serialNumber?: true
    isActive?: true
    lastConnected?: true
    ovpnFileContent?: true
    lastSeen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VpnUserMaxAggregateInputType = {
    id?: true
    username?: true
    nodeId?: true
    status?: true
    expirationDate?: true
    revocationDate?: true
    serialNumber?: true
    isActive?: true
    lastConnected?: true
    ovpnFileContent?: true
    lastSeen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VpnUserCountAggregateInputType = {
    id?: true
    username?: true
    nodeId?: true
    status?: true
    expirationDate?: true
    revocationDate?: true
    serialNumber?: true
    isActive?: true
    lastConnected?: true
    ovpnFileContent?: true
    lastSeen?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VpnUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VpnUser to aggregate.
     */
    where?: VpnUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VpnUsers to fetch.
     */
    orderBy?: VpnUserOrderByWithRelationInput | VpnUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VpnUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VpnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VpnUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VpnUsers
    **/
    _count?: true | VpnUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VpnUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VpnUserMaxAggregateInputType
  }

  export type GetVpnUserAggregateType<T extends VpnUserAggregateArgs> = {
        [P in keyof T & keyof AggregateVpnUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVpnUser[P]>
      : GetScalarType<T[P], AggregateVpnUser[P]>
  }




  export type VpnUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VpnUserWhereInput
    orderBy?: VpnUserOrderByWithAggregationInput | VpnUserOrderByWithAggregationInput[]
    by: VpnUserScalarFieldEnum[] | VpnUserScalarFieldEnum
    having?: VpnUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VpnUserCountAggregateInputType | true
    _min?: VpnUserMinAggregateInputType
    _max?: VpnUserMaxAggregateInputType
  }

  export type VpnUserGroupByOutputType = {
    id: string
    username: string
    nodeId: string
    status: $Enums.VpnCertificateStatus
    expirationDate: Date | null
    revocationDate: Date | null
    serialNumber: string | null
    isActive: boolean
    lastConnected: Date | null
    ovpnFileContent: string | null
    lastSeen: Date | null
    createdAt: Date
    updatedAt: Date
    _count: VpnUserCountAggregateOutputType | null
    _min: VpnUserMinAggregateOutputType | null
    _max: VpnUserMaxAggregateOutputType | null
  }

  type GetVpnUserGroupByPayload<T extends VpnUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VpnUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VpnUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VpnUserGroupByOutputType[P]>
            : GetScalarType<T[P], VpnUserGroupByOutputType[P]>
        }
      >
    >


  export type VpnUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    nodeId?: boolean
    status?: boolean
    expirationDate?: boolean
    revocationDate?: boolean
    serialNumber?: boolean
    isActive?: boolean
    lastConnected?: boolean
    ovpnFileContent?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    node?: boolean | NodeDefaultArgs<ExtArgs>
    actionLogs?: boolean | VpnUser$actionLogsArgs<ExtArgs>
    _count?: boolean | VpnUserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vpnUser"]>

  export type VpnUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    nodeId?: boolean
    status?: boolean
    expirationDate?: boolean
    revocationDate?: boolean
    serialNumber?: boolean
    isActive?: boolean
    lastConnected?: boolean
    ovpnFileContent?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    node?: boolean | NodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vpnUser"]>

  export type VpnUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    nodeId?: boolean
    status?: boolean
    expirationDate?: boolean
    revocationDate?: boolean
    serialNumber?: boolean
    isActive?: boolean
    lastConnected?: boolean
    ovpnFileContent?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    node?: boolean | NodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vpnUser"]>

  export type VpnUserSelectScalar = {
    id?: boolean
    username?: boolean
    nodeId?: boolean
    status?: boolean
    expirationDate?: boolean
    revocationDate?: boolean
    serialNumber?: boolean
    isActive?: boolean
    lastConnected?: boolean
    ovpnFileContent?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VpnUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "nodeId" | "status" | "expirationDate" | "revocationDate" | "serialNumber" | "isActive" | "lastConnected" | "ovpnFileContent" | "lastSeen" | "createdAt" | "updatedAt", ExtArgs["result"]["vpnUser"]>
  export type VpnUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    node?: boolean | NodeDefaultArgs<ExtArgs>
    actionLogs?: boolean | VpnUser$actionLogsArgs<ExtArgs>
    _count?: boolean | VpnUserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VpnUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    node?: boolean | NodeDefaultArgs<ExtArgs>
  }
  export type VpnUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    node?: boolean | NodeDefaultArgs<ExtArgs>
  }

  export type $VpnUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VpnUser"
    objects: {
      node: Prisma.$NodePayload<ExtArgs>
      actionLogs: Prisma.$ActionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      nodeId: string
      status: $Enums.VpnCertificateStatus
      expirationDate: Date | null
      revocationDate: Date | null
      serialNumber: string | null
      isActive: boolean
      lastConnected: Date | null
      ovpnFileContent: string | null
      lastSeen: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vpnUser"]>
    composites: {}
  }

  type VpnUserGetPayload<S extends boolean | null | undefined | VpnUserDefaultArgs> = $Result.GetResult<Prisma.$VpnUserPayload, S>

  type VpnUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VpnUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VpnUserCountAggregateInputType | true
    }

  export interface VpnUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VpnUser'], meta: { name: 'VpnUser' } }
    /**
     * Find zero or one VpnUser that matches the filter.
     * @param {VpnUserFindUniqueArgs} args - Arguments to find a VpnUser
     * @example
     * // Get one VpnUser
     * const vpnUser = await prisma.vpnUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VpnUserFindUniqueArgs>(args: SelectSubset<T, VpnUserFindUniqueArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VpnUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VpnUserFindUniqueOrThrowArgs} args - Arguments to find a VpnUser
     * @example
     * // Get one VpnUser
     * const vpnUser = await prisma.vpnUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VpnUserFindUniqueOrThrowArgs>(args: SelectSubset<T, VpnUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VpnUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserFindFirstArgs} args - Arguments to find a VpnUser
     * @example
     * // Get one VpnUser
     * const vpnUser = await prisma.vpnUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VpnUserFindFirstArgs>(args?: SelectSubset<T, VpnUserFindFirstArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VpnUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserFindFirstOrThrowArgs} args - Arguments to find a VpnUser
     * @example
     * // Get one VpnUser
     * const vpnUser = await prisma.vpnUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VpnUserFindFirstOrThrowArgs>(args?: SelectSubset<T, VpnUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VpnUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VpnUsers
     * const vpnUsers = await prisma.vpnUser.findMany()
     * 
     * // Get first 10 VpnUsers
     * const vpnUsers = await prisma.vpnUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vpnUserWithIdOnly = await prisma.vpnUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VpnUserFindManyArgs>(args?: SelectSubset<T, VpnUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VpnUser.
     * @param {VpnUserCreateArgs} args - Arguments to create a VpnUser.
     * @example
     * // Create one VpnUser
     * const VpnUser = await prisma.vpnUser.create({
     *   data: {
     *     // ... data to create a VpnUser
     *   }
     * })
     * 
     */
    create<T extends VpnUserCreateArgs>(args: SelectSubset<T, VpnUserCreateArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VpnUsers.
     * @param {VpnUserCreateManyArgs} args - Arguments to create many VpnUsers.
     * @example
     * // Create many VpnUsers
     * const vpnUser = await prisma.vpnUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VpnUserCreateManyArgs>(args?: SelectSubset<T, VpnUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VpnUsers and returns the data saved in the database.
     * @param {VpnUserCreateManyAndReturnArgs} args - Arguments to create many VpnUsers.
     * @example
     * // Create many VpnUsers
     * const vpnUser = await prisma.vpnUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VpnUsers and only return the `id`
     * const vpnUserWithIdOnly = await prisma.vpnUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VpnUserCreateManyAndReturnArgs>(args?: SelectSubset<T, VpnUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VpnUser.
     * @param {VpnUserDeleteArgs} args - Arguments to delete one VpnUser.
     * @example
     * // Delete one VpnUser
     * const VpnUser = await prisma.vpnUser.delete({
     *   where: {
     *     // ... filter to delete one VpnUser
     *   }
     * })
     * 
     */
    delete<T extends VpnUserDeleteArgs>(args: SelectSubset<T, VpnUserDeleteArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VpnUser.
     * @param {VpnUserUpdateArgs} args - Arguments to update one VpnUser.
     * @example
     * // Update one VpnUser
     * const vpnUser = await prisma.vpnUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VpnUserUpdateArgs>(args: SelectSubset<T, VpnUserUpdateArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VpnUsers.
     * @param {VpnUserDeleteManyArgs} args - Arguments to filter VpnUsers to delete.
     * @example
     * // Delete a few VpnUsers
     * const { count } = await prisma.vpnUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VpnUserDeleteManyArgs>(args?: SelectSubset<T, VpnUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VpnUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VpnUsers
     * const vpnUser = await prisma.vpnUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VpnUserUpdateManyArgs>(args: SelectSubset<T, VpnUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VpnUsers and returns the data updated in the database.
     * @param {VpnUserUpdateManyAndReturnArgs} args - Arguments to update many VpnUsers.
     * @example
     * // Update many VpnUsers
     * const vpnUser = await prisma.vpnUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VpnUsers and only return the `id`
     * const vpnUserWithIdOnly = await prisma.vpnUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VpnUserUpdateManyAndReturnArgs>(args: SelectSubset<T, VpnUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VpnUser.
     * @param {VpnUserUpsertArgs} args - Arguments to update or create a VpnUser.
     * @example
     * // Update or create a VpnUser
     * const vpnUser = await prisma.vpnUser.upsert({
     *   create: {
     *     // ... data to create a VpnUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VpnUser we want to update
     *   }
     * })
     */
    upsert<T extends VpnUserUpsertArgs>(args: SelectSubset<T, VpnUserUpsertArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VpnUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserCountArgs} args - Arguments to filter VpnUsers to count.
     * @example
     * // Count the number of VpnUsers
     * const count = await prisma.vpnUser.count({
     *   where: {
     *     // ... the filter for the VpnUsers we want to count
     *   }
     * })
    **/
    count<T extends VpnUserCountArgs>(
      args?: Subset<T, VpnUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VpnUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VpnUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VpnUserAggregateArgs>(args: Subset<T, VpnUserAggregateArgs>): Prisma.PrismaPromise<GetVpnUserAggregateType<T>>

    /**
     * Group by VpnUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VpnUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VpnUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VpnUserGroupByArgs['orderBy'] }
        : { orderBy?: VpnUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VpnUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVpnUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VpnUser model
   */
  readonly fields: VpnUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VpnUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VpnUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    node<T extends NodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NodeDefaultArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    actionLogs<T extends VpnUser$actionLogsArgs<ExtArgs> = {}>(args?: Subset<T, VpnUser$actionLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VpnUser model
   */
  interface VpnUserFieldRefs {
    readonly id: FieldRef<"VpnUser", 'String'>
    readonly username: FieldRef<"VpnUser", 'String'>
    readonly nodeId: FieldRef<"VpnUser", 'String'>
    readonly status: FieldRef<"VpnUser", 'VpnCertificateStatus'>
    readonly expirationDate: FieldRef<"VpnUser", 'DateTime'>
    readonly revocationDate: FieldRef<"VpnUser", 'DateTime'>
    readonly serialNumber: FieldRef<"VpnUser", 'String'>
    readonly isActive: FieldRef<"VpnUser", 'Boolean'>
    readonly lastConnected: FieldRef<"VpnUser", 'DateTime'>
    readonly ovpnFileContent: FieldRef<"VpnUser", 'String'>
    readonly lastSeen: FieldRef<"VpnUser", 'DateTime'>
    readonly createdAt: FieldRef<"VpnUser", 'DateTime'>
    readonly updatedAt: FieldRef<"VpnUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VpnUser findUnique
   */
  export type VpnUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * Filter, which VpnUser to fetch.
     */
    where: VpnUserWhereUniqueInput
  }

  /**
   * VpnUser findUniqueOrThrow
   */
  export type VpnUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * Filter, which VpnUser to fetch.
     */
    where: VpnUserWhereUniqueInput
  }

  /**
   * VpnUser findFirst
   */
  export type VpnUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * Filter, which VpnUser to fetch.
     */
    where?: VpnUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VpnUsers to fetch.
     */
    orderBy?: VpnUserOrderByWithRelationInput | VpnUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VpnUsers.
     */
    cursor?: VpnUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VpnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VpnUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VpnUsers.
     */
    distinct?: VpnUserScalarFieldEnum | VpnUserScalarFieldEnum[]
  }

  /**
   * VpnUser findFirstOrThrow
   */
  export type VpnUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * Filter, which VpnUser to fetch.
     */
    where?: VpnUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VpnUsers to fetch.
     */
    orderBy?: VpnUserOrderByWithRelationInput | VpnUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VpnUsers.
     */
    cursor?: VpnUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VpnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VpnUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VpnUsers.
     */
    distinct?: VpnUserScalarFieldEnum | VpnUserScalarFieldEnum[]
  }

  /**
   * VpnUser findMany
   */
  export type VpnUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * Filter, which VpnUsers to fetch.
     */
    where?: VpnUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VpnUsers to fetch.
     */
    orderBy?: VpnUserOrderByWithRelationInput | VpnUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VpnUsers.
     */
    cursor?: VpnUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VpnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VpnUsers.
     */
    skip?: number
    distinct?: VpnUserScalarFieldEnum | VpnUserScalarFieldEnum[]
  }

  /**
   * VpnUser create
   */
  export type VpnUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * The data needed to create a VpnUser.
     */
    data: XOR<VpnUserCreateInput, VpnUserUncheckedCreateInput>
  }

  /**
   * VpnUser createMany
   */
  export type VpnUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VpnUsers.
     */
    data: VpnUserCreateManyInput | VpnUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VpnUser createManyAndReturn
   */
  export type VpnUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * The data used to create many VpnUsers.
     */
    data: VpnUserCreateManyInput | VpnUserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VpnUser update
   */
  export type VpnUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * The data needed to update a VpnUser.
     */
    data: XOR<VpnUserUpdateInput, VpnUserUncheckedUpdateInput>
    /**
     * Choose, which VpnUser to update.
     */
    where: VpnUserWhereUniqueInput
  }

  /**
   * VpnUser updateMany
   */
  export type VpnUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VpnUsers.
     */
    data: XOR<VpnUserUpdateManyMutationInput, VpnUserUncheckedUpdateManyInput>
    /**
     * Filter which VpnUsers to update
     */
    where?: VpnUserWhereInput
    /**
     * Limit how many VpnUsers to update.
     */
    limit?: number
  }

  /**
   * VpnUser updateManyAndReturn
   */
  export type VpnUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * The data used to update VpnUsers.
     */
    data: XOR<VpnUserUpdateManyMutationInput, VpnUserUncheckedUpdateManyInput>
    /**
     * Filter which VpnUsers to update
     */
    where?: VpnUserWhereInput
    /**
     * Limit how many VpnUsers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VpnUser upsert
   */
  export type VpnUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * The filter to search for the VpnUser to update in case it exists.
     */
    where: VpnUserWhereUniqueInput
    /**
     * In case the VpnUser found by the `where` argument doesn't exist, create a new VpnUser with this data.
     */
    create: XOR<VpnUserCreateInput, VpnUserUncheckedCreateInput>
    /**
     * In case the VpnUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VpnUserUpdateInput, VpnUserUncheckedUpdateInput>
  }

  /**
   * VpnUser delete
   */
  export type VpnUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    /**
     * Filter which VpnUser to delete.
     */
    where: VpnUserWhereUniqueInput
  }

  /**
   * VpnUser deleteMany
   */
  export type VpnUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VpnUsers to delete
     */
    where?: VpnUserWhereInput
    /**
     * Limit how many VpnUsers to delete.
     */
    limit?: number
  }

  /**
   * VpnUser.actionLogs
   */
  export type VpnUser$actionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    where?: ActionLogWhereInput
    orderBy?: ActionLogOrderByWithRelationInput | ActionLogOrderByWithRelationInput[]
    cursor?: ActionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionLogScalarFieldEnum | ActionLogScalarFieldEnum[]
  }

  /**
   * VpnUser without action
   */
  export type VpnUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
  }


  /**
   * Model ActionLog
   */

  export type AggregateActionLog = {
    _count: ActionLogCountAggregateOutputType | null
    _min: ActionLogMinAggregateOutputType | null
    _max: ActionLogMaxAggregateOutputType | null
  }

  export type ActionLogMinAggregateOutputType = {
    id: string | null
    action: $Enums.ActionType | null
    status: $Enums.ActionStatus | null
    message: string | null
    nodeId: string | null
    vpnUserId: string | null
    details: string | null
    ovpnFileContent: string | null
    createdAt: Date | null
    updatedAt: Date | null
    executedAt: Date | null
  }

  export type ActionLogMaxAggregateOutputType = {
    id: string | null
    action: $Enums.ActionType | null
    status: $Enums.ActionStatus | null
    message: string | null
    nodeId: string | null
    vpnUserId: string | null
    details: string | null
    ovpnFileContent: string | null
    createdAt: Date | null
    updatedAt: Date | null
    executedAt: Date | null
  }

  export type ActionLogCountAggregateOutputType = {
    id: number
    action: number
    status: number
    message: number
    nodeId: number
    vpnUserId: number
    details: number
    ovpnFileContent: number
    createdAt: number
    updatedAt: number
    executedAt: number
    _all: number
  }


  export type ActionLogMinAggregateInputType = {
    id?: true
    action?: true
    status?: true
    message?: true
    nodeId?: true
    vpnUserId?: true
    details?: true
    ovpnFileContent?: true
    createdAt?: true
    updatedAt?: true
    executedAt?: true
  }

  export type ActionLogMaxAggregateInputType = {
    id?: true
    action?: true
    status?: true
    message?: true
    nodeId?: true
    vpnUserId?: true
    details?: true
    ovpnFileContent?: true
    createdAt?: true
    updatedAt?: true
    executedAt?: true
  }

  export type ActionLogCountAggregateInputType = {
    id?: true
    action?: true
    status?: true
    message?: true
    nodeId?: true
    vpnUserId?: true
    details?: true
    ovpnFileContent?: true
    createdAt?: true
    updatedAt?: true
    executedAt?: true
    _all?: true
  }

  export type ActionLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionLog to aggregate.
     */
    where?: ActionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionLogs to fetch.
     */
    orderBy?: ActionLogOrderByWithRelationInput | ActionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActionLogs
    **/
    _count?: true | ActionLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionLogMaxAggregateInputType
  }

  export type GetActionLogAggregateType<T extends ActionLogAggregateArgs> = {
        [P in keyof T & keyof AggregateActionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActionLog[P]>
      : GetScalarType<T[P], AggregateActionLog[P]>
  }




  export type ActionLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionLogWhereInput
    orderBy?: ActionLogOrderByWithAggregationInput | ActionLogOrderByWithAggregationInput[]
    by: ActionLogScalarFieldEnum[] | ActionLogScalarFieldEnum
    having?: ActionLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionLogCountAggregateInputType | true
    _min?: ActionLogMinAggregateInputType
    _max?: ActionLogMaxAggregateInputType
  }

  export type ActionLogGroupByOutputType = {
    id: string
    action: $Enums.ActionType
    status: $Enums.ActionStatus
    message: string | null
    nodeId: string
    vpnUserId: string | null
    details: string | null
    ovpnFileContent: string | null
    createdAt: Date
    updatedAt: Date
    executedAt: Date | null
    _count: ActionLogCountAggregateOutputType | null
    _min: ActionLogMinAggregateOutputType | null
    _max: ActionLogMaxAggregateOutputType | null
  }

  type GetActionLogGroupByPayload<T extends ActionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionLogGroupByOutputType[P]>
            : GetScalarType<T[P], ActionLogGroupByOutputType[P]>
        }
      >
    >


  export type ActionLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    status?: boolean
    message?: boolean
    nodeId?: boolean
    vpnUserId?: boolean
    details?: boolean
    ovpnFileContent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    executedAt?: boolean
    node?: boolean | NodeDefaultArgs<ExtArgs>
    vpnUser?: boolean | ActionLog$vpnUserArgs<ExtArgs>
  }, ExtArgs["result"]["actionLog"]>

  export type ActionLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    status?: boolean
    message?: boolean
    nodeId?: boolean
    vpnUserId?: boolean
    details?: boolean
    ovpnFileContent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    executedAt?: boolean
    node?: boolean | NodeDefaultArgs<ExtArgs>
    vpnUser?: boolean | ActionLog$vpnUserArgs<ExtArgs>
  }, ExtArgs["result"]["actionLog"]>

  export type ActionLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    status?: boolean
    message?: boolean
    nodeId?: boolean
    vpnUserId?: boolean
    details?: boolean
    ovpnFileContent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    executedAt?: boolean
    node?: boolean | NodeDefaultArgs<ExtArgs>
    vpnUser?: boolean | ActionLog$vpnUserArgs<ExtArgs>
  }, ExtArgs["result"]["actionLog"]>

  export type ActionLogSelectScalar = {
    id?: boolean
    action?: boolean
    status?: boolean
    message?: boolean
    nodeId?: boolean
    vpnUserId?: boolean
    details?: boolean
    ovpnFileContent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    executedAt?: boolean
  }

  export type ActionLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "status" | "message" | "nodeId" | "vpnUserId" | "details" | "ovpnFileContent" | "createdAt" | "updatedAt" | "executedAt", ExtArgs["result"]["actionLog"]>
  export type ActionLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    node?: boolean | NodeDefaultArgs<ExtArgs>
    vpnUser?: boolean | ActionLog$vpnUserArgs<ExtArgs>
  }
  export type ActionLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    node?: boolean | NodeDefaultArgs<ExtArgs>
    vpnUser?: boolean | ActionLog$vpnUserArgs<ExtArgs>
  }
  export type ActionLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    node?: boolean | NodeDefaultArgs<ExtArgs>
    vpnUser?: boolean | ActionLog$vpnUserArgs<ExtArgs>
  }

  export type $ActionLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActionLog"
    objects: {
      node: Prisma.$NodePayload<ExtArgs>
      vpnUser: Prisma.$VpnUserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: $Enums.ActionType
      status: $Enums.ActionStatus
      message: string | null
      nodeId: string
      vpnUserId: string | null
      details: string | null
      ovpnFileContent: string | null
      createdAt: Date
      updatedAt: Date
      executedAt: Date | null
    }, ExtArgs["result"]["actionLog"]>
    composites: {}
  }

  type ActionLogGetPayload<S extends boolean | null | undefined | ActionLogDefaultArgs> = $Result.GetResult<Prisma.$ActionLogPayload, S>

  type ActionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ActionLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActionLogCountAggregateInputType | true
    }

  export interface ActionLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActionLog'], meta: { name: 'ActionLog' } }
    /**
     * Find zero or one ActionLog that matches the filter.
     * @param {ActionLogFindUniqueArgs} args - Arguments to find a ActionLog
     * @example
     * // Get one ActionLog
     * const actionLog = await prisma.actionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionLogFindUniqueArgs>(args: SelectSubset<T, ActionLogFindUniqueArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ActionLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ActionLogFindUniqueOrThrowArgs} args - Arguments to find a ActionLog
     * @example
     * // Get one ActionLog
     * const actionLog = await prisma.actionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogFindFirstArgs} args - Arguments to find a ActionLog
     * @example
     * // Get one ActionLog
     * const actionLog = await prisma.actionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionLogFindFirstArgs>(args?: SelectSubset<T, ActionLogFindFirstArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogFindFirstOrThrowArgs} args - Arguments to find a ActionLog
     * @example
     * // Get one ActionLog
     * const actionLog = await prisma.actionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ActionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActionLogs
     * const actionLogs = await prisma.actionLog.findMany()
     * 
     * // Get first 10 ActionLogs
     * const actionLogs = await prisma.actionLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionLogWithIdOnly = await prisma.actionLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionLogFindManyArgs>(args?: SelectSubset<T, ActionLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ActionLog.
     * @param {ActionLogCreateArgs} args - Arguments to create a ActionLog.
     * @example
     * // Create one ActionLog
     * const ActionLog = await prisma.actionLog.create({
     *   data: {
     *     // ... data to create a ActionLog
     *   }
     * })
     * 
     */
    create<T extends ActionLogCreateArgs>(args: SelectSubset<T, ActionLogCreateArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ActionLogs.
     * @param {ActionLogCreateManyArgs} args - Arguments to create many ActionLogs.
     * @example
     * // Create many ActionLogs
     * const actionLog = await prisma.actionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionLogCreateManyArgs>(args?: SelectSubset<T, ActionLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActionLogs and returns the data saved in the database.
     * @param {ActionLogCreateManyAndReturnArgs} args - Arguments to create many ActionLogs.
     * @example
     * // Create many ActionLogs
     * const actionLog = await prisma.actionLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActionLogs and only return the `id`
     * const actionLogWithIdOnly = await prisma.actionLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ActionLog.
     * @param {ActionLogDeleteArgs} args - Arguments to delete one ActionLog.
     * @example
     * // Delete one ActionLog
     * const ActionLog = await prisma.actionLog.delete({
     *   where: {
     *     // ... filter to delete one ActionLog
     *   }
     * })
     * 
     */
    delete<T extends ActionLogDeleteArgs>(args: SelectSubset<T, ActionLogDeleteArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ActionLog.
     * @param {ActionLogUpdateArgs} args - Arguments to update one ActionLog.
     * @example
     * // Update one ActionLog
     * const actionLog = await prisma.actionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionLogUpdateArgs>(args: SelectSubset<T, ActionLogUpdateArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ActionLogs.
     * @param {ActionLogDeleteManyArgs} args - Arguments to filter ActionLogs to delete.
     * @example
     * // Delete a few ActionLogs
     * const { count } = await prisma.actionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionLogDeleteManyArgs>(args?: SelectSubset<T, ActionLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActionLogs
     * const actionLog = await prisma.actionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionLogUpdateManyArgs>(args: SelectSubset<T, ActionLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionLogs and returns the data updated in the database.
     * @param {ActionLogUpdateManyAndReturnArgs} args - Arguments to update many ActionLogs.
     * @example
     * // Update many ActionLogs
     * const actionLog = await prisma.actionLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ActionLogs and only return the `id`
     * const actionLogWithIdOnly = await prisma.actionLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ActionLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ActionLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ActionLog.
     * @param {ActionLogUpsertArgs} args - Arguments to update or create a ActionLog.
     * @example
     * // Update or create a ActionLog
     * const actionLog = await prisma.actionLog.upsert({
     *   create: {
     *     // ... data to create a ActionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActionLog we want to update
     *   }
     * })
     */
    upsert<T extends ActionLogUpsertArgs>(args: SelectSubset<T, ActionLogUpsertArgs<ExtArgs>>): Prisma__ActionLogClient<$Result.GetResult<Prisma.$ActionLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ActionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogCountArgs} args - Arguments to filter ActionLogs to count.
     * @example
     * // Count the number of ActionLogs
     * const count = await prisma.actionLog.count({
     *   where: {
     *     // ... the filter for the ActionLogs we want to count
     *   }
     * })
    **/
    count<T extends ActionLogCountArgs>(
      args?: Subset<T, ActionLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActionLogAggregateArgs>(args: Subset<T, ActionLogAggregateArgs>): Prisma.PrismaPromise<GetActionLogAggregateType<T>>

    /**
     * Group by ActionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActionLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionLogGroupByArgs['orderBy'] }
        : { orderBy?: ActionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActionLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActionLog model
   */
  readonly fields: ActionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    node<T extends NodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NodeDefaultArgs<ExtArgs>>): Prisma__NodeClient<$Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    vpnUser<T extends ActionLog$vpnUserArgs<ExtArgs> = {}>(args?: Subset<T, ActionLog$vpnUserArgs<ExtArgs>>): Prisma__VpnUserClient<$Result.GetResult<Prisma.$VpnUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActionLog model
   */
  interface ActionLogFieldRefs {
    readonly id: FieldRef<"ActionLog", 'String'>
    readonly action: FieldRef<"ActionLog", 'ActionType'>
    readonly status: FieldRef<"ActionLog", 'ActionStatus'>
    readonly message: FieldRef<"ActionLog", 'String'>
    readonly nodeId: FieldRef<"ActionLog", 'String'>
    readonly vpnUserId: FieldRef<"ActionLog", 'String'>
    readonly details: FieldRef<"ActionLog", 'String'>
    readonly ovpnFileContent: FieldRef<"ActionLog", 'String'>
    readonly createdAt: FieldRef<"ActionLog", 'DateTime'>
    readonly updatedAt: FieldRef<"ActionLog", 'DateTime'>
    readonly executedAt: FieldRef<"ActionLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActionLog findUnique
   */
  export type ActionLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * Filter, which ActionLog to fetch.
     */
    where: ActionLogWhereUniqueInput
  }

  /**
   * ActionLog findUniqueOrThrow
   */
  export type ActionLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * Filter, which ActionLog to fetch.
     */
    where: ActionLogWhereUniqueInput
  }

  /**
   * ActionLog findFirst
   */
  export type ActionLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * Filter, which ActionLog to fetch.
     */
    where?: ActionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionLogs to fetch.
     */
    orderBy?: ActionLogOrderByWithRelationInput | ActionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionLogs.
     */
    cursor?: ActionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionLogs.
     */
    distinct?: ActionLogScalarFieldEnum | ActionLogScalarFieldEnum[]
  }

  /**
   * ActionLog findFirstOrThrow
   */
  export type ActionLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * Filter, which ActionLog to fetch.
     */
    where?: ActionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionLogs to fetch.
     */
    orderBy?: ActionLogOrderByWithRelationInput | ActionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionLogs.
     */
    cursor?: ActionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionLogs.
     */
    distinct?: ActionLogScalarFieldEnum | ActionLogScalarFieldEnum[]
  }

  /**
   * ActionLog findMany
   */
  export type ActionLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * Filter, which ActionLogs to fetch.
     */
    where?: ActionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionLogs to fetch.
     */
    orderBy?: ActionLogOrderByWithRelationInput | ActionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActionLogs.
     */
    cursor?: ActionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionLogs.
     */
    skip?: number
    distinct?: ActionLogScalarFieldEnum | ActionLogScalarFieldEnum[]
  }

  /**
   * ActionLog create
   */
  export type ActionLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ActionLog.
     */
    data: XOR<ActionLogCreateInput, ActionLogUncheckedCreateInput>
  }

  /**
   * ActionLog createMany
   */
  export type ActionLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActionLogs.
     */
    data: ActionLogCreateManyInput | ActionLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionLog createManyAndReturn
   */
  export type ActionLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * The data used to create many ActionLogs.
     */
    data: ActionLogCreateManyInput | ActionLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActionLog update
   */
  export type ActionLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ActionLog.
     */
    data: XOR<ActionLogUpdateInput, ActionLogUncheckedUpdateInput>
    /**
     * Choose, which ActionLog to update.
     */
    where: ActionLogWhereUniqueInput
  }

  /**
   * ActionLog updateMany
   */
  export type ActionLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActionLogs.
     */
    data: XOR<ActionLogUpdateManyMutationInput, ActionLogUncheckedUpdateManyInput>
    /**
     * Filter which ActionLogs to update
     */
    where?: ActionLogWhereInput
    /**
     * Limit how many ActionLogs to update.
     */
    limit?: number
  }

  /**
   * ActionLog updateManyAndReturn
   */
  export type ActionLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * The data used to update ActionLogs.
     */
    data: XOR<ActionLogUpdateManyMutationInput, ActionLogUncheckedUpdateManyInput>
    /**
     * Filter which ActionLogs to update
     */
    where?: ActionLogWhereInput
    /**
     * Limit how many ActionLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActionLog upsert
   */
  export type ActionLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ActionLog to update in case it exists.
     */
    where: ActionLogWhereUniqueInput
    /**
     * In case the ActionLog found by the `where` argument doesn't exist, create a new ActionLog with this data.
     */
    create: XOR<ActionLogCreateInput, ActionLogUncheckedCreateInput>
    /**
     * In case the ActionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionLogUpdateInput, ActionLogUncheckedUpdateInput>
  }

  /**
   * ActionLog delete
   */
  export type ActionLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
    /**
     * Filter which ActionLog to delete.
     */
    where: ActionLogWhereUniqueInput
  }

  /**
   * ActionLog deleteMany
   */
  export type ActionLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionLogs to delete
     */
    where?: ActionLogWhereInput
    /**
     * Limit how many ActionLogs to delete.
     */
    limit?: number
  }

  /**
   * ActionLog.vpnUser
   */
  export type ActionLog$vpnUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VpnUser
     */
    select?: VpnUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VpnUser
     */
    omit?: VpnUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VpnUserInclude<ExtArgs> | null
    where?: VpnUserWhereInput
  }

  /**
   * ActionLog without action
   */
  export type ActionLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionLog
     */
    select?: ActionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionLog
     */
    omit?: ActionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const NodeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ip: 'ip',
    token: 'token',
    lastSeen: 'lastSeen',
    location: 'location',
    status: 'status',
    cpuUsage: 'cpuUsage',
    ramUsage: 'ramUsage',
    serviceStatus: 'serviceStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NodeScalarFieldEnum = (typeof NodeScalarFieldEnum)[keyof typeof NodeScalarFieldEnum]


  export const VpnUserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    nodeId: 'nodeId',
    status: 'status',
    expirationDate: 'expirationDate',
    revocationDate: 'revocationDate',
    serialNumber: 'serialNumber',
    isActive: 'isActive',
    lastConnected: 'lastConnected',
    ovpnFileContent: 'ovpnFileContent',
    lastSeen: 'lastSeen',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VpnUserScalarFieldEnum = (typeof VpnUserScalarFieldEnum)[keyof typeof VpnUserScalarFieldEnum]


  export const ActionLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    status: 'status',
    message: 'message',
    nodeId: 'nodeId',
    vpnUserId: 'vpnUserId',
    details: 'details',
    ovpnFileContent: 'ovpnFileContent',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    executedAt: 'executedAt'
  };

  export type ActionLogScalarFieldEnum = (typeof ActionLogScalarFieldEnum)[keyof typeof ActionLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'NodeStatus'
   */
  export type EnumNodeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NodeStatus'>
    


  /**
   * Reference to a field of type 'NodeStatus[]'
   */
  export type ListEnumNodeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NodeStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'VpnCertificateStatus'
   */
  export type EnumVpnCertificateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VpnCertificateStatus'>
    


  /**
   * Reference to a field of type 'VpnCertificateStatus[]'
   */
  export type ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VpnCertificateStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ActionType'
   */
  export type EnumActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionType'>
    


  /**
   * Reference to a field of type 'ActionType[]'
   */
  export type ListEnumActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionType[]'>
    


  /**
   * Reference to a field of type 'ActionStatus'
   */
  export type EnumActionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionStatus'>
    


  /**
   * Reference to a field of type 'ActionStatus[]'
   */
  export type ListEnumActionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type NodeWhereInput = {
    AND?: NodeWhereInput | NodeWhereInput[]
    OR?: NodeWhereInput[]
    NOT?: NodeWhereInput | NodeWhereInput[]
    id?: StringFilter<"Node"> | string
    name?: StringFilter<"Node"> | string
    ip?: StringFilter<"Node"> | string
    token?: StringFilter<"Node"> | string
    lastSeen?: DateTimeNullableFilter<"Node"> | Date | string | null
    location?: StringNullableFilter<"Node"> | string | null
    status?: EnumNodeStatusFilter<"Node"> | $Enums.NodeStatus
    cpuUsage?: FloatFilter<"Node"> | number
    ramUsage?: FloatFilter<"Node"> | number
    serviceStatus?: StringFilter<"Node"> | string
    createdAt?: DateTimeFilter<"Node"> | Date | string
    updatedAt?: DateTimeFilter<"Node"> | Date | string
    vpnUsers?: VpnUserListRelationFilter
    actionLogs?: ActionLogListRelationFilter
  }

  export type NodeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    token?: SortOrder
    lastSeen?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    status?: SortOrder
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
    serviceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vpnUsers?: VpnUserOrderByRelationAggregateInput
    actionLogs?: ActionLogOrderByRelationAggregateInput
  }

  export type NodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    token?: string
    AND?: NodeWhereInput | NodeWhereInput[]
    OR?: NodeWhereInput[]
    NOT?: NodeWhereInput | NodeWhereInput[]
    ip?: StringFilter<"Node"> | string
    lastSeen?: DateTimeNullableFilter<"Node"> | Date | string | null
    location?: StringNullableFilter<"Node"> | string | null
    status?: EnumNodeStatusFilter<"Node"> | $Enums.NodeStatus
    cpuUsage?: FloatFilter<"Node"> | number
    ramUsage?: FloatFilter<"Node"> | number
    serviceStatus?: StringFilter<"Node"> | string
    createdAt?: DateTimeFilter<"Node"> | Date | string
    updatedAt?: DateTimeFilter<"Node"> | Date | string
    vpnUsers?: VpnUserListRelationFilter
    actionLogs?: ActionLogListRelationFilter
  }, "id" | "name" | "token">

  export type NodeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    token?: SortOrder
    lastSeen?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    status?: SortOrder
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
    serviceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NodeCountOrderByAggregateInput
    _avg?: NodeAvgOrderByAggregateInput
    _max?: NodeMaxOrderByAggregateInput
    _min?: NodeMinOrderByAggregateInput
    _sum?: NodeSumOrderByAggregateInput
  }

  export type NodeScalarWhereWithAggregatesInput = {
    AND?: NodeScalarWhereWithAggregatesInput | NodeScalarWhereWithAggregatesInput[]
    OR?: NodeScalarWhereWithAggregatesInput[]
    NOT?: NodeScalarWhereWithAggregatesInput | NodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Node"> | string
    name?: StringWithAggregatesFilter<"Node"> | string
    ip?: StringWithAggregatesFilter<"Node"> | string
    token?: StringWithAggregatesFilter<"Node"> | string
    lastSeen?: DateTimeNullableWithAggregatesFilter<"Node"> | Date | string | null
    location?: StringNullableWithAggregatesFilter<"Node"> | string | null
    status?: EnumNodeStatusWithAggregatesFilter<"Node"> | $Enums.NodeStatus
    cpuUsage?: FloatWithAggregatesFilter<"Node"> | number
    ramUsage?: FloatWithAggregatesFilter<"Node"> | number
    serviceStatus?: StringWithAggregatesFilter<"Node"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Node"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Node"> | Date | string
  }

  export type VpnUserWhereInput = {
    AND?: VpnUserWhereInput | VpnUserWhereInput[]
    OR?: VpnUserWhereInput[]
    NOT?: VpnUserWhereInput | VpnUserWhereInput[]
    id?: StringFilter<"VpnUser"> | string
    username?: StringFilter<"VpnUser"> | string
    nodeId?: StringFilter<"VpnUser"> | string
    status?: EnumVpnCertificateStatusFilter<"VpnUser"> | $Enums.VpnCertificateStatus
    expirationDate?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    revocationDate?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    serialNumber?: StringNullableFilter<"VpnUser"> | string | null
    isActive?: BoolFilter<"VpnUser"> | boolean
    lastConnected?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    ovpnFileContent?: StringNullableFilter<"VpnUser"> | string | null
    lastSeen?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    createdAt?: DateTimeFilter<"VpnUser"> | Date | string
    updatedAt?: DateTimeFilter<"VpnUser"> | Date | string
    node?: XOR<NodeScalarRelationFilter, NodeWhereInput>
    actionLogs?: ActionLogListRelationFilter
  }

  export type VpnUserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    nodeId?: SortOrder
    status?: SortOrder
    expirationDate?: SortOrderInput | SortOrder
    revocationDate?: SortOrderInput | SortOrder
    serialNumber?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastConnected?: SortOrderInput | SortOrder
    ovpnFileContent?: SortOrderInput | SortOrder
    lastSeen?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    node?: NodeOrderByWithRelationInput
    actionLogs?: ActionLogOrderByRelationAggregateInput
  }

  export type VpnUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: VpnUserWhereInput | VpnUserWhereInput[]
    OR?: VpnUserWhereInput[]
    NOT?: VpnUserWhereInput | VpnUserWhereInput[]
    nodeId?: StringFilter<"VpnUser"> | string
    status?: EnumVpnCertificateStatusFilter<"VpnUser"> | $Enums.VpnCertificateStatus
    expirationDate?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    revocationDate?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    serialNumber?: StringNullableFilter<"VpnUser"> | string | null
    isActive?: BoolFilter<"VpnUser"> | boolean
    lastConnected?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    ovpnFileContent?: StringNullableFilter<"VpnUser"> | string | null
    lastSeen?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    createdAt?: DateTimeFilter<"VpnUser"> | Date | string
    updatedAt?: DateTimeFilter<"VpnUser"> | Date | string
    node?: XOR<NodeScalarRelationFilter, NodeWhereInput>
    actionLogs?: ActionLogListRelationFilter
  }, "id" | "username">

  export type VpnUserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    nodeId?: SortOrder
    status?: SortOrder
    expirationDate?: SortOrderInput | SortOrder
    revocationDate?: SortOrderInput | SortOrder
    serialNumber?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastConnected?: SortOrderInput | SortOrder
    ovpnFileContent?: SortOrderInput | SortOrder
    lastSeen?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VpnUserCountOrderByAggregateInput
    _max?: VpnUserMaxOrderByAggregateInput
    _min?: VpnUserMinOrderByAggregateInput
  }

  export type VpnUserScalarWhereWithAggregatesInput = {
    AND?: VpnUserScalarWhereWithAggregatesInput | VpnUserScalarWhereWithAggregatesInput[]
    OR?: VpnUserScalarWhereWithAggregatesInput[]
    NOT?: VpnUserScalarWhereWithAggregatesInput | VpnUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VpnUser"> | string
    username?: StringWithAggregatesFilter<"VpnUser"> | string
    nodeId?: StringWithAggregatesFilter<"VpnUser"> | string
    status?: EnumVpnCertificateStatusWithAggregatesFilter<"VpnUser"> | $Enums.VpnCertificateStatus
    expirationDate?: DateTimeNullableWithAggregatesFilter<"VpnUser"> | Date | string | null
    revocationDate?: DateTimeNullableWithAggregatesFilter<"VpnUser"> | Date | string | null
    serialNumber?: StringNullableWithAggregatesFilter<"VpnUser"> | string | null
    isActive?: BoolWithAggregatesFilter<"VpnUser"> | boolean
    lastConnected?: DateTimeNullableWithAggregatesFilter<"VpnUser"> | Date | string | null
    ovpnFileContent?: StringNullableWithAggregatesFilter<"VpnUser"> | string | null
    lastSeen?: DateTimeNullableWithAggregatesFilter<"VpnUser"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VpnUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VpnUser"> | Date | string
  }

  export type ActionLogWhereInput = {
    AND?: ActionLogWhereInput | ActionLogWhereInput[]
    OR?: ActionLogWhereInput[]
    NOT?: ActionLogWhereInput | ActionLogWhereInput[]
    id?: StringFilter<"ActionLog"> | string
    action?: EnumActionTypeFilter<"ActionLog"> | $Enums.ActionType
    status?: EnumActionStatusFilter<"ActionLog"> | $Enums.ActionStatus
    message?: StringNullableFilter<"ActionLog"> | string | null
    nodeId?: StringFilter<"ActionLog"> | string
    vpnUserId?: StringNullableFilter<"ActionLog"> | string | null
    details?: StringNullableFilter<"ActionLog"> | string | null
    ovpnFileContent?: StringNullableFilter<"ActionLog"> | string | null
    createdAt?: DateTimeFilter<"ActionLog"> | Date | string
    updatedAt?: DateTimeFilter<"ActionLog"> | Date | string
    executedAt?: DateTimeNullableFilter<"ActionLog"> | Date | string | null
    node?: XOR<NodeScalarRelationFilter, NodeWhereInput>
    vpnUser?: XOR<VpnUserNullableScalarRelationFilter, VpnUserWhereInput> | null
  }

  export type ActionLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    nodeId?: SortOrder
    vpnUserId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ovpnFileContent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    executedAt?: SortOrderInput | SortOrder
    node?: NodeOrderByWithRelationInput
    vpnUser?: VpnUserOrderByWithRelationInput
  }

  export type ActionLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActionLogWhereInput | ActionLogWhereInput[]
    OR?: ActionLogWhereInput[]
    NOT?: ActionLogWhereInput | ActionLogWhereInput[]
    action?: EnumActionTypeFilter<"ActionLog"> | $Enums.ActionType
    status?: EnumActionStatusFilter<"ActionLog"> | $Enums.ActionStatus
    message?: StringNullableFilter<"ActionLog"> | string | null
    nodeId?: StringFilter<"ActionLog"> | string
    vpnUserId?: StringNullableFilter<"ActionLog"> | string | null
    details?: StringNullableFilter<"ActionLog"> | string | null
    ovpnFileContent?: StringNullableFilter<"ActionLog"> | string | null
    createdAt?: DateTimeFilter<"ActionLog"> | Date | string
    updatedAt?: DateTimeFilter<"ActionLog"> | Date | string
    executedAt?: DateTimeNullableFilter<"ActionLog"> | Date | string | null
    node?: XOR<NodeScalarRelationFilter, NodeWhereInput>
    vpnUser?: XOR<VpnUserNullableScalarRelationFilter, VpnUserWhereInput> | null
  }, "id">

  export type ActionLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    nodeId?: SortOrder
    vpnUserId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ovpnFileContent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    executedAt?: SortOrderInput | SortOrder
    _count?: ActionLogCountOrderByAggregateInput
    _max?: ActionLogMaxOrderByAggregateInput
    _min?: ActionLogMinOrderByAggregateInput
  }

  export type ActionLogScalarWhereWithAggregatesInput = {
    AND?: ActionLogScalarWhereWithAggregatesInput | ActionLogScalarWhereWithAggregatesInput[]
    OR?: ActionLogScalarWhereWithAggregatesInput[]
    NOT?: ActionLogScalarWhereWithAggregatesInput | ActionLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActionLog"> | string
    action?: EnumActionTypeWithAggregatesFilter<"ActionLog"> | $Enums.ActionType
    status?: EnumActionStatusWithAggregatesFilter<"ActionLog"> | $Enums.ActionStatus
    message?: StringNullableWithAggregatesFilter<"ActionLog"> | string | null
    nodeId?: StringWithAggregatesFilter<"ActionLog"> | string
    vpnUserId?: StringNullableWithAggregatesFilter<"ActionLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"ActionLog"> | string | null
    ovpnFileContent?: StringNullableWithAggregatesFilter<"ActionLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ActionLog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ActionLog"> | Date | string
    executedAt?: DateTimeNullableWithAggregatesFilter<"ActionLog"> | Date | string | null
  }

  export type NodeCreateInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vpnUsers?: VpnUserCreateNestedManyWithoutNodeInput
    actionLogs?: ActionLogCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vpnUsers?: VpnUserUncheckedCreateNestedManyWithoutNodeInput
    actionLogs?: ActionLogUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vpnUsers?: VpnUserUpdateManyWithoutNodeNestedInput
    actionLogs?: ActionLogUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vpnUsers?: VpnUserUncheckedUpdateManyWithoutNodeNestedInput
    actionLogs?: ActionLogUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type NodeCreateManyInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VpnUserCreateInput = {
    id?: string
    username: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    node: NodeCreateNestedOneWithoutVpnUsersInput
    actionLogs?: ActionLogCreateNestedManyWithoutVpnUserInput
  }

  export type VpnUserUncheckedCreateInput = {
    id?: string
    username: string
    nodeId: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actionLogs?: ActionLogUncheckedCreateNestedManyWithoutVpnUserInput
  }

  export type VpnUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    node?: NodeUpdateOneRequiredWithoutVpnUsersNestedInput
    actionLogs?: ActionLogUpdateManyWithoutVpnUserNestedInput
  }

  export type VpnUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actionLogs?: ActionLogUncheckedUpdateManyWithoutVpnUserNestedInput
  }

  export type VpnUserCreateManyInput = {
    id?: string
    username: string
    nodeId: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VpnUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VpnUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionLogCreateInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
    node: NodeCreateNestedOneWithoutActionLogsInput
    vpnUser?: VpnUserCreateNestedOneWithoutActionLogsInput
  }

  export type ActionLogUncheckedCreateInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    nodeId: string
    vpnUserId?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
  }

  export type ActionLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    node?: NodeUpdateOneRequiredWithoutActionLogsNestedInput
    vpnUser?: VpnUserUpdateOneWithoutActionLogsNestedInput
  }

  export type ActionLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: StringFieldUpdateOperationsInput | string
    vpnUserId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ActionLogCreateManyInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    nodeId: string
    vpnUserId?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
  }

  export type ActionLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ActionLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: StringFieldUpdateOperationsInput | string
    vpnUserId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumNodeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeStatus | EnumNodeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeStatusFilter<$PrismaModel> | $Enums.NodeStatus
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type VpnUserListRelationFilter = {
    every?: VpnUserWhereInput
    some?: VpnUserWhereInput
    none?: VpnUserWhereInput
  }

  export type ActionLogListRelationFilter = {
    every?: ActionLogWhereInput
    some?: ActionLogWhereInput
    none?: ActionLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type VpnUserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActionLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NodeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    token?: SortOrder
    lastSeen?: SortOrder
    location?: SortOrder
    status?: SortOrder
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
    serviceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NodeAvgOrderByAggregateInput = {
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
  }

  export type NodeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    token?: SortOrder
    lastSeen?: SortOrder
    location?: SortOrder
    status?: SortOrder
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
    serviceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NodeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ip?: SortOrder
    token?: SortOrder
    lastSeen?: SortOrder
    location?: SortOrder
    status?: SortOrder
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
    serviceStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NodeSumOrderByAggregateInput = {
    cpuUsage?: SortOrder
    ramUsage?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumNodeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeStatus | EnumNodeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeStatusWithAggregatesFilter<$PrismaModel> | $Enums.NodeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNodeStatusFilter<$PrismaModel>
    _max?: NestedEnumNodeStatusFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumVpnCertificateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VpnCertificateStatus | EnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVpnCertificateStatusFilter<$PrismaModel> | $Enums.VpnCertificateStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NodeScalarRelationFilter = {
    is?: NodeWhereInput
    isNot?: NodeWhereInput
  }

  export type VpnUserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    nodeId?: SortOrder
    status?: SortOrder
    expirationDate?: SortOrder
    revocationDate?: SortOrder
    serialNumber?: SortOrder
    isActive?: SortOrder
    lastConnected?: SortOrder
    ovpnFileContent?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VpnUserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    nodeId?: SortOrder
    status?: SortOrder
    expirationDate?: SortOrder
    revocationDate?: SortOrder
    serialNumber?: SortOrder
    isActive?: SortOrder
    lastConnected?: SortOrder
    ovpnFileContent?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VpnUserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    nodeId?: SortOrder
    status?: SortOrder
    expirationDate?: SortOrder
    revocationDate?: SortOrder
    serialNumber?: SortOrder
    isActive?: SortOrder
    lastConnected?: SortOrder
    ovpnFileContent?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumVpnCertificateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VpnCertificateStatus | EnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVpnCertificateStatusWithAggregatesFilter<$PrismaModel> | $Enums.VpnCertificateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVpnCertificateStatusFilter<$PrismaModel>
    _max?: NestedEnumVpnCertificateStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeFilter<$PrismaModel> | $Enums.ActionType
  }

  export type EnumActionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusFilter<$PrismaModel> | $Enums.ActionStatus
  }

  export type VpnUserNullableScalarRelationFilter = {
    is?: VpnUserWhereInput | null
    isNot?: VpnUserWhereInput | null
  }

  export type ActionLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    status?: SortOrder
    message?: SortOrder
    nodeId?: SortOrder
    vpnUserId?: SortOrder
    details?: SortOrder
    ovpnFileContent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    executedAt?: SortOrder
  }

  export type ActionLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    status?: SortOrder
    message?: SortOrder
    nodeId?: SortOrder
    vpnUserId?: SortOrder
    details?: SortOrder
    ovpnFileContent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    executedAt?: SortOrder
  }

  export type ActionLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    status?: SortOrder
    message?: SortOrder
    nodeId?: SortOrder
    vpnUserId?: SortOrder
    details?: SortOrder
    ovpnFileContent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    executedAt?: SortOrder
  }

  export type EnumActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionTypeFilter<$PrismaModel>
    _max?: NestedEnumActionTypeFilter<$PrismaModel>
  }

  export type EnumActionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ActionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionStatusFilter<$PrismaModel>
    _max?: NestedEnumActionStatusFilter<$PrismaModel>
  }

  export type VpnUserCreateNestedManyWithoutNodeInput = {
    create?: XOR<VpnUserCreateWithoutNodeInput, VpnUserUncheckedCreateWithoutNodeInput> | VpnUserCreateWithoutNodeInput[] | VpnUserUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: VpnUserCreateOrConnectWithoutNodeInput | VpnUserCreateOrConnectWithoutNodeInput[]
    createMany?: VpnUserCreateManyNodeInputEnvelope
    connect?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
  }

  export type ActionLogCreateNestedManyWithoutNodeInput = {
    create?: XOR<ActionLogCreateWithoutNodeInput, ActionLogUncheckedCreateWithoutNodeInput> | ActionLogCreateWithoutNodeInput[] | ActionLogUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutNodeInput | ActionLogCreateOrConnectWithoutNodeInput[]
    createMany?: ActionLogCreateManyNodeInputEnvelope
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
  }

  export type VpnUserUncheckedCreateNestedManyWithoutNodeInput = {
    create?: XOR<VpnUserCreateWithoutNodeInput, VpnUserUncheckedCreateWithoutNodeInput> | VpnUserCreateWithoutNodeInput[] | VpnUserUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: VpnUserCreateOrConnectWithoutNodeInput | VpnUserCreateOrConnectWithoutNodeInput[]
    createMany?: VpnUserCreateManyNodeInputEnvelope
    connect?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
  }

  export type ActionLogUncheckedCreateNestedManyWithoutNodeInput = {
    create?: XOR<ActionLogCreateWithoutNodeInput, ActionLogUncheckedCreateWithoutNodeInput> | ActionLogCreateWithoutNodeInput[] | ActionLogUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutNodeInput | ActionLogCreateOrConnectWithoutNodeInput[]
    createMany?: ActionLogCreateManyNodeInputEnvelope
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumNodeStatusFieldUpdateOperationsInput = {
    set?: $Enums.NodeStatus
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VpnUserUpdateManyWithoutNodeNestedInput = {
    create?: XOR<VpnUserCreateWithoutNodeInput, VpnUserUncheckedCreateWithoutNodeInput> | VpnUserCreateWithoutNodeInput[] | VpnUserUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: VpnUserCreateOrConnectWithoutNodeInput | VpnUserCreateOrConnectWithoutNodeInput[]
    upsert?: VpnUserUpsertWithWhereUniqueWithoutNodeInput | VpnUserUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: VpnUserCreateManyNodeInputEnvelope
    set?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    disconnect?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    delete?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    connect?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    update?: VpnUserUpdateWithWhereUniqueWithoutNodeInput | VpnUserUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: VpnUserUpdateManyWithWhereWithoutNodeInput | VpnUserUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: VpnUserScalarWhereInput | VpnUserScalarWhereInput[]
  }

  export type ActionLogUpdateManyWithoutNodeNestedInput = {
    create?: XOR<ActionLogCreateWithoutNodeInput, ActionLogUncheckedCreateWithoutNodeInput> | ActionLogCreateWithoutNodeInput[] | ActionLogUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutNodeInput | ActionLogCreateOrConnectWithoutNodeInput[]
    upsert?: ActionLogUpsertWithWhereUniqueWithoutNodeInput | ActionLogUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: ActionLogCreateManyNodeInputEnvelope
    set?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    disconnect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    delete?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    update?: ActionLogUpdateWithWhereUniqueWithoutNodeInput | ActionLogUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: ActionLogUpdateManyWithWhereWithoutNodeInput | ActionLogUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: ActionLogScalarWhereInput | ActionLogScalarWhereInput[]
  }

  export type VpnUserUncheckedUpdateManyWithoutNodeNestedInput = {
    create?: XOR<VpnUserCreateWithoutNodeInput, VpnUserUncheckedCreateWithoutNodeInput> | VpnUserCreateWithoutNodeInput[] | VpnUserUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: VpnUserCreateOrConnectWithoutNodeInput | VpnUserCreateOrConnectWithoutNodeInput[]
    upsert?: VpnUserUpsertWithWhereUniqueWithoutNodeInput | VpnUserUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: VpnUserCreateManyNodeInputEnvelope
    set?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    disconnect?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    delete?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    connect?: VpnUserWhereUniqueInput | VpnUserWhereUniqueInput[]
    update?: VpnUserUpdateWithWhereUniqueWithoutNodeInput | VpnUserUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: VpnUserUpdateManyWithWhereWithoutNodeInput | VpnUserUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: VpnUserScalarWhereInput | VpnUserScalarWhereInput[]
  }

  export type ActionLogUncheckedUpdateManyWithoutNodeNestedInput = {
    create?: XOR<ActionLogCreateWithoutNodeInput, ActionLogUncheckedCreateWithoutNodeInput> | ActionLogCreateWithoutNodeInput[] | ActionLogUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutNodeInput | ActionLogCreateOrConnectWithoutNodeInput[]
    upsert?: ActionLogUpsertWithWhereUniqueWithoutNodeInput | ActionLogUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: ActionLogCreateManyNodeInputEnvelope
    set?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    disconnect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    delete?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    update?: ActionLogUpdateWithWhereUniqueWithoutNodeInput | ActionLogUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: ActionLogUpdateManyWithWhereWithoutNodeInput | ActionLogUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: ActionLogScalarWhereInput | ActionLogScalarWhereInput[]
  }

  export type NodeCreateNestedOneWithoutVpnUsersInput = {
    create?: XOR<NodeCreateWithoutVpnUsersInput, NodeUncheckedCreateWithoutVpnUsersInput>
    connectOrCreate?: NodeCreateOrConnectWithoutVpnUsersInput
    connect?: NodeWhereUniqueInput
  }

  export type ActionLogCreateNestedManyWithoutVpnUserInput = {
    create?: XOR<ActionLogCreateWithoutVpnUserInput, ActionLogUncheckedCreateWithoutVpnUserInput> | ActionLogCreateWithoutVpnUserInput[] | ActionLogUncheckedCreateWithoutVpnUserInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutVpnUserInput | ActionLogCreateOrConnectWithoutVpnUserInput[]
    createMany?: ActionLogCreateManyVpnUserInputEnvelope
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
  }

  export type ActionLogUncheckedCreateNestedManyWithoutVpnUserInput = {
    create?: XOR<ActionLogCreateWithoutVpnUserInput, ActionLogUncheckedCreateWithoutVpnUserInput> | ActionLogCreateWithoutVpnUserInput[] | ActionLogUncheckedCreateWithoutVpnUserInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutVpnUserInput | ActionLogCreateOrConnectWithoutVpnUserInput[]
    createMany?: ActionLogCreateManyVpnUserInputEnvelope
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
  }

  export type EnumVpnCertificateStatusFieldUpdateOperationsInput = {
    set?: $Enums.VpnCertificateStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NodeUpdateOneRequiredWithoutVpnUsersNestedInput = {
    create?: XOR<NodeCreateWithoutVpnUsersInput, NodeUncheckedCreateWithoutVpnUsersInput>
    connectOrCreate?: NodeCreateOrConnectWithoutVpnUsersInput
    upsert?: NodeUpsertWithoutVpnUsersInput
    connect?: NodeWhereUniqueInput
    update?: XOR<XOR<NodeUpdateToOneWithWhereWithoutVpnUsersInput, NodeUpdateWithoutVpnUsersInput>, NodeUncheckedUpdateWithoutVpnUsersInput>
  }

  export type ActionLogUpdateManyWithoutVpnUserNestedInput = {
    create?: XOR<ActionLogCreateWithoutVpnUserInput, ActionLogUncheckedCreateWithoutVpnUserInput> | ActionLogCreateWithoutVpnUserInput[] | ActionLogUncheckedCreateWithoutVpnUserInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutVpnUserInput | ActionLogCreateOrConnectWithoutVpnUserInput[]
    upsert?: ActionLogUpsertWithWhereUniqueWithoutVpnUserInput | ActionLogUpsertWithWhereUniqueWithoutVpnUserInput[]
    createMany?: ActionLogCreateManyVpnUserInputEnvelope
    set?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    disconnect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    delete?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    update?: ActionLogUpdateWithWhereUniqueWithoutVpnUserInput | ActionLogUpdateWithWhereUniqueWithoutVpnUserInput[]
    updateMany?: ActionLogUpdateManyWithWhereWithoutVpnUserInput | ActionLogUpdateManyWithWhereWithoutVpnUserInput[]
    deleteMany?: ActionLogScalarWhereInput | ActionLogScalarWhereInput[]
  }

  export type ActionLogUncheckedUpdateManyWithoutVpnUserNestedInput = {
    create?: XOR<ActionLogCreateWithoutVpnUserInput, ActionLogUncheckedCreateWithoutVpnUserInput> | ActionLogCreateWithoutVpnUserInput[] | ActionLogUncheckedCreateWithoutVpnUserInput[]
    connectOrCreate?: ActionLogCreateOrConnectWithoutVpnUserInput | ActionLogCreateOrConnectWithoutVpnUserInput[]
    upsert?: ActionLogUpsertWithWhereUniqueWithoutVpnUserInput | ActionLogUpsertWithWhereUniqueWithoutVpnUserInput[]
    createMany?: ActionLogCreateManyVpnUserInputEnvelope
    set?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    disconnect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    delete?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    connect?: ActionLogWhereUniqueInput | ActionLogWhereUniqueInput[]
    update?: ActionLogUpdateWithWhereUniqueWithoutVpnUserInput | ActionLogUpdateWithWhereUniqueWithoutVpnUserInput[]
    updateMany?: ActionLogUpdateManyWithWhereWithoutVpnUserInput | ActionLogUpdateManyWithWhereWithoutVpnUserInput[]
    deleteMany?: ActionLogScalarWhereInput | ActionLogScalarWhereInput[]
  }

  export type NodeCreateNestedOneWithoutActionLogsInput = {
    create?: XOR<NodeCreateWithoutActionLogsInput, NodeUncheckedCreateWithoutActionLogsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutActionLogsInput
    connect?: NodeWhereUniqueInput
  }

  export type VpnUserCreateNestedOneWithoutActionLogsInput = {
    create?: XOR<VpnUserCreateWithoutActionLogsInput, VpnUserUncheckedCreateWithoutActionLogsInput>
    connectOrCreate?: VpnUserCreateOrConnectWithoutActionLogsInput
    connect?: VpnUserWhereUniqueInput
  }

  export type EnumActionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ActionType
  }

  export type EnumActionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ActionStatus
  }

  export type NodeUpdateOneRequiredWithoutActionLogsNestedInput = {
    create?: XOR<NodeCreateWithoutActionLogsInput, NodeUncheckedCreateWithoutActionLogsInput>
    connectOrCreate?: NodeCreateOrConnectWithoutActionLogsInput
    upsert?: NodeUpsertWithoutActionLogsInput
    connect?: NodeWhereUniqueInput
    update?: XOR<XOR<NodeUpdateToOneWithWhereWithoutActionLogsInput, NodeUpdateWithoutActionLogsInput>, NodeUncheckedUpdateWithoutActionLogsInput>
  }

  export type VpnUserUpdateOneWithoutActionLogsNestedInput = {
    create?: XOR<VpnUserCreateWithoutActionLogsInput, VpnUserUncheckedCreateWithoutActionLogsInput>
    connectOrCreate?: VpnUserCreateOrConnectWithoutActionLogsInput
    upsert?: VpnUserUpsertWithoutActionLogsInput
    disconnect?: VpnUserWhereInput | boolean
    delete?: VpnUserWhereInput | boolean
    connect?: VpnUserWhereUniqueInput
    update?: XOR<XOR<VpnUserUpdateToOneWithWhereWithoutActionLogsInput, VpnUserUpdateWithoutActionLogsInput>, VpnUserUncheckedUpdateWithoutActionLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumNodeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeStatus | EnumNodeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeStatusFilter<$PrismaModel> | $Enums.NodeStatus
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumNodeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeStatus | EnumNodeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeStatus[] | ListEnumNodeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeStatusWithAggregatesFilter<$PrismaModel> | $Enums.NodeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNodeStatusFilter<$PrismaModel>
    _max?: NestedEnumNodeStatusFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumVpnCertificateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VpnCertificateStatus | EnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVpnCertificateStatusFilter<$PrismaModel> | $Enums.VpnCertificateStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumVpnCertificateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VpnCertificateStatus | EnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VpnCertificateStatus[] | ListEnumVpnCertificateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVpnCertificateStatusWithAggregatesFilter<$PrismaModel> | $Enums.VpnCertificateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVpnCertificateStatusFilter<$PrismaModel>
    _max?: NestedEnumVpnCertificateStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeFilter<$PrismaModel> | $Enums.ActionType
  }

  export type NestedEnumActionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusFilter<$PrismaModel> | $Enums.ActionStatus
  }

  export type NestedEnumActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionTypeFilter<$PrismaModel>
    _max?: NestedEnumActionTypeFilter<$PrismaModel>
  }

  export type NestedEnumActionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ActionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionStatusFilter<$PrismaModel>
    _max?: NestedEnumActionStatusFilter<$PrismaModel>
  }

  export type VpnUserCreateWithoutNodeInput = {
    id?: string
    username: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actionLogs?: ActionLogCreateNestedManyWithoutVpnUserInput
  }

  export type VpnUserUncheckedCreateWithoutNodeInput = {
    id?: string
    username: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actionLogs?: ActionLogUncheckedCreateNestedManyWithoutVpnUserInput
  }

  export type VpnUserCreateOrConnectWithoutNodeInput = {
    where: VpnUserWhereUniqueInput
    create: XOR<VpnUserCreateWithoutNodeInput, VpnUserUncheckedCreateWithoutNodeInput>
  }

  export type VpnUserCreateManyNodeInputEnvelope = {
    data: VpnUserCreateManyNodeInput | VpnUserCreateManyNodeInput[]
    skipDuplicates?: boolean
  }

  export type ActionLogCreateWithoutNodeInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
    vpnUser?: VpnUserCreateNestedOneWithoutActionLogsInput
  }

  export type ActionLogUncheckedCreateWithoutNodeInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    vpnUserId?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
  }

  export type ActionLogCreateOrConnectWithoutNodeInput = {
    where: ActionLogWhereUniqueInput
    create: XOR<ActionLogCreateWithoutNodeInput, ActionLogUncheckedCreateWithoutNodeInput>
  }

  export type ActionLogCreateManyNodeInputEnvelope = {
    data: ActionLogCreateManyNodeInput | ActionLogCreateManyNodeInput[]
    skipDuplicates?: boolean
  }

  export type VpnUserUpsertWithWhereUniqueWithoutNodeInput = {
    where: VpnUserWhereUniqueInput
    update: XOR<VpnUserUpdateWithoutNodeInput, VpnUserUncheckedUpdateWithoutNodeInput>
    create: XOR<VpnUserCreateWithoutNodeInput, VpnUserUncheckedCreateWithoutNodeInput>
  }

  export type VpnUserUpdateWithWhereUniqueWithoutNodeInput = {
    where: VpnUserWhereUniqueInput
    data: XOR<VpnUserUpdateWithoutNodeInput, VpnUserUncheckedUpdateWithoutNodeInput>
  }

  export type VpnUserUpdateManyWithWhereWithoutNodeInput = {
    where: VpnUserScalarWhereInput
    data: XOR<VpnUserUpdateManyMutationInput, VpnUserUncheckedUpdateManyWithoutNodeInput>
  }

  export type VpnUserScalarWhereInput = {
    AND?: VpnUserScalarWhereInput | VpnUserScalarWhereInput[]
    OR?: VpnUserScalarWhereInput[]
    NOT?: VpnUserScalarWhereInput | VpnUserScalarWhereInput[]
    id?: StringFilter<"VpnUser"> | string
    username?: StringFilter<"VpnUser"> | string
    nodeId?: StringFilter<"VpnUser"> | string
    status?: EnumVpnCertificateStatusFilter<"VpnUser"> | $Enums.VpnCertificateStatus
    expirationDate?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    revocationDate?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    serialNumber?: StringNullableFilter<"VpnUser"> | string | null
    isActive?: BoolFilter<"VpnUser"> | boolean
    lastConnected?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    ovpnFileContent?: StringNullableFilter<"VpnUser"> | string | null
    lastSeen?: DateTimeNullableFilter<"VpnUser"> | Date | string | null
    createdAt?: DateTimeFilter<"VpnUser"> | Date | string
    updatedAt?: DateTimeFilter<"VpnUser"> | Date | string
  }

  export type ActionLogUpsertWithWhereUniqueWithoutNodeInput = {
    where: ActionLogWhereUniqueInput
    update: XOR<ActionLogUpdateWithoutNodeInput, ActionLogUncheckedUpdateWithoutNodeInput>
    create: XOR<ActionLogCreateWithoutNodeInput, ActionLogUncheckedCreateWithoutNodeInput>
  }

  export type ActionLogUpdateWithWhereUniqueWithoutNodeInput = {
    where: ActionLogWhereUniqueInput
    data: XOR<ActionLogUpdateWithoutNodeInput, ActionLogUncheckedUpdateWithoutNodeInput>
  }

  export type ActionLogUpdateManyWithWhereWithoutNodeInput = {
    where: ActionLogScalarWhereInput
    data: XOR<ActionLogUpdateManyMutationInput, ActionLogUncheckedUpdateManyWithoutNodeInput>
  }

  export type ActionLogScalarWhereInput = {
    AND?: ActionLogScalarWhereInput | ActionLogScalarWhereInput[]
    OR?: ActionLogScalarWhereInput[]
    NOT?: ActionLogScalarWhereInput | ActionLogScalarWhereInput[]
    id?: StringFilter<"ActionLog"> | string
    action?: EnumActionTypeFilter<"ActionLog"> | $Enums.ActionType
    status?: EnumActionStatusFilter<"ActionLog"> | $Enums.ActionStatus
    message?: StringNullableFilter<"ActionLog"> | string | null
    nodeId?: StringFilter<"ActionLog"> | string
    vpnUserId?: StringNullableFilter<"ActionLog"> | string | null
    details?: StringNullableFilter<"ActionLog"> | string | null
    ovpnFileContent?: StringNullableFilter<"ActionLog"> | string | null
    createdAt?: DateTimeFilter<"ActionLog"> | Date | string
    updatedAt?: DateTimeFilter<"ActionLog"> | Date | string
    executedAt?: DateTimeNullableFilter<"ActionLog"> | Date | string | null
  }

  export type NodeCreateWithoutVpnUsersInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    actionLogs?: ActionLogCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateWithoutVpnUsersInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    actionLogs?: ActionLogUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeCreateOrConnectWithoutVpnUsersInput = {
    where: NodeWhereUniqueInput
    create: XOR<NodeCreateWithoutVpnUsersInput, NodeUncheckedCreateWithoutVpnUsersInput>
  }

  export type ActionLogCreateWithoutVpnUserInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
    node: NodeCreateNestedOneWithoutActionLogsInput
  }

  export type ActionLogUncheckedCreateWithoutVpnUserInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    nodeId: string
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
  }

  export type ActionLogCreateOrConnectWithoutVpnUserInput = {
    where: ActionLogWhereUniqueInput
    create: XOR<ActionLogCreateWithoutVpnUserInput, ActionLogUncheckedCreateWithoutVpnUserInput>
  }

  export type ActionLogCreateManyVpnUserInputEnvelope = {
    data: ActionLogCreateManyVpnUserInput | ActionLogCreateManyVpnUserInput[]
    skipDuplicates?: boolean
  }

  export type NodeUpsertWithoutVpnUsersInput = {
    update: XOR<NodeUpdateWithoutVpnUsersInput, NodeUncheckedUpdateWithoutVpnUsersInput>
    create: XOR<NodeCreateWithoutVpnUsersInput, NodeUncheckedCreateWithoutVpnUsersInput>
    where?: NodeWhereInput
  }

  export type NodeUpdateToOneWithWhereWithoutVpnUsersInput = {
    where?: NodeWhereInput
    data: XOR<NodeUpdateWithoutVpnUsersInput, NodeUncheckedUpdateWithoutVpnUsersInput>
  }

  export type NodeUpdateWithoutVpnUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actionLogs?: ActionLogUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateWithoutVpnUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actionLogs?: ActionLogUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type ActionLogUpsertWithWhereUniqueWithoutVpnUserInput = {
    where: ActionLogWhereUniqueInput
    update: XOR<ActionLogUpdateWithoutVpnUserInput, ActionLogUncheckedUpdateWithoutVpnUserInput>
    create: XOR<ActionLogCreateWithoutVpnUserInput, ActionLogUncheckedCreateWithoutVpnUserInput>
  }

  export type ActionLogUpdateWithWhereUniqueWithoutVpnUserInput = {
    where: ActionLogWhereUniqueInput
    data: XOR<ActionLogUpdateWithoutVpnUserInput, ActionLogUncheckedUpdateWithoutVpnUserInput>
  }

  export type ActionLogUpdateManyWithWhereWithoutVpnUserInput = {
    where: ActionLogScalarWhereInput
    data: XOR<ActionLogUpdateManyMutationInput, ActionLogUncheckedUpdateManyWithoutVpnUserInput>
  }

  export type NodeCreateWithoutActionLogsInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vpnUsers?: VpnUserCreateNestedManyWithoutNodeInput
  }

  export type NodeUncheckedCreateWithoutActionLogsInput = {
    id?: string
    name: string
    ip: string
    token: string
    lastSeen?: Date | string | null
    location?: string | null
    status?: $Enums.NodeStatus
    cpuUsage?: number
    ramUsage?: number
    serviceStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vpnUsers?: VpnUserUncheckedCreateNestedManyWithoutNodeInput
  }

  export type NodeCreateOrConnectWithoutActionLogsInput = {
    where: NodeWhereUniqueInput
    create: XOR<NodeCreateWithoutActionLogsInput, NodeUncheckedCreateWithoutActionLogsInput>
  }

  export type VpnUserCreateWithoutActionLogsInput = {
    id?: string
    username: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    node: NodeCreateNestedOneWithoutVpnUsersInput
  }

  export type VpnUserUncheckedCreateWithoutActionLogsInput = {
    id?: string
    username: string
    nodeId: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VpnUserCreateOrConnectWithoutActionLogsInput = {
    where: VpnUserWhereUniqueInput
    create: XOR<VpnUserCreateWithoutActionLogsInput, VpnUserUncheckedCreateWithoutActionLogsInput>
  }

  export type NodeUpsertWithoutActionLogsInput = {
    update: XOR<NodeUpdateWithoutActionLogsInput, NodeUncheckedUpdateWithoutActionLogsInput>
    create: XOR<NodeCreateWithoutActionLogsInput, NodeUncheckedCreateWithoutActionLogsInput>
    where?: NodeWhereInput
  }

  export type NodeUpdateToOneWithWhereWithoutActionLogsInput = {
    where?: NodeWhereInput
    data: XOR<NodeUpdateWithoutActionLogsInput, NodeUncheckedUpdateWithoutActionLogsInput>
  }

  export type NodeUpdateWithoutActionLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vpnUsers?: VpnUserUpdateManyWithoutNodeNestedInput
  }

  export type NodeUncheckedUpdateWithoutActionLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNodeStatusFieldUpdateOperationsInput | $Enums.NodeStatus
    cpuUsage?: FloatFieldUpdateOperationsInput | number
    ramUsage?: FloatFieldUpdateOperationsInput | number
    serviceStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vpnUsers?: VpnUserUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type VpnUserUpsertWithoutActionLogsInput = {
    update: XOR<VpnUserUpdateWithoutActionLogsInput, VpnUserUncheckedUpdateWithoutActionLogsInput>
    create: XOR<VpnUserCreateWithoutActionLogsInput, VpnUserUncheckedCreateWithoutActionLogsInput>
    where?: VpnUserWhereInput
  }

  export type VpnUserUpdateToOneWithWhereWithoutActionLogsInput = {
    where?: VpnUserWhereInput
    data: XOR<VpnUserUpdateWithoutActionLogsInput, VpnUserUncheckedUpdateWithoutActionLogsInput>
  }

  export type VpnUserUpdateWithoutActionLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    node?: NodeUpdateOneRequiredWithoutVpnUsersNestedInput
  }

  export type VpnUserUncheckedUpdateWithoutActionLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VpnUserCreateManyNodeInput = {
    id?: string
    username: string
    status?: $Enums.VpnCertificateStatus
    expirationDate?: Date | string | null
    revocationDate?: Date | string | null
    serialNumber?: string | null
    isActive?: boolean
    lastConnected?: Date | string | null
    ovpnFileContent?: string | null
    lastSeen?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionLogCreateManyNodeInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    vpnUserId?: string | null
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
  }

  export type VpnUserUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actionLogs?: ActionLogUpdateManyWithoutVpnUserNestedInput
  }

  export type VpnUserUncheckedUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actionLogs?: ActionLogUncheckedUpdateManyWithoutVpnUserNestedInput
  }

  export type VpnUserUncheckedUpdateManyWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    status?: EnumVpnCertificateStatusFieldUpdateOperationsInput | $Enums.VpnCertificateStatus
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revocationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSeen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionLogUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vpnUser?: VpnUserUpdateOneWithoutActionLogsNestedInput
  }

  export type ActionLogUncheckedUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUserId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ActionLogUncheckedUpdateManyWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    vpnUserId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ActionLogCreateManyVpnUserInput = {
    id?: string
    action: $Enums.ActionType
    status?: $Enums.ActionStatus
    message?: string | null
    nodeId: string
    details?: string | null
    ovpnFileContent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executedAt?: Date | string | null
  }

  export type ActionLogUpdateWithoutVpnUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    node?: NodeUpdateOneRequiredWithoutActionLogsNestedInput
  }

  export type ActionLogUncheckedUpdateWithoutVpnUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ActionLogUncheckedUpdateManyWithoutVpnUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    nodeId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ovpnFileContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}