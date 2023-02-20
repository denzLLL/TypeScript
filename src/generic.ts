//------------------------ Встроенные generic

const num: Array<number> = [1, 2, 3];

async function test() {
  const a = await new Promise<number>((resolve, reject) => {
    resolve(1);
  });
}

// Record - встроенный тип, кот позволяет передать ключ-значение
const check: Record<string, boolean> = {
  drive: true,
  kpp: false
};


//------------------------ Функция с generic

function logMiddleware<T>(data: T): T {                 // T
  console.log(data);
  return data;
}

const res = logMiddleware<number>(10);

function getSplitHalf<T>(data: Array<T>): Array<T> {    // Array<T>
  const l = data.length / 2;
  return data.splice(0, l);
}

console.log(getSplitHalf<number>([1, 3, 4]));

//------------------------ Использование в типах
// описание в типах функции:
const split: <T>(data: Array<T>) => Array<T> = getSplitHalf;
const split2: <Y>(data: Array<Y>) => Array<Y> = getSplitHalf;

// в интерфейсах:
interface ILogLine<T> {
  timeStamp: Date;
  data: T
}

type LogLineType<T> = {
  timeStamp: Date;
  data: T
}

const logLine: ILogLine<{ a: number }> = {
  timeStamp: new Date(),
  data: {
    a: 1
  }
}

//------------------------ Ограничения generic: мы не можем работать с Generics как с определенным типом и обращаться, например, к его св-ву

interface Vehicle1 {
  run: number;
}

function kmToMiles<T extends Vehicle1>(vehicle: T): T {
  vehicle.run = vehicle.run / 0.62;
  return vehicle;
}

interface LCV extends Vehicle1 {
  capacity: number;
}

kmToMiles({run: 1});
kmToMiles({run: 1, test: 12});

const logId1 = <T extends string | number, Y>(id: T, additionalData: Y): { id: T, data: Y } => {
  console.log(id);
  console.log(additionalData);
  return {id, data: additionalData};
};

//------------------------ Классы с generic

class Resp<D, E> {
  data?: D;
  error?: E;

  constructor(data?: D, error?: E) {
    if (data) {
      this.data = data;
    }
    if (error) {
      this.error = error;
    }
  }
}

const resTest = new Resp<string, number>('data');

class HTTPResp<F> extends Resp<string, number> { // наследование (extends) классов с generic
  code: F;

  setCode(code: F) {
    this.code = code;
  }
}

const res2 = new HTTPResp();

//------------------------ Mixins (type Constructor)

type Constructor = new (...args: any[]) => {}           // type Constructor (по сути любой класс так можно описать)
type GConstructor<T = {}> = new (...args: any[]) => T   // type Constructor с generic

class List {
  constructor(public items: string[]) {
  }
}

class Accordion {
  isOpened: boolean;
}

type ListType = GConstructor<List>;
type AccordionType = GConstructor<Accordion>;

// Пример без использования Mixins
class ExtendedListClass extends List { // *
  first() {
    return this.items[0];
  }
}

// Реализуем функ-ть выше * при помощи Mixins (ExtendedList)
function ExtendedList<TBase extends ListType & AccordionType>(Base: TBase) { // у нас есть ф-я, в который мы передаем класс (данный класс extends ListType & AccordionType)
  return class ExtendedList extends Base {
    first() {
      return this.items[0];
    }
  }
}

class AccordionList {
  isOpened: boolean;

  constructor(public items: string[]) {
  }
}

const list = ExtendedList(AccordionList);
const resTest2 = new list(['first', 'second']);
console.log(resTest2.first());
