import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAdressChangedEvent from "./customer-changed-adress.event";
import CustomerCreatedEvent from "./customer-created.event";
import SendLogWhenCostumerAdressIsChangedHandler from "./handler/send-log-when-customer-adress-is-changed.handle";
import SendLogWhenCostumerIsCreatedHandler from "./handler/send-log-when-customer-is-create.handle";
import SendLogWhenCostumerIsCreatedHandler2 from "./handler/send-log-when-customer-is-create2.handle";

describe("Domain Customer events tests", () => {

    it("should register an event handler Customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCostumerIsCreatedHandler();
    
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
          1
        );
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
      });
      it("should register an event handler Customer change Adress", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCostumerAdressIsChangedHandler();
    
        eventDispatcher.register("CustomerAdressChangedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"].length).toBe(
          1
        );
        expect(
          eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"][0]
        ).toMatchObject(eventHandler);
      });
    
      it("should register multi  event handler Customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCostumerIsCreatedHandler();
        const eventHandler2 = new SendLogWhenCostumerIsCreatedHandler2();
    
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
          2
        );
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandler2);
      });

      it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCostumerIsCreatedHandler();
        const eventHandler2 = new SendLogWhenCostumerIsCreatedHandler2();
    
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
          ).toMatchObject(eventHandler2);
    
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
          1
        );
      });

      
  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCostumerIsCreatedHandler();
    const eventHandler2 = new SendLogWhenCostumerIsCreatedHandler2();
    const eventHandlerAdress = new SendLogWhenCostumerAdressIsChangedHandler();
    
    eventDispatcher.register("CustomerAdressChangedEvent", eventHandlerAdress);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    expect(
        eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"][0]).toMatchObject(
        eventHandlerAdress
      );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
      ).toMatchObject(eventHandler2);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeUndefined();
    expect(
        eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"]
      ).toBeUndefined();
  });
  it("should notify Customer create event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCostumerIsCreatedHandler();
    const eventHandler2 = new SendLogWhenCostumerIsCreatedHandler2();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");


    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
      ).toMatchObject(eventHandler2);


    const customerCreateEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
      adress: "Rua Luffy dama"  
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreateEvent);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

  });
  it("should notify Customer change adress event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerAdress = new SendLogWhenCostumerAdressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandlerAdress, "handle");

    eventDispatcher.register("CustomerAdressChangedEvent", eventHandlerAdress);

    expect(
        eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerAdressChangedEvent"][0]).toMatchObject(
        eventHandlerAdress
      );

    const customerChangeAdressEvent = new CustomerAdressChangedEvent({
      id: "1",
      name: "Customer 1",
      adress: "Rua Luffy dama"  
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerChangeAdressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
 }

 


)