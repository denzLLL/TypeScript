// tuple (кортеж) - одно из вариаций массивов, где мы можем четко задать типы и длину
const skill: [number, string] = [1, 'Dev'];

// spread in type
const arr: [number, string, ...boolean[]] = [1, 'Dev', true, false, true];

// readonly
const skillNew: readonly [number, string] = [1, 'Dev']; // or
const skillNew1: ReadonlyArray<string> = ['Prod', 'Dev'];


// Union (союз) - это возможность сказать, что в той или иной переменной могут находиться различные типы
const arr1: (string | number)[] = [];
const b: string | number = 12;


// Literal type
function fetchWithAuth(url: string, method: 'post' | 'get'): 1 | -1 {
  return 1;
}

// каст (приведение типов) к типу
let method = 'post';
fetchWithAuth('s', method as 'post');

// ------------------ // ------------------ Alias (type)
type User = {
  name: string,
  age: number,
  skills: string[]
}

type Role = {
  name: string;
  id: number;
}

type UserWithRole = User & Role;

let user: UserWithRole = {
  name: 'asd',
  age: 33,
  skills: ['1', '2'],
  id: 1
};
console.log(user);

// ------------------ // ------------------ Interfaces - альтернативная запись описания объекта
interface UserI {
  name: string,
  age: number,
  skills: string[]

  log: (id: number) => string;
}

interface RoleI {
  roleId: number;
}

interface UserWithRoleI extends UserI, RoleI { // в type используем & (объединение)
  createdAt: Date;
}

interface UserDic {
  [index: string]: User // имя проперти - любое число
}

// ------------------ // ------------------ отличия Interfaces от type
// мы можем доопределить (merge) interface

interface User2 {
  name: string
}

interface User2 {
  age: number;
}

const user2: User2 = {
  name: 'as',
  age: 33
}

// с type мы можем использовать примитивные типы (interface же работает только с объектами, классами)
type ID = string | number;
type I1 = unknown & string;

// ------------------ // ------------------ unknown - заранее не знаем какой тип лежит в переменной
// ------------------ // ------------------ never - никогда такого не произойдет


