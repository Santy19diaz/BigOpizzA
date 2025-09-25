import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Phone, CheckCircle, Truck, ChefHat, Timer } from 'lucide-react';
import { ApiService } from '@/services/ApiService';

interface OrderTrackingProps {
  orderId?: string | null;
}

export default function OrderTracking({ orderId: propOrderId }: OrderTrackingProps) {
  const [orderId, setOrderId] = useState(propOrderId || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propOrderId) {
      setOrderId(propOrderId);
      trackOrder(propOrderId);
    }
  }, [propOrderId]);

  const trackOrder = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const orderData = await ApiService.getOrder(id);
      setOrder(orderData);
    } catch (err) {
      setError('Pedido no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = () => {
    trackOrder(orderId);
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendiente', progress: 0, color: 'bg-yellow-500', icon: Timer },
      confirmed: { label: 'Confirmado', progress: 25, color: 'bg-blue-500', icon: CheckCircle },
      preparing: { label: 'Preparando', progress: 50, color: 'bg-orange-500', icon: ChefHat },
      baking: { label: 'Horneando', progress: 75, color: 'bg-red-500', icon: Timer },
      ready: { label: 'Listo', progress: 90, color: 'bg-green-500', icon: CheckCircle },
      delivered: { label: 'Entregado', progress: 100, color: 'bg-green-600', icon: Truck }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedTime = (status: string) => {
    const timeMap = {
      pending: '5 min',
      confirmed: '20-25 min',
      preparing: '15-20 min',
      baking: '10-15 min',
      ready: '5-10 min',
      delivered: 'Completado'
    };
    return timeMap[status as keyof typeof timeMap] || '25-30 min';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seguimiento de Pedido</h2>
        <p className="text-gray-600">Rastrea tu pedido en tiempo real</p>
      </div>

      {!order && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Buscar Pedido</CardTitle>
            <CardDescription>
              Ingresa tu número de pedido para ver el estado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="orderId">Número de Pedido</Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ej: 1694123456789"
              />
            </div>
            <Button 
              onClick={handleTrack} 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading || !orderId}
            >
              {loading ? 'Buscando...' : 'Rastrear Pedido'}
            </Button>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {order && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Pedido #{order.id}</span>
                    <Badge className={`${getStatusInfo(order.status).color} text-white`}>
                      {getStatusInfo(order.status).label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Realizado el {formatTime(order.timestamp)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tiempo estimado</p>
                  <p className="font-semibold text-red-600">
                    {getEstimatedTime(order.status)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={getStatusInfo(order.status).progress} className="h-3" />
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                  {['pending', 'confirmed', 'preparing', 'baking', 'ready', 'delivered'].map((status, index) => {
                    const statusInfo = getStatusInfo(status);
                    const StatusIcon = statusInfo.icon;
                    const isActive = ['pending', 'confirmed', 'preparing', 'baking', 'ready', 'delivered']
                      .indexOf(order.status) >= index;
                    
                    return (
                      <div key={status} className={`flex flex-col items-center space-y-2 ${
                        isActive ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? statusInfo.color : 'bg-gray-200'
                        } text-white`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">{statusInfo.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-gray-600">{order.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <p className="text-gray-600">{order.phone}</p>
              </div>
              {order.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Notas:</strong> {order.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600">
                            {item.selectedSize}
                            {item.selectedToppings && item.selectedToppings.length > 0 && 
                              ` + ${item.selectedToppings.join(', ')}`
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">x{item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        ${((item.customPrice || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setOrder(null);
                setOrderId('');
              }}
            >
              Rastrear Otro Pedido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}