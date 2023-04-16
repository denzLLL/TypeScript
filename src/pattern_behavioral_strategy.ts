class UserK {
  gitHubToken: string;
  jwtToken: string;
}

interface IAuthStrategy {
  auth(user): boolean
}

// Авторизация
class Auth {
  constructor(private strategy: IAuthStrategy) {
  }

  public setStrategy(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  public authUser(user: UserK): boolean {
    return this.strategy.auth(user);
  }
}


// Различные стратегии
class JWTStrategy implements IAuthStrategy {
  auth(user): boolean {
    console.log('jwt auth');
    if (user.jwtToken) return true;
    return false;
  }
}

class GitHubStrategy implements IAuthStrategy {
  auth(user): boolean {
    console.log('git auth');
    if (user.gitHubToken) return true;
    return false;
  }
}

// Usage (динамически можем менять* стратегии)
const user4 = new UserK();
user4.jwtToken = 'token';
const auth4 = new Auth(new JWTStrategy());
console.log(auth4.authUser(user4));
// меняем стратегию
auth4.setStrategy(new GitHubStrategy()); // *
console.log(auth4.authUser(user4));
