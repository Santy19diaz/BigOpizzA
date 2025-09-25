import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Clock, User, MapPin, Phone, ChefHat, Timer, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/ApiService';

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

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ApiService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ApiService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      toast.success(`Pedido ${orderId} actualizado a: ${getStatusLabel(newStatus)}`);
    } catch (error) {
      toast.error('Error al actualizar el pedido');
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      baking: 'Horneando',
      ready: 'Listo',
      delivered: 'Entregado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      preparing: 'bg-orange-100 text-orange-800 border-orange-300',
      baking: 'bg-red-100 text-red-800 border-red-300',
      ready: 'bg-green-100 text-green-800 border-green-300',
      delivered: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      normal: 'border-l-blue-400',
      high: 'border-l-orange-400',
      urgent: 'border-l-red-500'
    };
    return colorMap[priority as keyof typeof colorMap] || 'border-l-gray-300';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getTimeElapsed = (timestamp: string) => {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'baking',
      baking: 'ready',
      ready: 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['delivered'].includes(order.status);
    return order.status === filter;
  });

  const activeOrders = orders.filter(order => !['delivered'].includes(order.status));
  const completedToday = orders.filter(order => order.status === 'delivered').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard de Cocina</h2>
          <p className="text-gray-600">Gestión de pedidos en tiempo real</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{activeOrders.length}</p>
            <p className="text-sm text-gray-600">Activos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{completedToday}</p>
            <p className="text-sm text-gray-600">Completados</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar pedidos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pedidos</SelectItem>
            <SelectItem value="active">Pedidos activos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="baking">Horneando</SelectItem>
            <SelectItem value="ready">Listos</SelectItem>
            <SelectItem value="delivered">Entregados</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={loadOrders}
          size="sm"
        >
          Actualizar
        </Button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay pedidos</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'No hay pedidos en el sistema' : `No hay pedidos con estado: ${getStatusLabel(filter)}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className={`border-l-4 ${getPriorityColor(order.priority || 'normal')} hover:shadow-lg transition-shadow`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>#{order.id}</span>
                    {getPriorityIcon(order.priority || 'normal')}
                  </CardTitle>
                  <Badge className={`${getStatusColor(order.status)} border`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <Timer className="h-4 w-4" />
                  <span>Hace {getTimeElapsed(order.timestamp)}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600">{order.address}</span>
                  </div>
                  {order.notes && (
                    <div className="bg-yellow-50 p-2 rounded text-sm">
                      <strong>Notas:</strong> {order.notes}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Productos:</h4>
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{item.image}</span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500">
                              {item.selectedSize}
                              {item.selectedToppings && item.selectedToppings.length > 0 && 
                                ` + ${item.selectedToppings.slice(0, 2).join(', ')}${item.selectedToppings.length > 2 ? '...' : ''}`
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-medium">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total and Actions */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-red-600">
                    ${order.total?.toFixed(2)}
                  </span>
                  {order.status !== 'delivered' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status) || 'delivered')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {order.status === 'ready' ? (
                        <>
                          <Truck className="h-4 w-4 mr-1" />
                          Entregar
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Siguiente
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}