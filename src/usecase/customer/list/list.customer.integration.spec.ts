import { Sequelize } from "sequelize-typescript";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import ListCustomerUseCase from "./list.customer.usecase";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import Address from "../../../domain/customer/value-object/address";

describe("Test list customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new ListCustomerUseCase(customerRepository);

    const customer1 = CustomerFactory.createWithAddress(
      "John Doe",
      new Address("Street 1", 1, "12345", "City")
    );
    
    const customer2 = CustomerFactory.createWithAddress(
      "Jane Doe",
      new Address("Street 2", 2, "123456", "City 2")
    );

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const output = {
      customers: [{
        id: customer1.id,
        name: customer1.name,
        address: {
          street: customer1.Address.street,
          number: customer1.Address.number,
          zip: customer1.Address.zip,
          city: customer1.Address.city,
        },
      }, {
        id: customer2.id,
        name: customer2.name,
        address: {
          street: customer2.Address.street,
          number: customer2.Address.number,
          zip: customer2.Address.zip,
          city: customer2.Address.city,
        }
      }]
    };

    const result = await usecase.execute({});

    expect(result).toEqual(output);
  });
});
