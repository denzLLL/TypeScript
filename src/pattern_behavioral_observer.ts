interface IObserver {
  next(subject: ISubject): void
}

interface ISubject {
  subscribe(observer: IObserver)

  unsubscribe(observer: IObserver)

  notify(): void
}

class Lead {
  constructor(public name: string, public phone: string) {
  }
}

// Subject/Observables
class NewLead implements ISubject {
  private observers: IObserver[] = [];
  public state: Lead;

  notify(): void {
    for (const observer of this.observers) {
      observer.next(this);
    }
  }

  subscribe(observer: IObserver) {
    if (this.observers.includes(observer)) {
      return;
    }
    this.observers.push(observer);
  }

  unsubscribe(observer: IObserver) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex == -1) {
      return;
    }
    this.observers.splice(observerIndex, 1);
  }
}

// подписчики
class NotificationService implements IObserver {
  next(subject: ISubject): void {
    console.log('NotificationService get ', subject);
  }
}

class LeadService implements IObserver {
  next(subject: ISubject): void {
    console.log('LeadService get ', subject);
  }
}

// Usage
// Observable
const subject = new NewLead();
subject.state = new Lead('Vasya', '89165554433');
// subscriptions:
const s1 = new NotificationService();
const s2 = new LeadService();

subject.subscribe(s1);
subject.subscribe(s2);
// emit value
subject.notify();
subject.unsubscribe(s1);
subject.notify();


//----------------------------------------------------------------------- ex2
function Subject() {
  let callBacks: any[] = [];
  return {
    subscribe(cb: any) {
      callBacks.push(cb);
      return {
        unsubscribe() {
          callBacks = callBacks.filter(fn => fn != cb);
        }
      }
    },
    next(value) {
      callBacks.forEach(cb => cb(value))
    }
  }
}

let timerSub = Subject();
console.log(timerSub);

let sub1 = timerSub.subscribe((v) => {
  console.log("%cFrom First sub", "color:red", v);
});

setTimeout(() => sub1.unsubscribe(), 5000);


let sub2 = timerSub.subscribe((v) => {
  console.log("%cFrom Second sub", "color:blue", v);
});

setTimeout(() => sub2.unsubscribe(), 10000);


let i = 0;
setInterval(() => timerSub.next(++i), 1000);
