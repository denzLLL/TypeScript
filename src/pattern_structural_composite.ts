
// общая логика
abstract class DeliveryItem {
  items: DeliveryItem[] = [];

  addItem(item: DeliveryItem) {
    this.items.push(item);
  }

  getItemPrices(): number {
    return this.items.reduce((acc: number, item: DeliveryItem) => acc += item.getPrice(), 0);
  }

  abstract getPrice(): number;
}


// с доставкой (в данных 3-х классах может находиться куча бизнес логики для соотв-х сущностей)
class DeliveryShop extends DeliveryItem {
  constructor(private deliveryFee: number) {
    super();
  }

  getPrice(): number {
    return this.getItemPrices() + this.deliveryFee;
  }

}

// без доставки
class Package extends DeliveryItem {
  getPrice(): number {
    return this.getItemPrices();
  }
}

// только цена
class Product extends DeliveryItem {
  constructor(private price: number) {
    super();
  }

  getPrice(): number {
    return this.price;
  }
}

const shop = new DeliveryShop(100);
shop.addItem(new Product(1000))

const pack1 = new Package();
pack1.addItem(new Product(1000));
pack1.addItem(new Product(2000));
pack1.addItem(new Product(3000));
shop.addItem(pack1);

const pack2 = new Package();
pack2.addItem(new Product(1000));
shop.addItem(pack2);

// Общая доставка
console.log(shop.getPrice());
