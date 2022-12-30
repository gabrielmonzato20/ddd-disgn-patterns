import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
  await OrderModel.update(
    {
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    },
    {
      where: {
        id: entity.id,
      },

    },
  ).then( async () =>{
    await  OrderItemModel.destroy({where:{order_id: entity.id}})
    entity.items.map(  (item:OrderItem) =>{
       OrderItemModel.create({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id
      })
       
    })
  })
  }
  async find(id: string): Promise<Order> {
    let orderModel:OrderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{model:OrderItemModel}],
        rejectOnEmpty: true,
      });
      console.log(orderModel.toJSON());
      let items :OrderItem[] = [];
    orderModel.items.map(item => items.push(new OrderItem(item.id,item.name,item.price/item.quantity,item.product_id,item.quantity))
    )
    const order : Order = new Order(orderModel.id,orderModel.customer_id,items);
    return order;
    } catch (error) {
      throw new Error("Customer not found");
    } 
  
  }
  async findAll(): Promise<Order[]> {
     const ordersModel = await OrderModel.findAll({include:[{model: OrderItemModel}]});
     let orders : Order[] = [];
     ordersModel.map(orderModel =>{
      let items :OrderItem[] = [];
      orderModel.items.map(item => items.push(new OrderItem(item.id,item.name,item.price/item.quantity,item.product_id,item.quantity))
      )
      const order : Order = new Order(orderModel.id,orderModel.customer_id,items);
      orders.push(order)
     })
     return orders;
  }
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => (
          {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
