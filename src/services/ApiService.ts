// Mock API Service for Pizza Delivery System
// This simulates backend API calls using localStorage and JSON files

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes?: { name: string; multiplier: number }[];
  crusts?: string[];
  toppings?: { name: string; price: number }[];
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: any[];
  total: number;
  status: string;
  timestamp: string;
  priority?: 'normal' | 'high' | 'urgent';
}

export class ApiService {
  private static readonly ORDERS_KEY = 'pizza_orders';
  
  // Get products from JSON file or return default data
  static async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products.json');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Using default products data');
    }
    
    // Default products if JSON file is not available
    return [
      {
        id: '1',
        name: 'Pizza Margherita',
        description: 'Salsa de tomate, mozzarella fresca, albahaca',
        price: 120,
        category: 'Traditional',
        image: '🍕'
      },
      {
        id: '2',
        name: 'Pizza Pepperoni',
        description: 'Salsa de tomate, mozzarella, pepperoni',
        price: 140,
        category: 'Traditional',
        image: '🍕'
      },
      {
        id: '3',
        name: 'Pizza Hawaiana',
        description: 'Salsa de tomate, mozzarella, jamón, piña',
        price: 150,
        category: 'Traditional',
        image: '🍕'
      },
      {
        id: '4',
        name: 'Pizza Mexicana',
        description: 'Salsa de tomate, mozzarella, jalapeños, chorizo, cebolla',
        price: 160,
        category: 'Traditional',
        image: '🍕'
      },
      {
        id: '5',
        name: 'Pizza Cuatro Quesos',
        description: 'Mozzarella, parmesano, gorgonzola, queso de cabra',
        price: 180,
        category: 'Gourmet',
        image: '🧀'
      },
      {
        id: '6',
        name: 'Pizza Prosciutto',
        description: 'Salsa blanca, mozzarella, prosciutto, rúcula, tomate cherry',
        price: 220,
        category: 'Gourmet',
        image: '🥓'
      },
      {
        id: '7',
        name: 'Pizza Trufa',
        description: 'Salsa blanca, mozzarella, champiñones, aceite de trufa',
        price: 250,
        category: 'Gourmet',
        image: '🍄'
      },
      {
        id: '8',
        name: 'Pizza BBQ',
        description: 'Salsa BBQ, mozzarella, pollo, cebolla morada, cilantro',
        price: 190,
        category: 'Gourmet',
        image: '🍖'
      },
      {
        id: '9',
        name: 'Coca Cola',
        description: 'Refresco de cola 355ml',
        price: 25,
        category: 'Drinks',
        image: '🥤'
      },
      {
        id: '10',
        name: 'Agua Natural',
        description: 'Agua purificada 500ml',
        price: 15,
        category: 'Drinks',
        image: '💧'
      },
      {
        id: '11',
        name: 'Jugo de Naranja',
        description: 'Jugo natural de naranja 300ml',
        price: 30,
        category: 'Drinks',
        image: '🍊'
      }
    ];
  }

  // Get all orders from localStorage
  static async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch('/api/orders.json');
      if (response.ok) {
        const defaultOrders = await response.json();
        const localOrders = this.getLocalOrders();
        return [...defaultOrders, ...localOrders];
      }
    } catch (error) {
      console.log('Using local orders only');
    }
    
    return this.getLocalOrders();
  }

  // Get specific order by ID
  static async getOrder(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(order => order.id === id) || null;
  }

  // Create new order
  static async createOrder(order: Order): Promise<Order> {
    const orders = this.getLocalOrders();
    orders.push(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    return order;
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const orders = this.getLocalOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    }
  }

  // Helper method to get orders from localStorage
  private static getLocalOrders(): Order[] {
    try {
      const ordersJson = localStorage.getItem(this.ORDERS_KEY);
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      return [];
    }
  }

  // Simulate payment processing
  static async processPayment(orderData: any): Promise<{ success: boolean; transactionId?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}`
      };
    } else {
      throw new Error('Payment processing failed');
    }
  }

  // Get delivery time estimate
  static getDeliveryEstimate(address: string): number {
    // Base delivery time: 25-35 minutes
    const baseTime = 25 + Math.floor(Math.random() * 10);
    
    // Add extra time based on distance simulation
    const extraTime = address.toLowerCase().includes('edificio') ? 5 : 0;
    
    return baseTime + extraTime;
  }
}