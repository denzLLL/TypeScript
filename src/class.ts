//------------------------

class User2 {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const user1 = new User2('Вася');
console.log(user1);
user1.name = 'Петя';
console.log(user1);

class Admin {
  role: number; // allow:  "strictPropertyInitialization": false,
}

const admin = new Admin();
admin.role = 1;


//------------------------ use interface
interface ILogger {
  log(...args): void;

  error(...args): void;
}

class Logger implements ILogger {
  log(...args: any[]): void {
    console.log(...args);
  }

  async error(...args: any[]): Promise<void> {
    // Кинуть во внешнюю систему
    console.log(...args);
  }
}

interface IPayable {
  pay(paymentId: number): void;

  price?: number;
}

class User1 implements IPayable {
  pay(paymentId: number | string): void {
    ///
  }
}

//------------------------ в данном случае мы используем Композицию, а не наследование, что более релевантно
class Payment {
  date: Date;
}

class UserWithPayment2 {
  user: User;
  payment: Payment;

  constructor(user: User, payment: Payment) {
    this.payment = payment;
    this.user = user;
  }
}

//------------------------ видимость св-в
class Vehicle {
  public make: string;
  private damages: string[];  // модиф-я доступна только внутри класса
  private _model: string;
  protected run: number;      // модиф-я доступна только внутри класса, а также внутри унасл-х классов
  #price: number;

  set model(m: string) {
    this._model = m;
    this.#price = 100;
  }

  get model() {
    return this._model;
  }

  addDamage(damage: string) {
    this.damages.push(damage);
  }
}

//------------------------ Абстрактный класс

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



