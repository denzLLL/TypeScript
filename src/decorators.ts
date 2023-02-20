//------------------------ Pattern декоратор (JS)
import 'reflect-metadata';

(async () => {
  console.group('Pattern декоратор');

  interface IUserService {
    users: number;

    getUsersInDatabase(): number;
  }

  class UserService implements IUserService {
    users: number = 1000;

    getUsersInDatabase(): number {
      return this.users;
    }
  }

  function nullUser(obj: IUserService) { // паттерн дек-р - обнуляем юзеров в базе
    obj.users = 0;
    return obj;
  }

  function logUsers(obj: IUserService) {
    console.log('Users: ' + obj.users);
    return obj;
  }

  console.log(new UserService().getUsersInDatabase());
  console.log(nullUser(new UserService()).getUsersInDatabase());            // возвращает тот же объект, но декоратор обнуляем юзеров в объекте предварительно
  console.log(logUsers(nullUser(new UserService())).getUsersInDatabase());  // пример паттерна декоратор с 2мя декораторами
  console.log(nullUser(logUsers(new UserService())).getUsersInDatabase());
  console.groupEnd();
})();


//------------------------ Декоратор класса (в angular используется фабрика декораторов)

(() => {
  console.group('Декоратор класса');

  interface IUserService {
    users: number;

    getUsersInDatabase(): number;
  }

  @nullUser
  @threeUserAdvanced
  class UserService implements IUserService {
    users: number = 1000;

    getUsersInDatabase(): number {
      return this.users;
    }
  }

  function nullUser(target: Function) {
    // декоратор класса, модифицируем прототип класса,
    // но в нашем случае останется 1000 тк иниц-я класса сработает позже декоратора
    // target - это ф-я, поэтому используем конструкцию, кот определена для дек. threeUserAdvanced
    target.prototype.users = 0;
  }

  function threeUserAdvanced<T extends { new(...args: any[]): {} }>(constructor: T) {
    // декоратор класса, но в этом случае мы модифицируем поведение класса 'отнаследовавшись'
    // от исходного класса, кот мы декорируем и возвращаем новый класс
    // constructor - это класс, т.к. мы его указали явно в типе
    return class extends constructor {                                                  // p.s. target и constructor это одно и тоже
      users = 3;
    }
  }

  console.log(new UserService().getUsersInDatabase()); // 3
  console.groupEnd();
})();


//------------------------ Фабрика декораторов

(() => {
  console.group('Фабрика декораторов');

  interface IUserService {
    users: number;

    getUsersInDatabase(): number;
  }

  @log()
  @setUsers(2)
  @setUserAdvanced(3)
  class UserService implements IUserService {
    users: number = 1000;

    getUsersInDatabase(): number {
      return this.users;
    }
  }

  function setUsers(users: number) { // фабрика, которая возвращает ф-ю декоратор с предуст-м значением у класса
    console.log('setUsers init');
    return (target: Function) => {
      console.log('setUsers run');
      target.prototype.users = users;
    }
  }

  function log() {
    console.log('log init');
    return (target: Function) => {
      console.log('log run');
      console.log(target);
    }
  }

  function setUserAdvanced(users: number) { // верный подход (см. выше), тк мы динамически меняем значения у класса
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
      return class extends constructor {
        users = users;
      }
    }
  }

  console.log('Фабрика декораторов: ', new UserService().getUsersInDatabase()); // 3
  console.groupEnd();
})();

//------------------------ Декоратор метода
(() => {
  console.group('Декоратор метода');

  interface IUserService {
    users: number;

    getUsersInDatabase(): number;
  }

  class UserService implements IUserService {
    users: number = 1000;

    @Log()
    getUsersInDatabase(): number {
      throw new Error('Ошибка');
    }
  }

  // декоратор метода:
  function Log() {
    return (
      target: Object,                                               // объект к кот. относится наш метод
      propertyKey: string | symbol,                                 // название метода
      descriptor: TypedPropertyDescriptor<(...args: any[]) => any>  // descriptor.value - сама ф-я;
    ): TypedPropertyDescriptor<(...args: any[]) => any> | void => {
      console.log('target: ', target);
      console.log('propertyKey: ', propertyKey);
      console.log('descriptor: ', descriptor);
      const oldVal = descriptor.value;                              // сохраняем изначальную ф-ю

      descriptor.value = () => {                                    // переопределяем нашу ф-ю
        console.log('no error');
      }
    }
  }

  let t = new UserService();
  console.log('Декоратор метода: ', t.getUsersInDatabase());
  console.groupEnd();

})();


//------------------------ Декоратор св-в
(() => {
  console.group('Декоратор св-в');

  interface IUserService {
    users: number;

    getUsersInDatabase(): number;
  }

  class UserService implements IUserService {
    @Max(100)
    users: number;

    getUsersInDatabase(): number {
      throw new Error('Ошибка');
    }
  }

  // декоратор Max - принимает максимальное значение доступное для св-ва
  function Max(max: number) {
    return (
      target: Object,                 // объект к кот. относится наше св-во
      propertyKey: string | symbol    // название св-ва
    ) => {
      let value: number;
      const setter = function (newValue: number) {
        if (newValue > max) {
          console.log(`Нельзя установить значение больше ${max}`);
        } else {
          value = newValue;
        }
      }

      const getter = function () {
        return value;
      }

      Object.defineProperty(target, propertyKey, {
        set: setter,
        get: getter
      });
    }
  }

  const userService = new UserService();
  userService.users = 1;
  console.log(userService.users);
  userService.users = 1000;
  console.log(userService.users);
  console.groupEnd();
})();


//------------------------ Декоратор accessor (встречаются нечасто)

(() => {
  console.group('Декоратор accessor');

  interface IUserService {
    getUsersInDatabase(): number;
  }

  class UserService implements IUserService {
    private _users: number;

    @Log()
    set users(num: number) {
      this._users = num;
    }

    get users() {
      return this._users;
    }

    getUsersInDatabase(): number {
      throw new Error('Ошибка');
    }
  }

  function Log() { // Декоратор accessor
    return (
      target: Object,
      _: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const set = descriptor.set;
      descriptor.set = (...args: any) => { // переопределим set , чтобы залогировать логику
        console.log(args);
        set?.apply(target, args);
      }
    }
  }

  const userService = new UserService();
  userService.users = 1;
  console.log(userService.users);
  console.groupEnd();
})();


//------------------------ Декоратор параметра

(() => {
  console.group('Декоратор параметра');

  interface IUserService {
    getUsersInDatabase(): number;
  }

  class UserService implements IUserService {
    private _users: number;

    getUsersInDatabase(): number {
      return this._users;
    }

    setUsersInDatabase(@Positive() num: number, @Positive() _: number): void {
      this._users = num;
    }
  }

  function Positive() {
    return (
      target: Object,
      propertyKey: string | symbol,
      parameterIndex: number // позиция на кот. находится параметр
    ) => {
      console.group('[target, propertyKey, parameterIndex]: ')
      console.log(target);
      console.log(propertyKey);
      console.log(parameterIndex);
      console.groupEnd();
    }
  }

  const userService = new UserService();

  console.groupEnd();
})();


//------------------------ Метаданные

(() => {
  console.group('Метаданные');

  const POSITIVE_METADATA_KEY = Symbol('POSITIVE_METADATA_KEY');

  interface IUserService {
    getUsersInDatabase(): number;
  }

  class UserService implements IUserService {
    private _users: number;

    getUsersInDatabase(): number {
      return this._users;
    }

    @Validate()
    setUsersInDatabase(@Positive() num: number): void {
      this._users = num;
    }
  }

  function Positive() { // имеем доступ к параметрам, кот кладем в метаданные
    return (
      target: Object,
      propertyKey: string | symbol,
      parameterIndex: number
    ) => {
      console.log(Reflect.getOwnMetadata('design:type', target, propertyKey)); // получаем 'design:type' из target и это propertyKey //  [Function: Function] тк это метод нашего класса

      console.log(Reflect.getOwnMetadata('design:paramtypes', target, propertyKey)[0]);         // знач параметр
      console.log(Reflect.getOwnMetadata('design:returntype', target, propertyKey));            // undefined тк ничего не возвращаем
      console.log('parameterIndex: ', parameterIndex);

      // POSITIVE_METADATA_KEY - уник. ключ
      let existParams: number[] = Reflect.getOwnMetadata(POSITIVE_METADATA_KEY, target, propertyKey) || [];
      existParams.push(parameterIndex);
      console.log('existParams: ', existParams);
      Reflect.defineMetadata(POSITIVE_METADATA_KEY, existParams, target, propertyKey);                        // определяем новые метаданные *
    }
  }

  function Validate() { // универс. декоратор кот валидирует данные в рамках Run Time (по сути мы перезаписали наш метод, но для валидации используем данные кот берем из метаданных)
    return (
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
      let method = descriptor.value;
      descriptor.value = function (...args: any) {
        let positiveParams: number[] = Reflect.getOwnMetadata(POSITIVE_METADATA_KEY, target, propertyKey); // реализуем валидацию на основе метаданных *
        if (positiveParams) {
          for (let index of positiveParams) {
            if (args[index] < 0) {
              throw new Error('Число должно быть больше нуля');
            }
          }
        }
        return method?.apply(this, args);
      }
    }
  }

  try {
    const userService = new UserService();
    console.log('userService.setUsersInDatabase(10): ', userService.setUsersInDatabase(10));
    console.log('userService.getUsersInDatabase(10): ', userService.getUsersInDatabase());
    console.log('userService.setUsersInDatabase(-1): ', userService.setUsersInDatabase(-1));
  } catch (e: any) {
    console.error(e?.message)
  }

  console.groupEnd();
})();


