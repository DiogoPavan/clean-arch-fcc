import CreateProductUseCase from "./create.product.usecase";

const inputA = {
  type: 'a',
  name: 'Product A', 
  price: 20,
}

const inputB = {
  type: 'b',
  name: 'Product B', 
  price: 20,
}

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe('Unit test create product use case', () => {
  it('should create a product with type A', async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(inputA);

    expect(output).toEqual({
      id: expect.any(String),
      name: inputA.name,
      price: inputA.price, 
    })
  });

  it('should create a product with type B', async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(inputB);

    expect(output).toEqual({
      id: expect.any(String),
      name: inputB.name,
      price: 40, 
    })
  });

  it("should thrown an error when name is missing", async () => {
    const input = {
      ...inputA,
      name: ""
    }
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should thrown an error when price is less than zero", async () => {
    const input = {
      ...inputA,
      price: -1
    }
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});