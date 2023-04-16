interface IMediator {
  notify(sender: string, event: string): void
}

abstract class Mediate {
  mediator: IMediator;

  setMediator(mediator: IMediator) {
    this.mediator = mediator;
  }
}

class Notifications {
  send() {
    console.log('Отправляю уведомление');
  }
}

class LogClass {
  log(message: string) {
    console.log(message);
  }
}

class EventHandler extends Mediate {
  myEvent() {
    this.mediator.notify('EventHandler', 'myEvent')
  }
}

// Mediator
class NotificationMediator implements IMediator {
  // передаем все зависимости для осуществления нашей логики
  constructor(public notifications: Notifications, public logger: LogClass, public handler: EventHandler) {
  }

  notify(sender: string, event: string): void {
    switch (event) {
      case 'myEvent':
        this.notifications.send();
        this.logger.log('Отправлено');
        break;
    }
  }
}


// Usage
const handler = new EventHandler();
const logger = new LogClass();
const notifications = new Notifications();

const med = new NotificationMediator(notifications, logger, handler);
// добавляем наш медиатор внутрь обработчика
handler.setMediator(med);
handler.myEvent();


/*
Отправляю уведомление
Отправлено
 */
