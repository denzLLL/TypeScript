

// singleton:

class MyMap {
  private static instance: MyMap;

  map: Map<number, string> = new Map();

  private constructor() {
  }

  public static get(): MyMap {
    if (!MyMap.instance) {
      MyMap.instance = new MyMap();
    }

    return MyMap.instance
  }

  clean() {
    this.map = new Map();
  }

}


// Usage:
class Service1 {
  addMap(key: number, value: string) {
    const myMap = MyMap.get();
    myMap.map.set(key, value);
  }
}

class Service2 {
  getKey(key: number) {
    const myMap = MyMap.get();
    console.log(myMap.map.get(key));
  }
}

new Service1().addMap(1, 'test')
new Service2().getKey(1);






