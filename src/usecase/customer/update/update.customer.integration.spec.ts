import { Sequelize } from "sequelize-typescript";
import Address from "../../../domain/customer/value-object/address";
import Customer from "../../../domain/customer/entity/customer";
import UpdateCustomerUseCase from "./update.customer.usecase";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
describe("Test update customer use case", () => {
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

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);

    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const input = {
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated",
      },
    };

    const output = {
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated",
      },
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });
});
