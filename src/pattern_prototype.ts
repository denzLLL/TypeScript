

// обеспечиваем методом, кот будет выполнять полное клонирование объекта
interface Prototype<T> {
  clone(): T;
}

class UserHistory implements Prototype<UserHistory> {
  createdAt: Date;

  constructor(public  email: string, public name: string) {
    this.createdAt = new Date();
  }

  clone(): UserHistory {
    let target = new UserHistory(this.email, this.name);
    target.createdAt = this.createdAt;
    return target;
  }
}


let ins1 = new UserHistory('as@as.ru', 'As');
console.log(ins1)
let cloneIns1 = ins1.clone();
console.log(cloneIns1)



