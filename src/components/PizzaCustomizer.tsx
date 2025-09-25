import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

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

interface PizzaCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onComplete: (customization: any) => void;
}

export default function PizzaCustomizer({ isOpen, onClose, product, onComplete }: PizzaCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCrust, setSelectedCrust] = useState('');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Default options
  const defaultSizes = [
    { name: 'Personal (20cm)', multiplier: 1 },
    { name: 'Mediana (25cm)', multiplier: 1.5 },
    { name: 'Familiar (30cm)', multiplier: 2 }
  ];

  const defaultCrusts = [
    'Masa Tradicional',
    'Masa Delgada',
    'Masa Gruesa',
    'Masa Integral'
  ];

  const defaultToppings = [
    { name: 'Pepperoni Extra', price: 15 },
    { name: 'Champiñones', price: 10 },
    { name: 'Pimientos', price: 8 },
    { name: 'Cebolla', price: 8 },
    { name: 'Aceitunas', price: 12 },
    { name: 'Jamón', price: 15 },
    { name: 'Salchicha', price: 15 },
    { name: 'Piña', price: 10 },
    { name: 'Tomate Cherry', price: 12 },
    { name: 'Queso Extra', price: 20 },
    { name: 'Jalapeños', price: 8 },
    { name: 'Tocino', price: 18 },
    { name: 'Pollo', price: 20 },
    { name: 'Carne Molida', price: 22 },
    { name: 'Anchoas', price: 15 }
  ];

  useEffect(() => {
    if (product && isOpen) {
      // Set default selections
      const sizes = product.sizes || defaultSizes;
      const crusts = product.crusts || defaultCrusts;
      
      setSelectedSize(sizes[0]?.name || '');
      setSelectedCrust(crusts[0] || '');
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [product, isOpen]);

  const calculateTotalPrice = () => {
    if (!product) return 0;

    const sizes = product.sizes || defaultSizes;
    const toppings = product.toppings || defaultToppings;
    
    const sizeMultiplier = sizes.find(s => s.name === selectedSize)?.multiplier || 1;
    const basePrice = product.price * sizeMultiplier;
    
    const toppingsPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = toppings.find(t => t.name === toppingName);
      return total + (topping?.price || 0);
    }, 0);

    return (basePrice + toppingsPrice) * quantity;
  };

  const handleToppingToggle = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleComplete = () => {
    const customization = {
      size: selectedSize,
      crust: selectedCrust,
      toppings: selectedToppings,
      quantity,
      totalPrice: calculateTotalPrice()
    };
    
    onComplete(customization);
  };

  const handleClose = () => {
    setSelectedSize('');
    setSelectedCrust('');
    setSelectedToppings([]);
    setQuantity(1);
    onClose();
  };

  if (!product) return null;

  const sizes = product.sizes || defaultSizes;
  const crusts = product.crusts || defaultCrusts;
  const toppings = product.toppings || defaultToppings;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-3xl">{product.image}</span>
            <div>
              <h3 className="text-xl font-bold">Personalizar {product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Personaliza tu pizza a tu gusto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Size Selection */}
          <div>
            <h4 className="font-semibold mb-3">Tamaño *</h4>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="grid grid-cols-1 gap-3">
                {sizes.map((size) => (
                  <div key={size.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.name} id={size.name} />
                    <Label htmlFor={size.name} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>{size.name}</span>
                        <span className="font-semibold text-red-600">
                          ${(product.price * size.multiplier).toFixed(2)}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Crust Selection */}
          <div>
            <h4 className="font-semibold mb-3">Tipo de Masa *</h4>
            <RadioGroup value={selectedCrust} onValueChange={setSelectedCrust}>
              <div className="grid grid-cols-2 gap-3">
                {crusts.map((crust) => (
                  <div key={crust} className="flex items-center space-x-2">
                    <RadioGroupItem value={crust} id={crust} />
                    <Label htmlFor={crust} className="cursor-pointer">
                      {crust}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Toppings Selection */}
          <div>
            <h4 className="font-semibold mb-3">
              Ingredientes Adicionales 
              <span className="text-sm font-normal text-gray-600 ml-2">
                (Opcional - {selectedToppings.length} seleccionados)
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {toppings.map((topping) => (
                <div key={topping.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={topping.name}
                    checked={selectedToppings.includes(topping.name)}
                    onCheckedChange={() => handleToppingToggle(topping.name)}
                  />
                  <Label htmlFor={topping.name} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{topping.name}</span>
                      <span className="text-sm font-semibold text-green-600">
                        +${topping.price}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quantity Selection */}
          <div>
            <h4 className="font-semibold mb-3">Cantidad</h4>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pizza base ({selectedSize}):</span>
                  <span>
                    ${(product.price * (sizes.find(s => s.name === selectedSize)?.multiplier || 1)).toFixed(2)}
                  </span>
                </div>
                {selectedToppings.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Ingredientes adicionales:</span>
                    <span>
                      +${selectedToppings.reduce((total, toppingName) => {
                        const topping = toppings.find(t => t.name === toppingName);
                        return total + (topping?.price || 0);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {quantity > 1 && (
                  <div className="flex justify-between text-sm">
                    <span>Cantidad:</span>
                    <span>x{quantity}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-red-600">${calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!selectedSize || !selectedCrust}
            className="bg-red-600 hover:bg-red-700"
          >
            Agregar al Carrito - ${calculateTotalPrice().toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}