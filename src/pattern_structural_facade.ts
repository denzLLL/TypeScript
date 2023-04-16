
class Notify {
  send(template: string, to: string) {
    console.log(`Send ${template} to ${to}`)
  }
}

class Log {
  log(message) {
    console.log(message)
  }
}

class Template {
  private  templates = [{name: 'other', template: `<h1>Template</h1>`}]

  getByName(name: string) {
   return  this.templates.find(t => t.name === name)
  }
}

// Фасад
class NotificationFacade {

  // реализуем фасад - логика из кастомных инстансов реализованных в 1-м классе
  private notify: Notify;
  private logger: Log;
  private template: Template;

  constructor() {
    this.notify = new Notify();
    this.logger = new Log();
    this.template = new Template();
  }


  send(templateName: string, to: string) {
    const data = this.template.getByName(templateName);
    if (!data) {
      this.logger.log('templateName Not found')
      return
    }
    this.notify.send(data.template, to);
    this.logger.log('Template send');
  }
}


const s = new NotificationFacade()
s.send('other', 'as@as.ru');



