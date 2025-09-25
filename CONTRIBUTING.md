# 🤝 Guía de Contribución - Big O pizza

¡Gracias por tu interés en contribuir al proyecto Big O pizza! Esta guía te ayudará a participar de manera efectiva en el desarrollo.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestros Compromisos
- Usar un lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas de manera elegante
- Enfocarse en lo que es mejor para la comunidad universitaria

## 🚀 ¿Cómo puedo contribuir?

### 🐛 Reportar Bugs
- Usa la plantilla de issues para bugs
- Incluye pasos para reproducir el problema
- Especifica tu entorno (OS, navegador, versión de Node.js)

### 💡 Sugerir Funcionalidades
- Usa la plantilla de issues para features
- Explica el problema que resuelve la funcionalidad
- Describe la solución propuesta
- Considera alternativas

### 🔧 Contribuir Código
- Corregir bugs reportados
- Implementar nuevas funcionalidades
- Mejorar documentación
- Optimizar rendimiento
- Agregar tests

### 📚 Mejorar Documentación
- Corregir typos o errores
- Agregar ejemplos de uso
- Traducir contenido
- Crear tutoriales

## 🛠️ Configuración del Entorno

### 1. Fork y Clona el Repositorio
```bash
# Fork el repositorio en GitHub, luego clona tu fork
git clone https://github.com/TU-USUARIO/pizza-universitaria.git
cd pizza-universitaria

# Agrega el repositorio original como remote
git remote add upstream https://github.com/USUARIO-ORIGINAL/pizza-universitaria.git
```

### 2. Configurar el Proyecto
```bash
# Navegar al directorio del proyecto
cd workspace/shadcn-ui

# Instalar dependencias
pnpm install
# o npm install / yarn install

# Iniciar servidor de desarrollo
pnpm run dev
```

### 3. Verificar Configuración
```bash
# Ejecutar linter
pnpm run lint

# Crear build de prueba
pnpm run build
```

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama
```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear nueva rama
git checkout -b tipo/descripcion-breve

# Ejemplos:
git checkout -b feature/payment-integration
git checkout -b bugfix/cart-calculation
git checkout -b docs/installation-guide
```

### 2. Tipos de Ramas
- `feature/` - Nuevas funcionalidades
- `bugfix/` - Corrección de bugs
- `hotfix/` - Correcciones urgentes
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Agregar o modificar tests

### 3. Hacer Cambios
```bash
# Hacer cambios en el código
# Probar localmente
pnpm run dev

# Verificar que no hay errores
pnpm run lint
pnpm run build
```

### 4. Commit de Cambios
```bash
# Agregar archivos
git add .

# Commit con mensaje descriptivo
git commit -m "tipo: descripción breve

Descripción más detallada si es necesario.
Explica qué cambios se hicieron y por qué.

Fixes #123" # Si cierra un issue
```

## 📝 Estándares de Código

### Estructura de Archivos
```
src/
├── components/
│   ├── ui/              # Componentes base reutilizables
│   ├── PizzaCustomizer.tsx
│   └── [ComponentName].tsx
├── pages/
│   └── [PageName].tsx
├── services/
│   └── [ServiceName].ts
├── utils/
│   └── [utilityName].ts
└── types/
    └── [typeName].ts
```

### Convenciones de Nomenclatura

#### Archivos y Carpetas
- **Componentes**: PascalCase (`PizzaCustomizer.tsx`)
- **Páginas**: PascalCase (`OrderTracking.tsx`)
- **Utilidades**: camelCase (`geolocation.ts`)
- **Servicios**: PascalCase (`ApiService.ts`)

#### Variables y Funciones
```typescript
// Variables: camelCase
const orderTotal = 150;
const isValidAddress = true;

// Funciones: camelCase
const calculateTotal = (items: CartItem[]) => { ... };
const validateAddress = async (address: string) => { ... };

// Constantes: SCREAMING_SNAKE_CASE
const MAX_PIZZA_TOPPINGS = 15;
const SERVICE_AREA_RADIUS = 5;

// Componentes: PascalCase
const PizzaCustomizer = () => { ... };
```

#### Interfaces y Types
```typescript
// Interfaces: PascalCase con prefijo I (opcional)
interface Product {
  id: string;
  name: string;
  price: number;
}

// Types: PascalCase
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready';
```

### Estilo de Código

#### TypeScript
```typescript
// ✅ Bueno
interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedToppings?: string[];
}

const addToCart = (product: Product, customization?: Customization): void => {
  // Implementación
};

// ❌ Evitar
const addToCart = (product: any, customization: any) => {
  // Sin tipos
};
```

#### React Components
```typescript
// ✅ Bueno - Functional Component con TypeScript
interface PizzaCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ 
  product, 
  onAddToCart, 
  onCustomize 
}) => {
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
};

export default PizzaCard;
```

#### CSS/Tailwind
```typescript
// ✅ Bueno - Clases organizadas y legibles
<div className="
  min-h-screen 
  bg-gradient-to-br from-red-50 to-orange-50
  flex flex-col items-center justify-center
  p-6 text-center
">

// ❌ Evitar - Clases muy largas en una línea
<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center p-6 text-center">
```

### Comentarios y Documentación

```typescript
/**
 * Valida si una dirección está dentro del área de servicio de CUAltos
 * @param address - La dirección de entrega a validar
 * @returns Promise<boolean> - True si la dirección es válida para entrega
 */
export async function validateAddress(address: string): Promise<boolean> {
  // Normalizar dirección para comparación
  const normalizedAddress = address.toLowerCase().trim();
  
  // Verificar ubicaciones específicas del campus
  const hasCampusLocation = CAMPUS_LOCATIONS.some(location => 
    normalizedAddress.includes(location)
  );
  
  return hasCampusLocation;
}
```

## 🔍 Proceso de Pull Request

### 1. Antes de Enviar
```bash
# Verificar que todo funciona
pnpm run dev      # Probar localmente
pnpm run lint     # Sin errores de linting
pnpm run build    # Build exitoso

# Actualizar con cambios recientes
git fetch upstream
git rebase upstream/main
```

### 2. Crear Pull Request

#### Título del PR
```
tipo: descripción breve en imperativo

Ejemplos:
feat: agregar integración con Stripe para pagos
fix: corregir cálculo de precios en carrito personalizado
docs: actualizar guía de instalación con troubleshooting
refactor: optimizar componente PizzaCustomizer
```

#### Descripción del PR
```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🔄 Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe funcionalidad existente)
- [ ] Documentación (cambios solo en documentación)

## 🧪 ¿Cómo se ha probado?
- [ ] Pruebas locales
- [ ] Pruebas en diferentes navegadores
- [ ] Pruebas en móvil/tablet
- [ ] Verificación de lint y build

## 📷 Screenshots (si aplica)
[Agregar screenshots de cambios visuales]

## 📝 Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas complejas
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He verificado que mi fix es efectivo o que mi feature funciona
```

### 3. Revisión de Código

#### Para Revisores
- Verificar que el código sigue los estándares
- Probar la funcionalidad localmente
- Revisar que no se rompa funcionalidad existente
- Verificar que la documentación esté actualizada

#### Para Contribuidores
- Responder a comentarios de manera constructiva
- Hacer cambios solicitados en commits adicionales
- Mantener la conversación profesional y enfocada

## 🐛 Reportar Bugs

### Información Requerida
```markdown
**Describe el bug**
Descripción clara y concisa del problema.

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ve a '...'
2. Haz clic en '....'
3. Desplázate hasta '....'
4. Observa el error

**Comportamiento Esperado**
Descripción clara de lo que esperabas que pasara.

**Screenshots**
Si aplica, agrega screenshots para explicar el problema.

**Información del Entorno:**
- OS: [e.g. Ubuntu 22.04, macOS 13.0, Windows 11]
- Navegador: [e.g. Chrome 118, Firefox 119, Safari 17]
- Versión de Node.js: [e.g. 18.17.0]
- Package Manager: [e.g. pnpm 8.6.0]

**Contexto Adicional**
Cualquier otra información relevante sobre el problema.
```

## 💡 Sugerir Funcionalidades

### Plantilla para Feature Request
```markdown
**¿Tu feature request está relacionado con un problema?**
Descripción clara del problema. Ej: "Me frustra que cuando [...]"

**Describe la solución que te gustaría**
Descripción clara y concisa de lo que quieres que pase.

**Describe alternativas que has considerado**
Descripción de soluciones o features alternativas que has considerado.

**¿Cómo beneficiaría esto a los usuarios de CUAltos?**
Explicar el impacto en estudiantes, profesores o personal del campus.

**Contexto adicional**
Cualquier otra información, screenshots, o ejemplos sobre el feature request.
```

## 🎯 Áreas Prioritarias para Contribuir

### 🔥 Alta Prioridad
- **Integración de Pagos**: Stripe, PayPal, OXXO
- **Autenticación**: Sistema de login/registro
- **Notificaciones Push**: Alertas en tiempo real
- **Tests**: Cobertura de testing

### 🚀 Media Prioridad
- **PWA**: Convertir a Progressive Web App
- **Optimización**: Mejoras de rendimiento
- **Accesibilidad**: Cumplir estándares WCAG
- **Internacionalización**: Soporte multi-idioma

### 💡 Baja Prioridad
- **Temas**: Modo oscuro/claro
- **Animaciones**: Micro-interacciones
- **Analytics**: Integración con Google Analytics
- **SEO**: Optimización para motores de búsqueda

## 📞 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/pizza-universitaria/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/pizza-universitaria/discussions)
- **Email**: desarrollo@cualtos.udg.mx

## 🏆 Reconocimientos

Todos los contribuidores serán reconocidos en:
- README.md del proyecto
- Sección de créditos en la aplicación
- Lista de contribuidores de GitHub

¡Gracias por contribuir a Big O pizza! 🍕❤️