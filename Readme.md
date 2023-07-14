## Установка ts


3
1
2

```
npm i -g typescript
```

Run time - сгенерированный js
Compile time - непосредственно ts

Станет доступна в командной строке команда:

```
tsc
tsc --help

```

## Создадим tsconfig.json (проект ts):

```
tsc --init
```

### tsconfig.json (основные опции):

```
{
  "compilerOptions": {
     "target": "es2016",    // в какой стандарт компилируем
     "allowJs": true,       // позволяет нам сделать так чтобы js файлы были частью приложения (удобно для старых проектов - для переписывания на ts)
     "checkJs": true,
     "outDir": "./build/",  /* Specify an output folder for all emitted files. */   
     "noEmit": true,        // не эмитит в outDir
     "sourceMap": true,     //  позволяют связать ts и js файлы, например, для отладки в браузере
     "declaration": true,   // генерит d.ts файлы, кот содержат декларации типов и интерфейсов (позволяет увидеть в другом проекте (не только js файлы) как работает ваш функ-л с точки зрения ts)
     "module": "commonjs",  // commonjs - for node.js, ES2015/ES6
     "rootDir": "./",       // корневая директория проекта
     "baseUrl": "./",       // базовый урл для импорт. модулей (относительно какого пути импорт)
     
     "paths": {             // позволяет делать алиасы для путей
        "@lib": ["./lib/my-lib"]
     },                     
     "typeRoots": [],       // директория, где лежат типы, по умолчанию - './node_modules/@types'
     "types": [],           // пути до пакетов с типами
     "resolveJsonModule": true,  // работаем с json также как с js файлом
     
     "noImplicitAny": false,     // при false разрешаем any использовать неявно
     "strictNullChecks": true,   // при проверке типов учитывать null и undefined
     
  },
  "files": [                // прописываем файлы, кот необходимо компилировать
    "app.ts"
  ],
  "include": [              // альтенатива files, но в отличие от files поддерживает pattern
    "app*",
    "my_folder/**/app*"
  ],
  "exclude" : [],
  "extends": "../"          // путь до tsconfig, кот extend данный конфиг
}
```

## Компиляция

Чтобы скомпилировать ts (весь проект - tsconfig.json) в js:

```
tsc
```

Компилируем конкретный файл(ы):

```
tsc app.ts
tsc app.ts app2.ts
```

Компилируем и одновременно запускаем:

> tsc name_file.ts | node name_file.js


## отличие interface от Type

- Ключевое отличие interface от Type:  мы можем доопределить interface;
- С type мы можем использовать примитивные типы (interface же работает только с объектами, классами)
- В ```interface``` мы можем использовать кл слово extends (в типах только &):

```
interface UserWithRole extends User, Role {
	createdAt: Date;
}
```

## type Guard

type Guard - это ф-я

```
function isString(x: string | number): x is string { // type guard (is - является)
  return typeof x === 'string';
}
```

## Абстрактный класс

Абстрактный класс позволяют создать базу на которую мы можем наслаивать дополнительный 
функционал с конкретной реализацией.

- Абстрактный класс нельзя инстанциировать;
- abstract методы и св-ва в абстрактном классе говорят о том, что данные метод\св-ва следует реализовать; 
- Абстрактные методы не могут быть использованы вне абстрактного класса;
  Но также мы можем в абстрактном классе реализовывать методы\св-ва, который унаследуются классом-потомком;

## Generics

src/generic.ts

**Обобщенный тип** (T) позволяет резервировать место для типа, который будет при вызове заменен на определенный.

```
function getId<T>(id: T): T {   
    return id;
}
```

- Благодаря Generics мы можем делать универсальные ф-и с точки зрения типов;
- Ограничения generic: мы не можем работать с Generics как с определенным типом и обращаться, например, к его св-ву * (
  как обойти - см. пункт ниже);
- но мы можем использовать extends, кот и ограничит область видимости generic
- ```Record``` - встроенный тип, кот позволяет передать ключ-значение

```
const check: Record<string, boolean> = {
  drive: true,
  kpp: false
};
```

### Mixins

- Mixins это ф-я
- Mixins реализуют возможность наследования от нескольких классов, технически
  нет, т.к. речь идет о типах классов (через функцию, см. пример);
- Mixins также могут использовать как добавление примеси (набор доп сво-в) объекту;

```type Constructor``` - тип при котором мы создаем объект и тут же его возвращаем

## Манипуляции с типами

(src/type_manipulation.ts)

- ```keyof``` - позволяют "вытащить" ключи из класса, интерфейса или обьекта
- ```<T, K extends keyof T>``` ключ K должен быть ключом объекта T (см. пример)
- ```typeof``` - позволяет заимствовать типы (typeof + keyof , см. пример)

```
let strOrNum: string | number;
let str2OtNum: typeof strOrNum; // возьми тип кот был у strOrNum
```

- ```infer``` - позволяет 'вытащить' какой-либо тип из типа (см. пример)

## Служебные типы

(utility_types.ts)

- ```Partial``` - делаем все поля необязательными
  ```type partial = Partial<User>;```
- ```Require``` - делаем все поля обязательными
- ```Readonly``` - делаем все поля readonly 
- ```Pick``` - исключить поля 
- ```Omit``` - выбрать поля
- ```Extract``` - Извлекаем те типы, кот реализуются(extends) от типов переданных во 2-м параметре
- ```Exclude``` - Исключить ...
- ```ReturnType``` - получаем тип, кот возвращается от, например, ф-и
```
type RT = ReturnType<typeof getData>;
const test1: RT = new User(1, '');
```
- ```Parameters``` - вытаскиваем параметры из ф-и, напрмиер
- ```ReturnType```,  ```ConstructorParameters```,  ```InstanceType``` - вытаскиваем что-либо из переданного типа (см. пример)
- ```Awaited``` - 'вытаскиваем' финальное значение Promise, то есть используем , когда нам нужно получить
не promise, а то что внутри


## Декораторы 

- Декоратор - это некий pattern, кот можно встретить в различных языках программирования.
- Декораторы позволяют добавить синтаксис для аннотаций и мета программированию в TS для классов, методов, св-в или параметров методов.
- Декоратор это просто ф-я.
- pattern Декоратор позволяет нам обернуть, к примеру, объект (или класс), которая модифицируем его поведение.
- Декораторы можно комбинировать друг с другом (в силу того что мы каждый раз возвращает один и тот же объект, например)


Разрешаем использование декораторов:
```
"experimentalDecorators": true,   
```

См. пример (decorators.ts)


Фабрика декораторов - это ф-я, которая делает декораторы с разными параметрами. В отличие от обычного декоратора
фабрика декораторов вызывается с какими-то параметрами: 

```
@setUsers(2)
class UserService implements IUserService { 
  //...
}
```

Декоратор метода позволяет дополнить поведение метода 
(перехватывать ошибки и т.д.).

Для декоратора св-в мы переопределяем, кот и определяют значение св-ва 
(полезно при валидации и т.д.):
```
Object.defineProperty(target, propertyKey, {
  set: setter,
  get: getter
});
```
Декоратор accessor - декораторы на getter и setter.


### Метаданные
Декоратор параметра используется обычно с метаданными.
Чтобы использовать метаданные необходимо установить библиотеку:

```
import 'reflect-metadata';
```

В tsconfig.json:
```
"emitDecoratorMetadata": true,  // эмитим метаданные для декораторов в исх. файлах

"types": ["reflect-metadata"],
```
Метаданные мы можем использовать в run time, например, для валидации и т.д.


## namespace 
```
namespace A {
    export const a = 5;

	export interface B {
		c: number;
	}
}

console.log(A.a);
```


## Типизация сторонних библиотек

В npm значок ```TS``` (справа от имени пакета) означает, 
что types находятся в пакете и вам дополнительно ничего ставить не нужно.

В npm значок ```DT``` (кликабелен) означает что @types есть, но их нужно
установить отдельно (например, ```npm install --save @types/validator```)  


### Если types отсутствуют

1. Создаем файл 
```types.d.ts```

2. Дописываем типы самостоятельно
(```'really-relaxed-json'``` - название модуля должно совпадать с названием библиотеки):

```
declare module 'really-relaxed-json' {
  export function toJson(rjsonString: string, compact?: boolean): string;
}
```

```toJson``` - ф-я модуля, как работает смотрим в исходники.


## Порождающие паттерны

В результате их работы мы получаем новый объект (группу объектов)

Иногда нежелательно создавать экземпляр класса напрямую. Тогда мы прибегаем к порождающим паттернам, 
которые могут выбирать оптимальный механизм инстанциирования.

### Фабрика / Factory
Фабрика это супер класс, кот внутри объекты разных классов.

### Одиночка / Singleton
Одиночка - единственный класс/инстанс для всего приложения.

### Одиночка / Prototype
Позволяет клонировать объект.

### Строитель / Builder
Строитель - создаем сложные объекты поэтапно, используя разный набор функций.
Особенность - chaining.

## Структурные паттерны

Структурные шаблоны проектирования имеют дело со структурой объектов и связью между ними.

### Мост / Bridge

Мост — это структурный паттерн проектирования, который разделяет один или несколько классов 
на две отдельные иерархии — абстракцию и реализацию, позволяя изменять их независимо друг от друга.

Позволяет строить мосты между различными типизациями класса.

#### Проблема
Мы не хотим создавать 4 реализации провайдеров (4 класса) - 
`TelegramProvider`, `DelayTelegramProvider`, `WhatsUpProvider`, `DelayWhatsUpProvider`

#### Решение
`NotificationSender` - доставляет уведомления, в нем мы абстрагируемся от конкретной реализации провайдера.

С помощью паттерна мост мы делаем связь между уведомлениями `NotificationSender` и провайдерами.

Наличие методов в провайдерах нам обеспечит интерфейс `IProvider`, чтобы мы могли работать с любым провайдером.

Если добавится 3-й провайдер, мы сможем расширить интерфейс и поправить `NotificationSender`.

Если нам потребуется расширить логики в `NotificationSender` мы можем воспользоваться наследованием - 
`class DelayNotificationSender extends NotificationSender`


### Адаптер / Adapter

Адаптер — это структурный паттерн проектирования, который позволяет объектам с 
несовместимыми интерфейсами работать вместе.
(Позволяет воткнуть объект в уже существующий код портировав его метода.)

В примере замещаем уже существующий объект при помощи адаптера.

### Композит / Composite

Компоновщик — это структурный паттерн проектирования, 
который позволяет сгруппировать множество объектов в древовидную структуру, а затем работать с ней так, как будто это единичный объект.

### Фасад / Facade

Позволяет скрывать какую-либо реализацию за собой (API).

### Прокси / Proxy

Встает перед использованием, например, класса - проксирование запросов.
В отличие от адаптера, где происходит, 
замещение объекта паттерн Прокси всего лишь добавляет дополнительный слой.

### Декоратор / Decorator

Декоратор — это структурный паттерн проектирования, 
который позволяет динамически добавлять объектам новую функциональность, оборачивая их в полезные «обёртки».

## Поведенческие паттерны

Поведенческие паттерны решают задачу эффективного взаимодействия системы.

[js-design-patterns](https://proglib.io/p/js-design-patterns)

### Chain of command / Цепочка вызовов

Это поведенческий паттерн проектирования, который позволяет передавать запросы последовательно по цепочке обработчиков.

### Mediator / Посредник

Медиатор выступает в качестве посредника в общении между различными модулями/компонентами, инкапсулируя их взаимодействие.

### Command / Команда

Команда (англ. command) инкапсулирует действия и нужные данные для обработки этих действий в объекты.
Часто встречается в state manager, где при помощи команд обновляется state.


### State / Состояние

Паттерн Состояние (не `state manager`, а скорее отдельного элемента состояние, которого 
мы можем улучшить) позволяет изменять поведение класса при изменении состояния.

### Strategy / Стратегия

Шаблон Стратегия позволяет переключать используемый алгоритм в зависимости от ситуации.

### Iterator / Итератор

Паттерн Итератор предоставляет доступ к элементам объекта, не раскрывая способ их внутреннего представления.

### Template method / Шаблонный метод

Шаблонный метод определяет "скелет" алгоритма, но делегирует реализацию шагов дочерним классам.

### Observer / Наблюдатель

Паттерн Наблюдатель позволяет оповещать всех заинтересованных объектов о произошедших изменениях.




