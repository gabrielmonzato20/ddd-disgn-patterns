import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("it should update the order ", async ()=>{
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
   
    const customer2 = new Customer("1234", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const product2 = new Product("1234", "Product 2", 20);
    await productRepository.create(product2);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const ordemItem2= new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      4
    );

    const orderExpect = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(orderExpect);
    const orderFind = await orderRepository.find(orderExpect.id);
    expect(orderFind).toStrictEqual(orderExpect);
    await orderExpect.changeCustomer(customer2.id);
    await orderExpect.changeItems([ordemItem2]);
    await orderRepository.update(orderExpect);
    const orderFind1 = await orderRepository.find(orderExpect.id)
    console.log(orderExpect)
    console.log(orderFind1)

    expect(orderFind1).toStrictEqual(orderExpect);
  })
it("Should return all orders ",async () => {
  const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const customer2 = new Customer("1234", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const product2 = new Product("1234", "Product 2", 20);
    await productRepository.create(product2);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const ordemItem2= new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      4
    );
    const order = new Order("123", "123", [ordemItem]);
    const order2 = new Order("1234", "1234", [ordemItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order2);
    const listOrder:Order[] = await  orderRepository.findAll();
      expect(listOrder.length).toBe(2);

})

it("Should return one item orders ",async () => {
  const customerRepository = new CustomerRepository();
    const customer = new Customer("1235", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
  
    const productRepository = new ProductRepository();
    const product = new Product("1235", "Product 1", 20);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderExpect = new Order("1235", "1235", [ordemItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(orderExpect);
    const orderFind:Order = await orderRepository.find(orderExpect.id); 
    const listOrder:Order[] = await  orderRepository.findAll(); 
    const orderModel = await OrderModel.findOne({
      where: { id: orderExpect.id },
      include: ["items"],
    });
    expect(orderFind).toStrictEqual(orderExpect);

})
  
});
