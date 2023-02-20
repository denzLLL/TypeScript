interface IUser {
  name: string;
  age: number;
}

type KeysOfUser = keyof IUser;    // keyof - получаем ключи

const key: KeysOfUser = 'age';    // явно получили имя ключа

function getValue<T, K extends keyof T>(obj: T, key: K) { // K extends keyof T - ключ (K) должен строго принадлежать объекту (T)
  return obj[key];
}

const userVasya: IUser = {
  name: 'Вася',
  age: 30
};

const userName = getValue(userVasya, 'name');


// Ex: ф-я группировки, кот принимает массив объектов и его ключ, произведя групп-ку по указанному ключу и возвращая сгруппированный объект

interface Data {
  group: number;
  name: string;
}

const data: Data[] = [
  {group: 1, name: 'a'},
  {group: 2, name: 'b'},
  {group: 3, name: 'c'},
]

type key = string | number | symbol;

interface IGroup<T> {
  [key: string]: T[]
}

function group<T extends Record<key, any>>(arr: T[], key: keyof T): IGroup<T> {
  return arr.reduce<IGroup<T>>((map: IGroup<T>, it) => {
    const itemKey = it[key];
    let curEl = map[itemKey];

    if (Array.isArray(curEl)) {
      curEl.push(it)
    } else {
      curEl = [it]
    }
    map[itemKey] = curEl
    return map;
  }, {})
}

const resTest1 = group<Data>(data, 'group');
console.log(resTest1)

// end Ex

//------------------------ typeof
let strOrNum: string | number;

if (Math.random() > 0.5) {
  strOrNum = 5;
} else {
  strOrNum = 'str';
}

if (typeof strOrNum === 'string') { // как на js
  console.log(strOrNum);
} else {
  console.log(strOrNum);
}

// как с точки зрения типов:
let str2OtNum: typeof strOrNum; // возьми тип кот был у strOrNum

// typeof + keyof
const userA = {
  name: 'Vasya'
}

type keyofUser = keyof typeof user; // получаем все ключи user

enum Direction {
  Up,
  Down
}

type d = keyof typeof Direction; // создали type с названиями св-в enum Direction
const dText: d = 'Up';


//------------------------ Indexed Access types (обращения по индексу в типах)
(() => {
  interface Role {
    name: string;
  }

  interface Permission {
    endDate: Date;
  }

  interface User {
    name: string;
    roles: Role[];
    permission: Permission;
  }

  const user: User = {
    name: 'Вася',
    roles: [],
    permission: {
      endDate: new Date()
    }
  }

  const nameUser = user['name'];
  let roleNames: 'roles' = 'roles';

  type rolesType = User['roles'];                         // получаем тип ролей пользователя по ключу интерфейса
  const testA: rolesType = [{name: 'test'}];

  type rolesType2 = User[typeof roleNames];
  const testB: rolesType2 = [{name: 'test'}];

  type roleType = User['roles'][number];                  // обобщенно обращаемся ко всем элементам массива, получая от них тип
  const testArr: roleType = {name: 'test'};

  type dateType = User['permission']['endDate'];
  const testDate: dateType = new Date();

  const roles = ['admin', 'user', 'super-user'] as const; // мы делаем тип, который будет union (a I b) из все элементов массива
  type roleTypes = typeof roles[number];
  const testRole: roleTypes = 'admin';


})();


//------------------------ Conditional types (условия)

(() => {

  interface HTTPResponse<T extends 'success' | 'failed'> {  // <T extends 'success' | 'failed'>  -  T либо success либо failed
    code: number;
    data: T extends 'success' ? string : Error;             // Conditional
  }

  const suc: HTTPResponse<'success'> = {
    code: 200,
    data: 'done'
  }

  const err: HTTPResponse<'failed'> = {
    code: 200,
    data: new Error()
  }

  class User {
    id: number = 1;
    name: string;
  }

  class UserPersistend extends User {
    dbId: string = '3';
  }

  // перегрузка
  function getUser(id: number): User;
  function getUser(dbId: string): UserPersistend;
  function getUser(dbIdOrId: string | number): User | UserPersistend {
    if (typeof dbIdOrId === 'number') {
      return new User();
    } else {
      return new UserPersistend();
    }
  }

  type UserOrUserPersistend<T extends string | number> = T extends number ? User : UserPersistend;

  function getUser2<T extends string | number>(id: T): UserOrUserPersistend<T> {
    if (typeof id === 'number') {
      return new User() as UserOrUserPersistend<T>;   // !
    } else {
      return new UserPersistend() as UserOrUserPersistend<T>;
    }
  }

  const res: User = getUser2(1);
  const res2: UserPersistend = getUser2('sdfsfd');

  console.log('res2: ', res2)

})();


//------------------------ Infer

(() => {

  function runTransaction(transaction: {
    fromTo: [string, string]
  }) {
    console.log(transaction);
  }

  const transaction: GetFirstArg<typeof runTransaction> = { //*
    fromTo: ['1', '2']
  }

  runTransaction(transaction);
  type GetFirstArg<T> = T extends (first: infer First, ...args: any[]) => any ? First : never; // first - первый аргумент ф-и

  // если T extends ф-ю, то мы должны вернуть First, иначе never
  // infer псевдо-объявляет переменную типа внутри нашего extends (то есть фактически мы с помощью типа(GetFirstArg) мы 'вытаскиваем' тип First из функции, кот мы передаем*)

})();


//------------------------ Mapped types - маппинг из одного типа в другой

(() => {
  type Modifier = 'read' | 'update' | 'create';

  type UserRoles = {
    customers?: Modifier,
    projects?: Modifier,
    adminPanel?: Modifier,
  }


  type ModifierToAccess2<Type> = {
    [Property in keyof Type]: boolean;        // [Property in keyof Type]: boolean  // берем каждое св-во в типе Type и делаем его boolean
  }
  const user: ModifierToAccess2<UserRoles> = {
    customers: true,
    projects: true,
    adminPanel: true
  }

  type ModifierToAccess<Type> = {
    +readonly [Property in keyof Type as Exclude<`canAccess${string & Property}`, 'canAccessadminPanel'>]-?: boolean; // -? св-ва обязательно
  }                                                                                                                   // +? св-ва необязательно
                                                                                                                      // +readonly - добавили readonly
                                                                                                                      // <`canAccess${string & Property} - добавляем canAccess$ к имени св-ва
                                                                                                                      // , 'canAccessadminPanel' - исключаем (2-е значение Exclude)
  type UserAccess2 = ModifierToAccess<UserRoles>;
  const user2: UserAccess2 = {
    canAccesscustomers: true,
    canAccessprojects: true
  }
})();

//------------------------ Template literal types

(() => {

  // I
  type ReadOrWrite = 'read' | 'write';

  type Access = `can${Capitalize<ReadOrWrite>}`; // uppercase
  const test: Access = 'canRead';

  // II
  type ReadOrWriteBulk<T> = T extends `can${infer R}` ? R : never;

  type T = ReadOrWriteBulk<Access>; // 'canRead' | 'canWrite'  // infer - получаем все что после 'can'
  const test2: T = 'Read';


  // III
  type ErrorOrSuccess = 'error' | 'success';

  type ResponseT = {
    result: `http${Capitalize<ErrorOrSuccess>}`
  }

  const a2: ResponseT = {
    result: 'httpSuccess'
  }

})();

