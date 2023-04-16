
class KVDatabase {
  private  db: Map<string, string> = new Map();

  save(key: string, value: string) {
    this.db.set(key, value);
  }

}

class PersistentDB {
  savePersistent(data: Object) {
    console.log(data);
  }
}

// Adapter
class PersistentDBAdapter extends KVDatabase{
  constructor(public dataBase: PersistentDB) {
    super();
  }

  override save(key: string, value: string) {
    this.dataBase.savePersistent({
      key,
      value
    })
  }

}

// клиентский код, кот умеет работать только с KVDatabase
function run(base: KVDatabase) {
  base.save('key1', 'value1');
}

// Usage (PersistentDB - дб с которой мы хотим работать )
run(new PersistentDBAdapter(new PersistentDB()))
