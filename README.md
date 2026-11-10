# PANENCEL

## Dependencias a installar
Hay que instalar las dependencias desde la terminal de vs code
estas se instalan dentro de la carpeta de panencel donde esta ubicado el app.tsx
por lo que primero deben de abir una terminal en vs code y ejecutar un cd con la ruta de la carpeta de panencel esto es obligatorio para todos los comandos.

npm install
npm install @supabase/supabase-js @supabase/ssr
npx expo install
npx expo start              # start the dev server (este inicia el proyecto)
npx expo start --android    # inicia el proyecto en el emulador de andrioid studio
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions

## Organización de pantallas y MVC

El proyecto PANENCEL se organiza en una estructura de capas donde cada carpeta tiene una responsabilidad delimitada y las dependencias fluyen en una sola dirección: las pantallas consumen controladores, los controladores consumen repositorios, y los repositorios son los únicos que se comunican con Supabase. 

# Raiz
En la raíz del proyecto se encuentra el archivo App.tsx, que actúa como punto de entrada de la aplicación y como orquestador de la navegación. Este archivo monta los proveedores globales de contexto (AuthProvider y CartProvider), mantiene el estado de la pantalla activa mediante un tipo unión llamado Screen, instancia los controladores necesarios y decide qué pantalla renderizar en función del rol del usuario y del estado de navegación. Adicionalmente, App.tsx contiene los manejadores que cruzan fronteras entre controladores, como la sincronización entre catálogos y productos cuando se guarda o elimina un registro en cualquiera de los dos, ya que ambos comparten la tabla intermedia category_products. También aloja el manejador del botón físico de retroceso en Android mediante BackHandler, que fue una decisión de diseño mantener en este archivo en lugar de extraerlo a un hook independiente. Cualquier modificación a la estructura de navegación, al orden de las pantallas, o a la lógica que conecta dos controladores distintos, debe realizarse aquí.

# Pantallas
La carpeta src/screens contiene todas las pantallas de la aplicación agrupadas por audiencia. Dentro de src/screens/cliente se encuentran las pantallas que utiliza el usuario, Dentro de src/screens/administrador se encuentran las pantallas del rol administrativo, En src/screens de forma directa viven LoginScreen y RegisterScreen, compartidas por ambos roles. Todas las pantallas son componentes puramente presentacionales: reciben datos y callbacks mediante props, no realizan llamadas directas a Supabase, y no importan fixtures. Cuando necesites cambiar la apariencia o el comportamiento visual de una pantalla, ese es el lugar.

# Componentes
La carpeta src/components agrupa los componentes reutilizables de interfaz que se emplean en más de una pantalla. Aquí se encuentran elementos como AppButton, PrimaryButton, ScreenContainer, AdminNav, CardPaymentModal, OrderPreview y QrPlaceholder. La regla para decidir si algo pertenece a esta carpeta es simple: si el componente se utiliza en al menos dos pantallas distintas, debe vivir aquí; si solo se utiliza en una pantalla, se declara localmente dentro de esa pantalla. Esta carpeta no contiene lógica de negocio ni acceso a datos, únicamente presentación y composición visual.

# Controladores
La carpeta src/controllers contiene los hooks personalizados que sostienen el estado reactivo de cada dominio y orquestan las llamadas a los repositorios. Cada controlador expone un objeto con los datos del dominio, los indicadores de carga y error, y las funciones para refrescar, guardar y eliminar. Los controladores actuales son controllercatalogo.ts, controllerproducto.ts, controllerorden.ts y controllerventas.ts. Estos archivos utilizan useState para mantener el estado local, useEffect para disparar la carga inicial, y useCallback para memorizar las funciones que se pasan a las pantallas. Un controlador no dibuja interfaz y no accede directamente a Supabase: delega esas responsabilidades a la pantalla y al repositorio respectivamente. Cuando necesites añadir una nueva operación sobre un dominio existente, como filtrar productos por disponibilidad o calcular un agregado de ventas, esa modificación se realiza en el controlador correspondiente y se expone como una nueva función en el objeto que retorna el hook.

# Repositorio
La carpeta src/repositories contiene las funciones que se comunican directamente con Supabase. Cada archivo corresponde a una entidad del dominio: repositorycatalogos.ts, repositoryproductos.ts, repositoryordenes.ts y repositoryventas.ts. Estas funciones son asíncronas y sin estado, es decir, no utilizan hooks ni mantienen datos en memoria entre llamadas. Su responsabilidad es ejecutar consultas, invocar procedimientos almacenados mediante rpc, y transformar los resultados crudos de la base de datos en los modelos de dominio definidos en src/models. Por ejemplo, repositoryproductos.ts convierte el campo is_available de la tabla products al campo available del modelo Product, y agrega el campo category a partir de un join con la tabla categories. Si en el futuro se cambiara el proveedor de base de datos o se modificara un esquema, esta es la única carpeta que requeriría cambios, ya que el resto del proyecto consume los modelos de dominio y no las estructuras crudas de la base.

# Modelos
La carpeta src/models contiene las definiciones de tipos que representan las entidades del dominio de la aplicación: producto.ts, catalogo.ts, pedido.ts, user.ts, periodo.ts y resultado-autenticacion.ts. Estos archivos contienen únicamente interfaces y tipos de TypeScript, sin lógica ejecutable. Su función es servir como contrato entre las capas: los repositorios producen objetos que cumplen con estos tipos, los controladores los almacenan, y las pantallas los consumen. Cualquier cambio a la forma de un dato del dominio debe reflejarse primero en el modelo y luego propagarse a las capas que lo consumen, momento en el cual TypeScript señalará los puntos que requieran actualización.

# Context
La carpeta src/context contiene los dos proveedores de estado global de la aplicación: AuthContext.tsx y CartContext.tsx. A diferencia de los controladores, que mantienen estado local a una pantalla, estos proveedores mantienen estado que debe ser accesible desde cualquier punto de la aplicación. AuthContext gestiona la sesión del usuario: expone el usuario autenticado, el estado de carga inicial, las funciones de login, registro y cierre de sesión, y sincroniza el estado con Supabase Auth mediante onAuthStateChange. CartContext gestiona el carrito de compras: expone las líneas del carrito, el total, el contador de artículos, y las funciones para agregar, quitar y vaciar productos. Ambos proveedores se montan una sola vez en App.tsx, por encima de cualquier pantalla, y se consumen mediante los hooks useAuth y useCart. Esta carpeta debe permanecer separada de controllers porque su naturaleza es distinta: un controlador se instancia por pantalla, mientras que estos contextos son singletons a nivel de aplicación.

# Supabase
La carpeta src/supabase contiene la infraestructura de conexión con el backend. El archivo client.ts crea una única instancia del cliente de Supabase configurada con AsyncStorage para persistencia de sesión, autoRefreshToken para renovación automática de tokens, y detectSessionInUrl deshabilitado porque es una aplicación móvil. También exporta la función requireSupabase, que lanza una excepción descriptiva si el cliente no pudo inicializarse por falta de variables de entorno. El archivo database.types.ts contiene los tipos autogenerados del esquema de la base de datos y no debe editarse manualmente; se regenera mediante Supabase CLI cuando cambia el esquema. Los archivos SQL de referencia del esquema también pueden residir aquí, aunque conviene renombrarlos con extensión .sql. Esta carpeta es infraestructura pura y ningún archivo de negocio debería modificarla.

# fixtures (Se borrara a largo plazo)
La carpeta src/fixtures contiene datos de ejemplo temporales que sustituyen a las consultas reales mientras algunas funcionalidades no están conectadas a Supabase. Actualmente alberga orders.ts con pedidos de demostración, mock.ts con datos de ventas por periodo, y mockData.ts con un usuario invitado. Estos datos son consumidos exclusivamente por los repositorios correspondientes, nunca directamente por las pantallas, y deben eliminarse en el momento en que cada funcionalidad migre a Supabase. Cuando migres pedidos, la eliminación de fixtures/orders.ts debe ir acompañada de la modificación de repositoryordenes.listOrders para consultar la tabla orders, y de la eliminación del texto informativo en OrdersScreen que advierte sobre datos de demostración.

# Theme
La carpeta src/theme contiene la definición centralizada de colores, tamaños de fuente, radios de borde y espaciados utilizados en toda la aplicación. Los componentes y pantallas importan estos valores en lugar de declarar literales, lo que garantiza consistencia visual y permite cambiar la identidad visual del proyecto desde un solo archivo. No contiene lógica ni estado.
