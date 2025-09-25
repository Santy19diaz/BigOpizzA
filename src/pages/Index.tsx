import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ShoppingCart, Plus, Minus, MapPin, Clock, Phone, Star } from 'lucide-react';
import PizzaCustomizer from '@/components/PizzaCustomizer';
import OrderTracking from '@/components/OrderTracking';
import KitchenDashboard from '@/components/KitchenDashboard';
import { ApiService } from '@/services/ApiService';
import { validateAddress } from '@/utils/geolocation';

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

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedCrust?: string;
  selectedToppings?: string[];
  customPrice?: number;
}

export default function PizzaUniversitaria() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [currentOrder, setCurrentOrder] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await ApiService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    }
  };

  const addToCart = (product: Product, customization?: any) => {
    const existingItem = cart.find(item =>
      item.id === product.id &&
      JSON.stringify(item.selectedToppings) === JSON.stringify(customization?.toppings) &&
      item.selectedSize === customization?.size &&
      item.selectedCrust === customization?.crust
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        selectedSize: customization?.size,
        selectedCrust: customization?.crust,
        selectedToppings: customization?.toppings,
        customPrice: customization?.totalPrice
      };
      setCart([...cart, newItem]);
    }
    toast.success('Producto agregado al carrito');
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(index);
      return;
    }
    setCart(cart.map((item, i) =>
      i === index ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.customPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCustomize = (product: Product) => {
    setSelectedProduct(product);
    setIsCustomizing(true);
  };

  const handleCustomizationComplete = (customization: any) => {
    if (selectedProduct) {
      addToCart(selectedProduct, customization);
    }
    setIsCustomizing(false);
    setSelectedProduct(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!orderData.name || !orderData.phone || !orderData.address) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validate address
    const isValidAddress = await validateAddress(orderData.address);
    if (!isValidAddress) {
      toast.error('La dirección no está en nuestra área de servicio (Centro Universitario de los Altos)');
      return;
    }

    try {
      const order = {
        id: Date.now().toString(),
        customerName: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        notes: orderData.notes,
        items: cart,
        total: getTotalPrice(),
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      await ApiService.createOrder(order);
      setCurrentOrder(order.id);
      setCart([]);
      setIsCheckingOut(false);
      setActiveTab('tracking');
      toast.success('¡Pedido realizado con éxito!');
    } catch (error) {
      toast.error('Error al procesar el pedido');
    }
  };

  const categoryProducts = (category: string) =>
    products.filter(product => product.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🍕 Pizza Universitaria</h1>
              <p className="text-red-100">Centro Universitario de los Altos - Tepatitlán</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-100">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Zona de entrega: CUAltos</span>
              </div>
              <div className="flex items-center space-x-2 text-red-100">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Abierto: 08:00 - 20:00</span>
              </div>
              <div className="flex items-center space-x-2 text-red-100">
                <Phone className="h-4 w-4" />
                <span className="text-sm">378-782-8000</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="menu">Menú</TabsTrigger>
              <TabsTrigger value="cart" className="relative">
                Carrito
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
              <TabsTrigger value="kitchen">Cocina</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold mb-4">¡Las mejores pizzas de Tepatitlán!</h2>
              <p className="text-xl text-red-100 mb-6">Entrega rápida en el Campus Universitario</p>
              <div className="flex justify-center space-x-8 text-red-100">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span>Ingredientes frescos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Entrega en 30 min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Solo en CUAltos</span>
                </div>
              </div>
            </div>

            {/* Traditional Pizzas */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">🍕 Pizzas Tradicionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts('Traditional').map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <img
                          src={`/images/${product.image}`}
                          alt={product.name}
                          className="w-200 h-200 object-contain rounded-lg"
                        />
                      </div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-xl font-bold text-red-600">${product.price}</span>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCustomize(product)}
                        >
                          Personalizar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Gourmet Pizzas */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">👨‍🍳 Pizzas Gourmet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts('Gourmet').map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow border-orange-200">
                    <CardHeader>
                      <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <img
                          src={`/images/${product.image}`}
                          alt={product.name}
                          className="w-200 h-200 object-contain rounded-lg"
                        />
                      </div>
                      <CardTitle className="text-lg flex items-center">
                        {product.name}
                        <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                          Gourmet
                        </Badge>
                      </CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-xl font-bold text-orange-600">${product.price}</span>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCustomize(product)}
                        >
                          Personalizar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Drinks */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">🥤 Bebidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryProducts('Drinks').map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4">
                        <img
                          src={`/images/${product.image}`}
                          alt={product.name}
                          className="w-200 h-200 object-contain rounded-lg"
                        />
                      </div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">${product.price}</span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Tu Carrito</h2>
              <Button
                variant="outline"
                onClick={() => setActiveTab('menu')}
              >
                Continuar comprando
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-500 mb-6">Agrega algunas deliciosas pizzas para comenzar</p>
                <Button onClick={() => setActiveTab('menu')} className="bg-red-600 hover:bg-red-700">
                  Ver Menú
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                            <img
                              src={`/images/${item.image}`}
                              alt={item.name}
                              className="w-200 h-200 object-contain rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.selectedSize && (
                              <p className="text-sm text-gray-600">Tamaño: {item.selectedSize}</p>
                            )}
                            {item.selectedCrust && (
                              <p className="text-sm text-gray-600">Masa: {item.selectedCrust}</p>
                            )}
                            {item.selectedToppings && item.selectedToppings.length > 0 && (
                              <p className="text-sm text-gray-600">
                                Ingredientes: {item.selectedToppings.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${((item.customPrice || item.price) * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen del Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Entrega:</span>
                        <span className="text-green-600">Gratis</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Dialog open={isCheckingOut} onOpenChange={setIsCheckingOut}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            Proceder al Pago
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Información de Entrega</DialogTitle>
                            <DialogDescription>
                              Completa tus datos para procesar el pedido
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Nombre completo *</Label>
                              <Input
                                id="name"
                                value={orderData.name}
                                onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                                placeholder="Tu nombre completo"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Teléfono *</Label>
                              <Input
                                id="phone"
                                value={orderData.phone}
                                onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                                placeholder="378-123-4567"
                              />
                            </div>
                            <div>
                              <Label htmlFor="address">Dirección en CUAltos *</Label>
                              <Textarea
                                id="address"
                                value={orderData.address}
                                onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                                placeholder="Edificio, aula, o punto de referencia en el campus"
                              />
                            </div>
                            <div>
                              <Label htmlFor="notes">Notas adicionales</Label>
                              <Textarea
                                id="notes"
                                value={orderData.notes}
                                onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                                placeholder="Instrucciones especiales..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleCheckout}
                              className="w-full bg-red-600 hover:bg-red-700"
                            >
                              Confirmar Pedido - ${getTotalPrice().toFixed(2)}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Order Tracking Tab */}
          <TabsContent value="tracking">
            <OrderTracking orderId={currentOrder} />
          </TabsContent>

          {/* Kitchen Dashboard Tab */}
          <TabsContent value="kitchen">
            <KitchenDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Pizza Customizer Dialog */}
      <PizzaCustomizer
        isOpen={isCustomizing}
        onClose={() => setIsCustomizing(false)}
        product={selectedProduct}
        onComplete={handleCustomizationComplete}
      />
    </div>
  );
}