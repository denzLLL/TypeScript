class UserClass {
  constructor(public userId: number) {
  }
}

// необяз. класс - в нем мы будем хранить историю
class CommandHistory {
  public commands: Command[] = [];

  push(command: Command) {
    this.commands.push(command);
  }

  remove(command: Command) {
    this.commands = this.commands.filter(c => c.commandId !== command.commandId)
  }
}


// абстрактная команда со своей логикой
abstract class Command {
  public commandId: number;

  abstract execute(): void;

  protected constructor(public history: CommandHistory) {
    this.commandId = Math.random()
  }
}

// команда на добавление юзеров
class AddUserCommand extends Command {
  constructor(private user: UserClass,
              private receiver: UserService,
              history: CommandHistory) {
    super(history);
  }

  execute(): void {
    this.receiver.saveUser(this.user);
    this.history.push(this);
  }

  undo(): void {
    this.receiver.deleteUser(this.user.userId);
    this.history.remove(this)
  }
}


class UserService {
  saveUser(user: UserClass) {
    console.log(`save user with ${user.userId}`);
  }

  deleteUser(userId: number) {
    console.log(`delete user with ${userId}`);
  }
}

class ControllerClass {
  receiver: UserService;
  history: CommandHistory = new CommandHistory();

  addReceiver(receiver: UserService) {
    this.receiver = receiver;
  }

  run() {
    // команда каждый раз уникальная
    const addUserCommand = new AddUserCommand(
      new UserClass(1),
      this.receiver,
      this.history
    );
    addUserCommand.execute();
    console.log(addUserCommand.history);
    addUserCommand.undo();
    console.log(addUserCommand.history);
  }
}

// реализуем взаимодействие между UserService и ControllerClass через команду

// Usage

const controller1 = new ControllerClass();
controller1.addReceiver(new UserService());
controller1.run();
