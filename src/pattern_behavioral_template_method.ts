class Form {
  constructor(public name: string) {
  }
}

// общий шаблон/основа
abstract class SaveForm<T> {
  public save(form: Form) {
    const res = this.fill(form);
    this.log(res);
    this.send(res);
  }

  // реализация конкретного шага перекладывается на апи
  protected abstract fill(form: Form): T;

  protected log(data: T): void {
    console.log(data);
  };

  protected abstract send(data: T): void;
}

// FirstAPI реализует лишь то что является его зоной ответственности
class FirstAPI extends SaveForm<string> {
  protected fill(form: Form): string {
    return form.name;
  }

  protected send(data: string): void {
    console.log('Send from API1 ', data)
  }
}

class SecondAPI extends SaveForm<{ fio: string }> {
  protected fill(form: Form): { fio: string } {
    return {fio: form.name};
  }

  protected send(data: { fio: string }): void {
    console.log('Send from API2 ', data)
  }
}

// Usage
const form1 = new FirstAPI();
form1.save(new Form('Vasya'));

const form2 = new SecondAPI();
form2.save(new Form('Vasya'));
