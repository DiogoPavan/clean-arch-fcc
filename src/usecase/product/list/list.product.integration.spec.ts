import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test list product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = new Product("123", "Product1", 12);
    const product2 = new Product("321", "Product2", 12);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const output = {
      products: [{
        id: "123",
        name: "Product1",
        price: 12
      }, {
        id: "321",
        name: "Product2",
        price: 12
      }]
    };

    const result = await usecase.execute({});

    expect(result).toEqual(output);
  });
});
