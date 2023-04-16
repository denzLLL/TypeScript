
interface IProvider {
  sendMessage(message: string): void;

  connect(config: string): void;

  disconnect(): void;
}

// реализация
class TelegramProvider implements IProvider {
  connect(config: string): void {
    console.log(config);
  }

  disconnect(): void {
    console.log('disconnect');
  }

  sendMessage(message: string): void {
    console.log(message);
  }
}

class WhatsUpProvider implements IProvider {
  connect(config: string): void {
    console.log(config);
  }

  disconnect(): void {
    console.log('disconnect WhatsUp');
  }

  sendMessage(message: string): void {
    console.log(message);
  }
}

// абстракция
// нам непринципиально какой провайдер передавать - мы скрыли это за интерфейсом IProvider
class NotificationSender {
  constructor(private provider: IProvider) {
  }

  send() {
    this.provider.connect('connect');
    this.provider.sendMessage('message');
    this.provider.disconnect();
  }
}

// расширяем NotificationSender, при необходимости
class DelayNotificationSender extends NotificationSender {
  constructor(provider: IProvider) {
    super(provider);
  }

  sendDelayed() {
  }
}

// Usage
const sender = new NotificationSender(new TelegramProvider())
sender.send()


const sender2 = new NotificationSender(new WhatsUpProvider())
sender2.send()

/*
Проблема
Мы не хотим создавать 4 реализации провайдеров (4 класса) - TelegramProvider, DelayTelegramProvider, WhatsUpProvider, DelayWhatsUpProvider

Решение
NotificationSender - доставляет уведомления, в нем мы абстрагируемся от конкретной реализации провайдера
С помощью паттерна мост мы делаем между уведомлениями NotificationSender и провайдерами.
Наличие методов в провайдерах нам обеспечит интерфейс IProvider, чтобы мы могли работать с любым провайдером.
Если добавится 3-й провайдер мы сможем расширить интерфейс и поправить NotificationSender.

Если нам потребуется расширить логики в NotificationSender мы можем воспользоваться наследованием - class DelayNotificationSender extends NotificationSender.
*/
