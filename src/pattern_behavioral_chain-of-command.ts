interface IMiddleware {
  next(mid: IMiddleware): IMiddleware;
  handle(request: any): any;
}

abstract class AbstractMiddleware implements IMiddleware {
  private nextMiddleware: IMiddleware

  next(mid: IMiddleware): IMiddleware {
    this.nextMiddleware = mid;
    return mid;
  }

  handle(request: any): any {
    if (this.nextMiddleware) {
      return this.nextMiddleware.handle(request);
    }
    return;
  }
}

class AuthMiddleware extends AbstractMiddleware {
  override handle(request: any): any {
    console.log('AuthMiddleware')
    if (request.userId === 1) {
      return super.handle(request);
    }
    return {error: 'Not authorized'}
  }
}

class ValidateMiddleware extends AbstractMiddleware {
  override handle(request: any): any {
    console.log('ValidateMiddleware')
    if (request.body) {
      return super.handle(request);
    }
    return {error: 'Not body'}
  }
}

class Controller extends AbstractMiddleware {
  override handle(request: any): any {
    console.log('Controller')
    return {success: request}
  }
}

// Usage
const controller = new Controller();
const validate = new ValidateMiddleware();
const auth =  new AuthMiddleware();

auth.next(validate).next(controller)
console.log(auth.handle({ userId: 1, body: 'test test'}));

/*
AuthMiddleware
ValidateMiddleware
Controller
{ success: { userId: 1, body: 'test test' } }
*/
