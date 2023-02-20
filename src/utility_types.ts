//------------------------ Partial, Required, Readonly
(() => {

  interface User {
    name: string;
    age?: number;
    email: string;
  }

  type partial = Partial<User>; // делаем все поля необязательными
  const p: partial = {};

  type required = Required<User>;  // делаем все поля обязательными
  const test1: required = {
    name: 'as',
    age: 12,
    email: 'as'
  }


  type readonlyT = Readonly<User>;
  const test2: readonlyT = {
    name: 'as',
    age: 12,
    email: 'as'
  }
  type requiredAndReadonly = Required<Readonly<User>>;

})();

//------------------------ Pick, Omit, Extract, Exclude
(() => {

  interface PaymentPersistent {
    id: number;
    sum: number;
    from: string;
    to: string;
  }

  type Payment = Omit<PaymentPersistent, 'id'>; // исключить
  const test1: Payment = {
    sum: 12,
    from: 'as',
    to: 'as'
  }

  type PaymentRequisits = Pick<PaymentPersistent, 'from' | 'to'>; // выбрать
  const test2: PaymentRequisits = {
    from: 'as',
    to: 'as'
  }

  type ExtractEx = Extract<PaymentPersistent, Payment>;
  const test3: ExtractEx = {
    sum: 12,
    from: 'as',
    to: 'as',
    id: 1
  }

})();

//------------------------ ReturnType, Parameters, ConstructorParameters

(() => {

  class User {
    constructor(public id: number, public name: string) {
    }
  }

  function getData(id: number): User {
    return new User(id, 'Вася');
  }

  type RT = ReturnType<typeof getData>;   // получаем тип, кот возвращает ф-я getData
  const test1: RT = new User(1, '');


  type RT2 = ReturnType<() => void>;
  const test2: RT2 = (() => {
  })();          // ничего не возвращает

  type RT3 = ReturnType<<T>() => T>;
  const test5: RT3 = ((a: number) => {
  })(12);

  type RT4 = ReturnType<<T extends string>() => T>;
  const test: RT4 = 'canRead';

  type PT = Parameters<typeof getData>[0];
  const test4: PT = 12;

  type CP = ConstructorParameters<typeof User>;
  const test8: CP = [12, 'canRead'];

  type IT = InstanceType<typeof User>;
  const test7: IT = new User(1, '');

})();

//------------------------ Awaited

(async () => {
  type A = Awaited<Promise<string>>;            //  в A у нас будет string
  type A2 = Awaited<Promise<Promise<string>>>;  // раскрутит всю цепочку Promise и вернет string

  interface IMenu {
    name: string;
    url: string;
  }

  async function getMenu(): Promise<IMenu[]> {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return [{name: 'Аналитика', url: 'analytics'}];
  }

  type R = Awaited<ReturnType<typeof getMenu>>;
  const test: R = await getMenu();


  async function getArray<T>(x: T): Promise<Awaited<T>[]> {
    return [await x];
  }

  async function getArray2<T>(x: T): Promise<T[]> {
    return [await x];
  }
})();

