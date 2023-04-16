
// 1-й подход

// интерфейс общей страховки
interface IInsurance {
  id: number;
  status: string;

  setVehicle(vehicle: any): void;
  submit(): Promise<boolean>;
}


class TFInsurance implements IInsurance {
  id: number;
  status: string;

  private vehicle: any;

  setVehicle(vehicle: any): void {
    this.vehicle = vehicle;
  }

  async submit(): Promise<any> {
    const res = await fetch('', {
      method: 'POST',
      body: JSON.stringify({vehicle: this.vehicle})
    });
    const data = await res.json();
    return  data.isSuccess;
  }
}

class ABInsurance implements IInsurance {
  id: number;
  status: string;

  private vehicle: any;

  setVehicle(vehicle: any): void {
    this.vehicle = vehicle;
  }

  async submit(): Promise<boolean> {
    const res = await fetch('ab', {
      method: 'POST',
      body: JSON.stringify({vehicle: this.vehicle})
    });
    const data = await res.json();
    return  data.isABSuccess;
  }
}


// factory (InsuranceFactory abstract см. скрин):

abstract class InsuranceFactory {
  db: any;

  abstract createInsurance(): IInsurance;

  saveHistory(ins: IInsurance) {
    // this.db.save(ins.id, ins.status)
  }
}

// фабрика для TFInsurance
class TFInsuranceFactory extends InsuranceFactory {
  createInsurance(): TFInsurance {
    return new TFInsurance();
  }
}


class ABInsuranceFactory extends InsuranceFactory {
  createInsurance(): ABInsurance {
    return new ABInsurance();
  }
}

// использование:
const ifInsuranceFactory = new TFInsuranceFactory(); // получаем фабрику с конкретной реализацией
const ins = ifInsuranceFactory.createInsurance()
ifInsuranceFactory.saveHistory(ins);


// 2-й подход - делаем одну фабрику и создаем в зависимости от параметра
const INSURANCE_TYPE = {
  tf: TFInsurance,
  ab: ABInsurance
}

type IT = typeof INSURANCE_TYPE;

class InsuranceFactoryAlternative {
  db: any;

  createInsurance<T extends keyof IT>(type: T): IT[T] {
    return INSURANCE_TYPE[type]
  }

  saveHistory(ins: IInsurance) {
    // this.db.save(ins.id, ins.status)
  }
}

const insuranceFactoryAlt = new InsuranceFactoryAlternative();
const ins2 = new (insuranceFactoryAlt.createInsurance('tf'))();
insuranceFactoryAlt.saveHistory(ins2);






