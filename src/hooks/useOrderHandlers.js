// Hook personalizado para gerenciar ações de pedidos
export const useOrderHandlers = ({ 
  orders, 
  setOrders, 
  setOpenOrderDialog, 
  setSelectedOrder, 
  setOpenAddOrderDialog,
  newOrder,
  setNewOrder 
}) => {
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleAddOrder = () => {
    setNewOrder({
      customerName: '',
      phone: '',
      items: [],
      observations: ''
    });
    setOpenAddOrderDialog(true);
  };

  const handleAddItemToOrder = () => {
    const newItem = {
      name: '',
      quantity: 1,
      price: 0
    };
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, newItem]
    });
  };

  const handleUpdateOrderItem = (index, field, value) => {
    const updatedItems = newOrder.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleRemoveOrderItem = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleSaveOrder = () => {
    const total = newOrder.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    
    const orderToSave = {
      ...newOrder,
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      total,
      status: 'pending',
      createdAt: new Date().toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    setOrders([...orders, orderToSave]);
    setOpenAddOrderDialog(false);
    setNewOrder({
      customerName: '',
      phone: '',
      items: [],
      observations: ''
    });
  };

  return {
    handleViewOrder,
    handleStatusChange,
    handleAddOrder,
    handleAddItemToOrder,
    handleUpdateOrderItem,
    handleRemoveOrderItem,
    handleSaveOrder
  };
};
