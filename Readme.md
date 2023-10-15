[//]: # (https://www.typescriptlang.org/play)

- [Как настроить TS в проекте](#how-set-ts)
- [private, protected](#private-protected)
- [Абстрактный класс (`abstract`)](#abstract-class)
- [Interfaces vs types](#interfaces-vs-types)
  - [Objects / Functions](#objects-functions)
  - [Other Types](#other-types)
  - [Extend](#extend) Расширение
  - [Interface extends interface](#interface-extends-interface)
  - [Type alias extends type alias](#type-alias-extends-type-alias)
  - [Interface extends type alias](#interface-extends-type-alias)
  - [Type alias extends interface](#type-alias-extends-interface)
  - [Implements](#implements)
  - [Declaration merging](#declaration-merging) Несколько объявлений подряд
  - [Получаем подмножество св-в из существующего `interface` (`extends`, `Pick`)](#get-subset-from-interface)
- [Ключевое слово `Record`](#record)
  - [`Record<key, type>`](#keys-type)
- [`unknown`](#unknown)
  - [общее с `any`](#common)
  - [разница с `any`](#different)
- [Манипуляции с типами](#type-manipulation)
  - [`keyof`, `K extends keyof T`, `typeof`](#keyof-extends-typeof)
  - [Служебные типы](#utility-types) `Partial` `Require` `Readonly` `Pick` `Omit` `Extract` `Exclude` `ReturnType`
- [keyword asserts is](#keyword-asserts-is)
  - [Тип Guard (ключ слово `is`)](#type-guard)
- [`as const` вместо `enum`](#as-const-instead-enum)
- [generic](#generic)
  - [default generic](#default-generic)
  - [generic в функции](#with-function)
  - [depends from parameters](#depends-from-parameters)
    - [parameters plus `interface`](#parameters-plus-interface)
    - [parameters plus `type`](#parameters-plus-type)
  - [`extends`](#extends)
- [Branded Type](#branded-type)
- [Типизация сторонних библиотек](#typing-third-party-libraries)
  - [Если types отсутствуют](#if-types-are-missing )
- [Преобразование типов в другие типы](#transformation-types)
  - [Как извлечь тип возвращаемый из функции (`ReturnType` и `typeof`, `Awaited`)](#how-do-we-extract-type-return-from-function)
    и если возвращается `Promise`
  - [Как извлечь тип из параметров функции (`Parameters` и `typeof`)](#how-do-we-extract-type-from-Parameters-function)
  - [Как извлечь ключи объекта в тип (`keyof`, `typeof` )](#get-object-keys)
  - [Получаем конкретный тип из union type (`Extract`)](#extract-from-discriminated-union)
  - [Извлекаем тип из свойства объекта](#extract-type-from-prop-object)
  - [Получаем значение св-ва объекта в тип (`as const`)](#as-const)
  - [Получаем ВСЕ значение св-в объекта в тип (`keyof`, `typeof`)](#get-object-values)
  - [Получаем значения массива в тип (`typeof`)](#get-array-values)
  - [Template literal syntax](#template-literal-syntax) Накладываем ограничение в типе на строку
    - [Извлекаем конкретные строки в тип из union, используя type Template literal strings (`Extract`)](#extract-from-union)
    - [Разбиваем строку в массив и используем как тип](#splitting-string)
    - [Создаем тип объекта из предоставленных ключей (`Record`)](template-literals-in-object-keys)
    - [Создаем тип объекта из предоставленных ключей в Uppercase (`Record`, `Uppercase`)](uppercase-object)
  - [Type helpers pattern](#type-helpers-pattern)
    - [Возвращаем переданный тип](#ReturnWhatIPassIn)
    - [Ограничиваем тип - модифицируем под себя](#constraints)
    - [Задаем значение по умолчанию](#default)
    - [НЕТ `undefined` `null`](#not-undefined-or-null-constraint)
    - [Не пустой массив](#non empty array)
  - [Условия для типов](conditional-type-and-infer)
    - [Условия для типов - пример](#сonditional-type)
    - [Условия для типов - возвращаем также `never`](#returning-never)
    - [Условия для типов - с применением `infer`](#condition-with-infer)
    - [Получаем конкретный тип из массива строк (`infer`) но основе `template literal value`](#extraction-string-from-array)
    - [Поучаем результат (часть) из `async` function(`infer`)](#get-result-from-async-function) Извлекаем часть
      ответа
    - [Distributive conditional types](#distributive-conditional-types)

- [namespace](#namespace)

## How set ts

instructions:

- `npm install typescript`
- `npx tsc --init`

Appears `tsconfig.json`

- `tsc index.ts`
  Appears  `index.js`

Setting common output:

- `tsconfig.json`:
- `"outDir": "./dist",`

Компилируем:

- `tsc` // from root directory

Компилируем и запускаем:

- `npm i ts-node -D`

Компилируем и запускаем: with watch:

- `"start": "nodemon  src/index.ts",`

- `Run time` - сгенерированный js
- `Compile time` - непосредственно ts

---

## private protected
```ts
class Vehicle {
  public make: string;
  private damages: string[];  // модиф-я доступна только внутри класса
  private _model: string;
  protected run: number;      // модиф-я доступна только внутри класса, а также внутри унасл-х классов
  #price: number;
}
```

## Abstract class

Абстрактный класс позволяют создать базу, на которую мы можем наслаивать дополнительный
функционал с конкретной реализацией.

- Абстрактный класс нельзя инстанциировать (создать экземпляр класса);
- `abstract` методы и св-ва в абстрактном классе говорят о том, что данные метод\св-ва следует реализовать;
- Абстрактные методы не могут быть использованы вне абстрактного класса;
- Но также мы можем в абстрактном классе реализовывать методы\св-ва, который унаследуются классом-потомком;

```ts
abstract class Contoller {
  abstract handle(req: any): void;  // abstract говорит о том, что данный метод следует реализовать

  handleWithLogs(req: any) {        // реализовали метод, кот унаследуется классом-потомком
    console.log('Start');
    this.handle(req);
    console.log('End');
  }
}

class UserController extends Contoller {
  handle(req: any): void {
    console.log(req);
  }
}

const c = new UserController();
c.handleWithLogs('Request');
```



## Interfaces vs types

### Objects Functions

Both can be used to describe the shape of an object or a function signature. But the syntax differs.

```ts
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

```ts
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

### Other Types

Unlike an interface, the type alias can also be used for other types such as primitives, unions, and tuples.

```ts
// primitive
type Name = string;

// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];
```

### Extend

Both can be extended, but again, the syntax differs.

Additionally, note that an interface and type alias are not mutually exclusive (не взаимно исключающие).
An interface can extend a type alias, and vice versa.

### Interface extends interface

```ts
interface PartialPointX {
  x: number;
}

interface Point extends PartialPointX {
  y: number;
}
```

### Type alias extends type alias

```ts
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };
```

### Interface extends type alias

```ts
type PartialPointX = { x: number; };

interface Point extends PartialPointX {
  y: number;
}
```

### Type alias extends interface

```ts
interface PartialPointX {
  x: number;
}

type Point = PartialPointX & { y: number; };
```

### Implements

A class can implement an interface or type alias, both in the same exact way.
Note however that a class and interface are considered static blueprints (считаются статическими схемами).
Therefore, they can not implement / extend a type alias that names a union type.

```ts
interface Point {
  x: number;
  y: number;
}

class SomePoint implements Point {
  x = 1;
  y = 2;
}

type Point2 = {
  x: number;
  y: number;
};

class SomePoint2 implements Point2 {
  x = 1;
  y = 2;
}

type PartialPoint = { x: number; } | { y: number; };

// FIXME: can not implement a union type
class SomePartialPoint implements PartialPoint {
  x = 1;
  y = 2;
}
```

### Declaration merging

Unlike a type alias, an interface can be defined multiple times,
and will be treated as a single interface (with members of all declarations being merged).

```ts
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point {
  x: number;
}

interface Point {
  y: number;
}

const point: Point = { x: 1, y: 2 };
```

### Get subset from interface

```ts
interface FullOfFields {
  x: number;
  y: number;
  z: () => void;
}

interface Ex extends Pick<FullOfFields, "x" | "y"> {
  foo: string // additional property
};
const x: Ex = {
  x: 12,
  y: 12,
  foo: "str"
}
```

## Record

```
const db: Record<string, User | Post> = {};
const result = db['121212'];
```

В `result`  должен быть `User | Post`

### Keys Type

Создает тип объекта, ключами свойств которого являются Keys, а значениями свойств — Type.
Эту утилиту можно использовать для сопоставления свойств одного типа с другим типом.

```ts
type CatName = Record<string, { age: string }>
const cat = {
  'boris': {
    age: 10
  }
}
```

## unknown

### common

```ts
let anyVar: any = 'Value';         // OK
anyVar = 3;                        // OK

let unknownVar: unknown = 'Value'; // OK
unknownVar = 3;                    // OK
```

### different

You can perform any operation on any, but you have to do a type check or type assertion to operate on unknown.

```ts
let anyVar: any = 'Value';
anyVar.length // OK


let unknownVar: unknown = 'Value';
unknownVar.length                       // NOT OK

  (unknownVar as string).length           // OK (with type assertion)
if (typeof unknownVar === 'string') {
  unknownVar.length;                  // OK (with type check)
}
```

## Type manipulation

### keyof extends typeof

- ```keyof``` - позволяют "вытащить" ключи из класса, интерфейса или обьекта
- ```<T, K extends keyof T>``` ключ K должен быть ключом объекта T (см. пример)
- ```typeof``` - позволяет заимствовать типы (`typeof` + `keyof` , см. пример)
```ts
let strOrNum: string | number;
let str2OtNum: typeof strOrNum; // возьми тип кот был у strOrNum
```

```ts
// typeof + keyof
let user: UserWithRole = {
  name: 'asd',
  age: 33,
  skills: ['1', '2'],
  id: 1
};
type keyofUser = keyof typeof user; // получаем все ключи user - "name" | "age" | "skills" | "id"

enum Direction {
  Up,
  Down
}
type d = keyof typeof Direction; // создали type с названиями св-в enum Direction
const dText: d = 'Up'; // "Up" | "Down"
```
- ```infer``` - позволяет 'вытащить' какой-либо тип из типа (см. пример)

```ts
  function runTransaction(transaction: {
    fromTo: [string, string]
  }) {
    console.log(transaction);
  }

  const transaction: GetFirstArg<typeof runTransaction> = { //*
    fromTo: ['1', '2']
  }

  runTransaction(transaction);
  type GetFirstArg<T> = T extends (first: infer First, ...args: any[]) => any ? First : never; 
  // first - первый аргумент ф-и

  // если T extends ф-ю, то мы должны вернуть First, иначе never
  // infer псевдо-объявляет переменную типа внутри нашего extends 
  // (то есть фактически мы с помощью типа(GetFirstArg) мы 'вытаскиваем' тип First из функции, кот мы передаем*)
```

### keyOf and in

[//]: # (<img src="./img/ts/keyOf_in.png" width="888" style="border: 1px solid black">)

## Utility types

- ```Partial``` - делаем все поля необязательными
```ts
  interface User {
    name: string;
    age?: number;
    email: string;
  }

  type partial = Partial<User>; // делаем все поля необязательными
  const p: partial = {};
```
- ```Require``` - делаем все поля обязательными
```ts
  type required = Required<User>;  // делаем все поля обязательными
  const test1: required = {
    name: 'as',
    age: 12,
    email: 'as'
  }
```
- ```Readonly``` - делаем все поля readonly
```ts
  type readonlyT = Readonly<User>;
  const test2: readonlyT = {
    name: 'as',
    age: 12,
    email: 'as'
  }
  type requiredAndReadonly = Required<Readonly<User>>;
```
- ```Pick``` - выбрать поля
```ts
  type PaymentRequisits = Pick<PaymentPersistent, 'from' | 'to'>; // выбрать
  const test2: PaymentRequisits = {
    from: 'as',
    to: 'as'
  }
```
- ```Omit``` - исключить поля
```ts
  interface PaymentPersistent {
    id: number;
    sum: number;
    from: string;
    to: string;
  }

  type Payment = Omit<PaymentPersistent, 'id'>; // исключить
```
- ```Extract``` - `Extract<Type, Union>` - извлекает из типа `Type` только те типы, которые присутствуют в `Union`.

```ts
type Animal = "cat" | "dog" | "bird" | "fish";
type OnlyCat = Extract<Animal, "cat">; // 'cat'
```

- ```Exclude``` - Исключить ...
```ts
interface XYZ {
  x: number;
  y: number;
  z: number;
}

type XY = Pick<XYZ, Exclude<keyof XYZ, "z">>; // {x: number, y: number}
```
- ```ReturnType``` - получаем тип, кот возвращается от, например, ф-и

```ts
type RT = ReturnType<typeof getData>;
const test1: RT = new User(1, '');
```

-
- ```Parameters``` - вытаскиваем параметры из ф-и, напрмиер
- ```ReturnType```,  ```ConstructorParameters```,  ```InstanceType``` - вытаскиваем что-либо из переданного типа (см.
  пример)
- ```Awaited``` - 'вытаскиваем' финальное значение Promise, то есть используем , когда нам нужно получить
  не promise, а то что внутри

## keyword asserts is

```ts
function assertUserIsAdmin(
  user: NormalUser | AdminUser,
): asserts user is AdminUser {
  if (user.role !== "admin") {
    throw new Error("Not an admin user");
  }
}
```

### type Guard

Иначе говоря Guard - это ф-я

```ts
function isString(x: string | number): x is string { // type guard (is - является)
  return typeof x === 'string';
}
```

## as const instead enum

```ts
const PostState = {
  Draft: "DRAFT",
  Scheduled: "SCHEDULED",
  Published: "PUBLISHED"
} as const;

type PostStateType = typeof PostState[keyof typeof PostState];

const x: PostStateType = PostState.Draft;

const y: PostStateType = "SCHEDULED";                   // Валидно, а в enum НЕТ!


// as const - все поля readonly
// type PostStateType = "DRAFT" | "SCHEDULED" | "PUBLISHED"
```

[example](https://www.typescriptlang.org/play?#code/FA4AjBjB7A7BnALmACtJBlRBDRBTMAXjAG9wIwARAJ2wDNEAuMAIkoCUBBAMQBUWANOQgZIACzwATAK4AbKcxYYAwgAkAopQCqAGU2DhqaQCNZAS3gTJilFoBCOgJIYNlFuQC+YbPChwkANwgEIgAngAOBGiYOPi8EQTEYZHQdKjoiFi4eADaANZ4oalgyXjF0ZmxeAC6QRDk5AD0jWDS8NgA5njkMAjIAB7MFVlxCUTpMdkAdDT0iAFAA)

## generic

- [youtube](https://www.youtube.com/watch?v=t0qQSujSslQ&list=PL_L_J_Lv0U2owwNFXCoAy3BFPntY2Ry8_&index=4&ab_channel=AndrewBurgess)
- [ex](https://www.typescriptlang.org/play?#code/FAFwngDgpgBAUgewEYwLwwN7BjAdgQwFsoAuGAZxACcBLXAcwG5sKR8qQyAKASjQD4YANwQ0AJsxyV8IUjADkdAMYJCEADZRZ8mAB8F5AK5KlUKOXI798gGb4a6w1SjzgAX2ChIsREgBKhrgAPHAwUAAesrhi5PDIguhYOABWyGRwkqwycvIAjoZQBWJWClSBuHT0JfIqapqyxZkIuADCqhpaclxKSNypvfB8qIIi4kMjohLunuDQMADKUNEAooT26r5ocSgAZJgwAPQHMHsAtDB0slSmECA0zSzOSjQQNEsgq+tklLQMmUZIZJQJScVi-JjTYA2QIg+64MK4fKFKC+IIAFTCkSWMW2-C4-TIaJ46WQAWCaMESUOx3UCHoNCUjy0TnhVJwKWQABoWOysrIyHkCkV5NzeThmm06p1uD0+mkYESBMJJuMYD18cgeCwPB5gCpcJQYMkyIsVmsHJtEkznq93p8HAL8OQAAJOgB0ZRFLABQJBAoAFjQYCB-VBnF6cARiALyNjTlBzeoI1kONxVbhDOp1KK+TllO16i5IfrDWV4eglkiCr58TxmMAy26JQXOlwNUhVVT+u4tcAgA)

### default generic

```ts
export const createSet = <T = string>() => {
  return new Set<T>();
};

const stringSet = createSet<string>();
const otherStringSet = createSet();
```

### with Function

```ts
const fetchData = async <TData>(url: string) => {
  let data: TData = await fetch(url).then((response) => response.json());
  return data;
};

const data = await fetchData<{ name: string }>("https://swapi.dev/api/people/1");
```

### depends from parameters

`generic` необязательно принудительно объявлять в реализации - тип возьмется сам, например, **из параметров**:

```ts
const returnBothOfWhatIPassIn = <A, B>(a: A, b: B) => {
  return {
    a,
    b,
  };
};

const result = returnBothOfWhatIPassIn("a", 1);

// class
export class Component<TProps> {
  private props: TProps;

  constructor(props: TProps) {
    this.props = props;
  }

  getProps = () => this.props;
}

const component = new Component({ a: 1, b: 2, c: 3 });
```

#### parameters plus interface

```ts
interface Params<T1, T2> {
  a: T1;
  b: T2;
}

const returnBothOfWhatIPassIn = <T1, T2>(params: Params<T1, T2>) => {
  return {
    first: params.a,
    second: params.b,
  };
};

const result = returnBothOfWhatIPassIn({
  a: "a",
  b: 1,
});
```

#### parameters plus type

```ts
type Job = {
  name: string;
  start: () => void;
  state: 'incomplete' | 'succeess' | 'failure'
}

type JobRun<J extends Job> = {
  job: J;
  state: 'queued' | 'running' | 'completed';
  onComplete: (cb: (job: J) => void) => void;
}

type SendEmailJob = Job & { // & - interception
  recipientEmail: string;
  subject: string;
}

function enqueueJob<T extends Job>(job: T): JobRun<T> {
  // logic
  return {
    job,
    state: 'queued',
    onComplete: (cb: (job: T) => void) => cb(job)
  }
}

const j: SendEmailJob = {
  recipientEmail: 'as@as.ru',
  subject: 'hi there',
  name: 'send-email',
  start: () => null,
  state: 'incomplete'
}

const run = enqueueJob(j);

run.onComplete((job) => {
  job
})
```

### extends

```ts
export const returnWhatIPassIn = <T extends string>(t: T) => t;

export const concatenateFirstNameAndLastName = <T extends { firstName: string; lastName: string }, >(
  user: T,
) => {
  return { ...user, fullName: `${user.firstName} ${user.lastName}` };
};
```

### Branded Type

- [youtube](https://www.youtube.com/watch?v=rpw59rajUSI&list=PL_L_J_Lv0U2owwNFXCoAy3BFPntY2Ry8_&index=6&ab_channel=AndrewBurgess)
- [ex](https://www.typescriptlang.org/play?#code/FA4FwTwBwUwAgKIFsCGBLANgZTAJzQHYDmcAvHAM56FEDcoAZgK4EDGYaA9gXChQBQwAXIlSYc+YgEo4Ab2Bw4AeiUA6dcAC+IFXABCAQQAicAOoB5AEoBpYH34ByPs4oOp9ULsAEIIFYQQBIgPoC8IIAcID5w-ABMcICCIID8IIB8INHxgIwggAwgUsC6ergoBAAmMHlwACrQwiCQsKLo2NTEAIxklHUkAGRycAD6nQBGOfkiDsg1Bnm4MBSumh66jbGAwiCAQiCAMiDAzGwc3HBoFMOYo+OTgmIYIlSSRFIiMCfbFNXiLY3yiuNgTLg8NzWqhKwYTAKAgcAAEiCdVKxOEg3PRtJklHAogsVmsWOwuDw+BQYLgwHsMAcJgJvpgzi0rrxJriwPdSRg7g9ahdngptgx+ABCem-NgAoGOMEQqEwqQyF6KOBgAAWuE4AHc4AQYIqELg5bh+AADACSBB6KAwaDyBlwRCYSBgBDAIgA2gASWT0zQAXUZBE4YDg9N4eTGxK17jZ2nh6wxWxx+VMMAwIpgBMEIgJEho9XFbJU6g08N0TAoKCIMDRG0xlDQRAIAFUoMcauSLunFNiaQSiUd6UHFJG8tHY9D4yda5gg-CEXBgoBuEGCcAAtHBACwgE8A8iBweqAZhB4nAUcFi+GeBRy1WoBEh6dmg25Gy0AxwjtW-72ycxZfJZQrT2Y3GEx36IoQyAgA)

- Когда нам точно нужно знать тип - например, валидный email

```ts
type EmailString = string;

function as(e: EmailString) {
  //...
}

// BAD WORK
as('asasas');

// Решение (2 способа)
// Branded Type:

type EmailString1 = string & { __brand: 'EmailAdress' };

// 1 путь
function isEmailAdress(email: string): email is EmailString1 {
  return email.includes('@gmail.com');
}

// 2 путь
function assertEmailAdress(email: string): asserts email is EmailString1 {
  if (!email.includes('@gmail.com')) {
    throw new Error(`InbalidArgument: [${email}] is not email address`);
  }
}

function sendWelcomeEmail(e: EmailString1) {
  //....
}

// usage
function signUp(email: string) {
  assertEmailAdress(email);
  sendWelcomeEmail(email);
}


// или - для 1го пути
function signUp2(email: string) {
  if (isEmailAdress(email)) {
    sendWelcomeEmail(email);
  }
}
```

## Typing third party libraries

В npm значок ```TS``` (справа от имени пакета) означает,
что types находятся в пакете и вам дополнительно ничего ставить не нужно.

В npm значок ```DT``` (кликабелен) означает что @types есть, но их нужно
установить отдельно (например, ```npm install --save @types/validator```)

### If types are missing

1. Создаем файл ```types.d.ts```

2. Дописываем типы самостоятельно (```'really-relaxed-json'``` -
   название модуля должно совпадать с названием библиотеки):

```ts
declare module 'really-relaxed-json' {
  export function toJson(rjsonString: string, compact?: boolean): string;
}
```

```toJson``` - ф-я модуля, как работает смотрим в исходники.

## Transformation types

### How do we extract type return from function

```ts
const myFunc = () => {
  return "hello";
};

/** How do we extract MyFuncReturn from myFunc? */
type MyFuncReturn = ReturnType<typeof myFunc>;

const getUser = () => {
  return Promise.resolve({
    id: "123",
    name: "John",
    email: "john@example.com",
  });
};

type ReturnValue = Awaited<ReturnType<typeof getUser>>; // 
```

### How do we extract type from Parameters function

```ts
const makeQuery = (
  url: string,
  opts?: {
    method?: string;
    headers?: {
      [key: string]: string;
    };
    body?: string;
  },
) => {
};

type MakeQueryParameters = Parameters<typeof makeQuery>;
// получаем непосредственно 2-й парметр
type MakeQueryParameters2 = Parameters<typeof makeQuery>[1];
```

### Get object keys

```ts
const testingFrameworks = {
  vitest: {
    label: "Vitest",
  },
  jest: {
    label: "Jest",
  },
  mocha: {
    label: "Mocha",
  },
};

type TestingFramework = keyof typeof testingFrameworks; // "vitest" | "jest" | "mocha"
```

### Extract from discriminated union

```ts
export type Event =
  | {
  type: "click";
  event: MouseEvent;
}
  | {
  type: "focus";
  event: FocusEvent;
}
  | {
  type: "keydown";
  event: KeyboardEvent;
};

type ClickEvent = Extract<Event, { type: "click" }>; // получаем 1й 
```

_reverse_:

```ts
export type Event =
  | {
  type: "click";
  event: MouseEvent;
}
  | {
  type: "focus";
  event: FocusEvent;
}
  | {
  type: "keydown";
  event: KeyboardEvent;
};

type NonKeyDownEvents = Exclude<Event, { type: "keydown" }>;
```

### Extract type from prop object

```ts
export const fakeDataDefaults = {
  String: "Default string",
  Int: 1,
  Float: 1.14,
  Boolean: true,
  ID: "id",
};

type FakeDataDefaults = typeof fakeDataDefaults;

export type StringType = FakeDataDefaults["String"];
export type IntType = FakeDataDefaults["Int"];
export type FloatType = FakeDataDefaults["Float"];
export type BooleanType = FakeDataDefaults["Boolean"];
export type IDType = FakeDataDefaults["ID"];
```

### as const

```ts
export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;  // all prop readonly

export type GroupProgram = typeof programModeEnumMap["GROUP"];                // group
export type AnnouncementProgram = typeof programModeEnumMap["ANNOUNCEMENT"];  // announcement
export type OneOnOneProgram = typeof programModeEnumMap["ONE_ON_ONE"];        // 1on1
export type SelfDirectedProgram = typeof programModeEnumMap["SELF_DIRECTED"]; // selfDirected
export type PlannedOneOnOneProgram = typeof programModeEnumMap["PLANNED_ONE_ON_ONE"];
export type PlannedSelfDirectedProgram = typeof programModeEnumMap["PLANNED_SELF_DIRECTED"];

export type GroupProgramAnnouncementProgram = typeof programModeEnumMap["GROUP" | "ANNOUNCEMENT"]; // announcement | group

// получаем ключи кроме "GROUP" | "ANNOUNCEMENT"
type Example = Exclude<keyof typeof programModeEnumMap, "GROUP" | "ANNOUNCEMENT"> // "PLANNED_SELF_DIRECTED" | "ONE_ON_ONE" | "SELF_DIRECTED" | "PLANNED_ONE_ON_ONE"
```

### Get object values

```ts
const frontendToBackendEnumMap = {
  singleModule: "SINGLE_MODULE",
  multiModule: "MULTI_MODULE",
  sharedModule: "SHARED_MODULE",
} as const;

type BackendModuleEnum =
  typeof frontendToBackendEnumMap[keyof typeof frontendToBackendEnumMap];
// "SINGLE_MODULE" | "MULTI_MODULE" | "SHARED_MODULE"
```

### Get array values

```ts
const fruits = ["apple", "banana", "orange"] as const;

type AppleOrBanana = typeof fruits[0 | 1];  // "apple" | "banana"
type Fruit = typeof fruits[number];         //  "apple" | "banana" | "orange"
```

### Template literal syntax

```ts
type Route = `/${string}`;

export const goToRoute = (route: Route) => {
};

// Should succeed:
goToRoute("/users");
goToRoute("/");
goToRoute("/admin/users");

// Should error:
goToRoute("users/1");
goToRoute("http://facebook.com");
```

#### extract from union

```ts
type Routes = "/users" | "/users/:id" | "/posts" | "/posts/:id";
type DynamicRoutes = Extract<Routes, `${string}:${string}`>; // "/users/:id" | "/posts/:id"
```

```ts
type BreadType = "rye" | "brown" | "white";
type Filling = "cheese" | "ham" | "salami";
type Sandwich = `${BreadType} sandwich with ${Filling}`;
// | "rye sandwich with cheese"
// | "rye sandwich with ham"
// | "rye sandwich with salami"
// | "brown sandwich with cheese"
// | "brown sandwich with ham"
// | "brown sandwich with salami"
// | "white sandwich with cheese"
// | "white sandwich with ham"
// | "white sandwich with salami"
```

#### splitting string

```ts
import { S } from "ts-toolbelt";

type Path = "Users/John/Documents/notes.txt";

type SplitPath = S.Split<Path, "/">; // ["Users", "John", "Documents", "notes.txt"]
const a: SplitPath = ["Users", "John", "Documents", "notes.txt"];
```

#### template literals in object keys

```ts
type TemplateLiteralKey = `${"user" | "post" | "comment"}${"Id" | "Name"}`;
type ObjectOfKeys = Record<TemplateLiteralKey, string>;

// ObjectOfKeys equal
// {
//   userId: string;
//   userName: string;
//   postId: string;
//   postName: string;
//   commentId: string;
//   commentName: string;
// }
```

#### uppercase object

```ts
type Event = `log_in` | "log_out" | "sign_up";
type ObjectOfKeys = Record<Uppercase<Event>, string>;

// ObjectOfKeys equal
//         {
//           LOG_IN: string;
//           LOG_OUT: string;
//           SIGN_UP: string;
//         }
```

### Type helpers pattern

#### ReturnWhatIPassIn

```ts
type ReturnWhatIPassIn<T> = T;

type Something = ReturnWhatIPassIn<'Something'>; // Something

type tests = [
  Expect<Equal<ReturnWhatIPassIn<1>, 1>>,
  Expect<Equal<ReturnWhatIPassIn<"1">, "1">>,
  Expect<Equal<ReturnWhatIPassIn<true>, true>>,
  Expect<Equal<ReturnWhatIPassIn<false>, false>>,
  Expect<Equal<ReturnWhatIPassIn<null>, null>>,
];
```

```ts
type Maybe<T> = T | null | undefined;
type x = Maybe<'x'>;                  // "x" | null | undefined
```

#### constraints

```ts
type AddRoutePrefix<TRoute extends string> = `/${TRoute}`; // without extends type is unknown
type x = AddRoutePrefix<"about">;     // "/about"
```

```ts
type CreateDataShape<TData, TError> = {
  data: TData;
  error: TError;
};

type x = CreateDataShape<string, TypeError>;
// equal
// {
//   data: string;
//   error: TypeError;
// }
```

#### default

```ts
type CreateDataShape<TData, TError = undefined> = {
  data: TData;
  error: TError;
};
type x = CreateDataShape<string>; // {data: string, error: undefined}
```

```ts
type GetParametersAndReturnType<T extends (...args: any) => any> = {
  params: Parameters<T>;
  returnValue: ReturnType<T>;
};

type x = GetParametersAndReturnType<(n: number, b: boolean) => number>
,
// { params: [number, boolean]; returnValue: number }
```

#### not undefined or null constraint

```ts
export type Maybe<T extends {}> = T | null | undefined;

// Maybe<null>,       // error
// Maybe<undefined>,  // error
// Maybe<string>,
// Maybe<false>,
// Maybe<0>,
// Maybe<"">
```

#### non empty array:

```ts
type NonEmptyArray<T> = [T, ...Array<T>];
export const makeEnum = (values: NonEmptyArray<string>) => {
};

makeEnum(["a"]);
makeEnum(["a", "b", "c"]);
makeEnum([]); // error
```

### Conditional type and infer

#### Conditional type

```ts
type YouSayGoodbyeAndISayHello<T> = T extends "hello" ? "goodbye" : "hello";
type x = YouSayGoodbyeAndISayHello<"hello">; // "goodbye"
```

#### Returning never

```ts
type YouSayGoodbyeAndISayHello<T> = T extends "hello" | "goodbye"
  ? T extends "hello"
    ? "goodbye"
    : "hello"
  : never;

type x = YouSayGoodbyeAndISayHello<"alright pal">;  // never
type f = Equal<YouSayGoodbyeAndISayHello<"goodbye">; // "hello"
```

```ts
type GetDataValue<T> = T extends { data: any } ? T["data"] : never;
type x = GetDataValue<{ data: { name: "hello"; age: 20 } }>; // { name: "hello"; age: 20 }
```

#### Condition with `infer`

Ключевое слово `infer` дополняет conditional типы и не может использоваться вне конструкции `extends`.
`infer` позволяет нам определить переменную внутри нашего ограничения (constraint), на которую можно ссылаться или
возвращать.

```ts
type GetDataValue<T> = T extends { data: infer TInferredData }
  ? TInferredData
  : never;
type x = GetDataValue<{ data: { name: "hello"; age: 20 } }>; // { name: "hello"; age: 20 }
```

```ts
interface MyComplexInterface<Event, Context, Name, Point> {
  getEvent: () => Event;
  getContext: () => Context;
  getName: () => Name;
  getPoint: () => Point;
}

type Example = MyComplexInterface<
  "click",
  "window",
  "my-event",
  { x: 12; y: 14 }
>;

type GetPoint<T> = T extends MyComplexInterface<any, any, any, infer TPoint>
  ? TPoint
  : never;

type x = GetPoint<Example> // { x: 12; y: 14 }
```

#### Extraction string from array

```ts
type Names = [
  "Matt Pocock",
  "Jimi Hendrix",
  "Eric Clapton",
  "John Mayer",
  "BB King",
];

type GetSurname<T> = T extends `${infer First} ${infer Last}` ? Last : never;
type x = GetSurname<Names[0]>; // "Pocock"
```

#### get result from async function

```ts
const getServerSideProps = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const json: { title: string } = await data.json();
  return {
    props: {
      json,
    },
  };
};

type InferPropsFromServerSideFunction<T> = T extends () => Promise<{
  props: infer P;
}> ? P : never;

type x = InferPropsFromServerSideFunction<typeof getServerSideProps> // { json: { title: string } }
```

#### Distributive conditional types

```ts
type Fruit = "apple" | "banana" | "orange";
type AppleOrBanana = Fruit extends infer T
  ? T extends "apple" | "banana"
    ? T
    : never
  : never;
type x = AppleOrBanana; // "apple" | "banana"
```

or:

```ts
type Fruit = "apple" | "banana" | "orange";
type GetAppleOrBanana<T> = T extends "apple" | "banana" ? T : never;
type AppleOrBanana = GetAppleOrBanana<Fruit>;
type x = AppleOrBanana; // "apple" | "banana"
```

- [переназначение ключей](key-remapping)
  - [Union to object (`in`)](#union-to-object)
  - [Получаем наименование ключа и тип ключа из interface (`K in keyof Attributes`, `as`)](#k-in-keyof)
  - [Получаем только нужные ключи из `interface` (`in`, `keyof`, `T as K`, `extends`, `never`)](#extract-by-id)
  - [Обособляем часть union type (`in`, `as`)](#discriminated-union)

### key-remapping

#### union to object

````ts
type Route = "/" | "/about" | "/admin" | "/admin/users";

type RoutesObject = {
  [R in Route]: R;
};

type tests = RoutesObject
// {
//   "/": "/";
//   "/about": "/about";
//   "/admin": "/admin";
//   "/admin/users": "/admin/users";
// }
````

#### K in keyof

```ts
interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}

type AttributeGetters = {
  [K in keyof Attributes]: () => Attributes[K];
};

type x = AttributeGetters
,
// {
//   firstName: () => string;
//   lastName: () => string;
//   age: () => number;
// }

// remapping key:
type AttributeGetters2 = {
  [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K];
};

type x = AttributeGetters2;
// {
//   getFirstName: () => string;
//   getLastName: () => string;
//   getAge: () => number;
// }
```

#### extract by id

`never` - do not include this in object

```ts
// получаем все св-ва interface у кот есть id в ключе
interface Example {
  name: string;
  age: number;
  id: string;
  organisationId: string;
  groupId: string;
}

type OnlyIdKeys<T> = {
  [K in keyof T as K extends `${string}${"id" | "Id"}${string}`
    ? K
    : never]: T[K];
};

type tests = OnlyIdKeys<Example>;
// {
//   id: string;
//   organisationId: string;
//   groupId: string;
// }


```

#### discriminated union

```ts
type Route =
  | {
  route: "/";
  search: {
    page: string;
    perPage: string;
  };
}
  | { route: "/about"; search: {} }
  | { route: "/admin"; search: {} }
  | { route: "/admin/users"; search: {} };


type RoutesObject = {
  [R in Route as R["route"]]: R["search"];
};

// R in Route - объект итерации
// as R["route"] - получаем значение route

type tests = RoutesObject;
// {
//   "/": {
//     page: string;
//     perPage: string;
//   };
//   "/about": {};
//   "/admin": {};
//   "/admin/users": {};
// }
```













## namespace

```ts
namespace A {
  export const a = 5;

  export interface B {
    c: number;
  }
}

console.log(A.a);
```
