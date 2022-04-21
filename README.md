# BACKEND ECOMMERCE

### **Indice**

- [Rutas Usuario](#rutas-usuario)
- [Rutas Producto](#rutas-producto)
- [Rutas Categoría](#rutas-categoria)
- [Rutas Pedido](#rutas-pedido)
- [Rutas pago](#rutas-pago)

Este proyecto se trata de una tienda virtual o ecommerce para la venta de artículos tecnológicos.

## INSTALACIÓN

Una vez que tengas acceso al repositorio, puedes clonarlo con el comando:

> `git clone url`

Habiendo instalado, debes instalar todas las dependencias del proyecto, para ello, te ubicas dentro de la carpeta del proyecto y ejecutas el comando:

> `npm i`

## **RUTAS USUARIO**

Todas las rutas de usuario se encuentran en **/user**

Las peticiones que se pueden realizar son:

### **POST**

#### **/user/register**

Esta ruta realiza la creación de un nuevo usuario, para ello necesita la información del nuevo usuario por body:

- nombre
- usuario
- contrasena
- email
- pais
- provincia
- direccion
- telefono

Si la información entregada es correcta y se ha creado el usuario, se responderá con un status **_201_** y un json con un atributo **_token_**.

**Ejemplo:**

`{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjo2fSwiaWF0IjoxNjQ0MjcxMjAzLCJleHAiOjE2NDQ2MzEyMDN9.zPTUUZuFGvXIiEhqA4i2idG---eTq_LINsOlL4d8j7g" }`

#### **/user/login**

Esta ruta realiza el login de un usuario ya existente, para ello necesita que se envíen las credenciales por body:

- contrasena
- email

Si las credenciales son correctas, devuelve un token por body, como en la ruta /user/register.

Si no hay un token me devuelve un status **_404_** y el mensaje **_Token not found_**.

Si las credenciales no son válidas, me devuelve un status **_400_** y el mensaje **_Credenciales no validas_**.

### **GET**

#### **/user**

Esta ruta es privada y solo le permite acceder al propietario de la cuenta.

_Requerimientos:_

**_Header:_**

- x-auth-token

Si el token es válido me proporciona un status la información del usuario

[Volver al índice](#indice)

## **RUTAS PRODUCTO**

Todas las rutas producto se encuentran en **/products**

Las peticiones que se pueden realizar son:

### **GET**

Todas las peticiones GET en cualquier ruta de producto son públicas y no requieren ningún **token**

#### **/products**

Si no ha habido ningún error nos devuelve un status **_200_** y por body un **_array_** con todos los productos que estén en la base de datos. Cada producto cuenta con los siguientes campos:

**Tipo Number**

- id
- price
- rate
- count
- cantidad

**Tipo String**

- title
- description
- image
- createdAt
- updatedAt
- category

#### **/products/_:id_**

Si no halla ningún producto con el id especificado devuelve un status **_404_** y el mensaje **_Producto no encontrado_**.

Si halla el producto devolverá toda la información del producto (la misma especificada en la ruta anterior).

#### **/products/category/_:categoryId_**

Si el **id** proporcionado en el parámetro :id se corresponde con una categoría existente y esa categoría ya cuenta con productos registrados, nos devuelve un status **_200_** y un **_array_** con todos los productos pertenecientes a la categoría especificada.

Si la categoría existe pero no tiene productos nos devuelve un status **_404_** y un mensaje **_Ningún producto pertenece a esta categoría_**.

Si la categoría no existe nos devuelve un status **_400_** y el mensaje **_No existe la categoría especificada_**.

### **POST**

#### **/products**

Esta petición es únicamente para el administrador, por lo que se requiere que se envíe por header de la peticion un atributo llamado **x-auth-token** con un string correspondiente al token (el que se sacaría de la localStorage).

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- title
- price
- description
- category
- image
- rate
- count
- cantidad

Si el producto fue creado con éxito, nos devuelve un status **_201_** y por body el producto creado (con todos los campos especificados en la petición GET /products).

Si se ha enviado un title que ya existe en la base de datos, nos devolverá un status **_400_** con el mensaje **_Ya existe un producto con ese nombre (title)_**

### **PUT**

#### **/products/:id**

Esta ruta es privada y sólo permitida para el administrador nos permite actualizar un producto por el id proporcionado por params

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- title
- price
- description
- category
- image
- rate
- count
- cantidad

### **DELETE**

#### **/products/:id**

Esta ruta es privada y sólo permitida para el administrador. Nos permite eliminar un producto por el id proporcionado por params

_Requerimientos:_

**_Header:_**

- x-auth-token

Si el producto se eliminó correctamente nos devuelve un status **_204_** y ningún contenido por body.

Si no se encontró el producto a eliminar, nos devuelve un status **_404_** y el mensaje **_Id no válido_**.

[Volver al índice](#indice)

## **RUTAS CATEGORIA**

Todas las rutas categoria se encuentran en **/categories**

Las peticiones que se pueden realizar son:

### Rutas privadas

#### **POST /categories**

Esta ruta nos permite crear una nueva categoría.

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- nombre

Si la nueva categoría fue creada exitosamente me devuelve un status **_201_** y la categoría creada.

Si le pasamos un nombre repetido, nos devolverá un status **_400_** y el mensaje **_Ya existe la Categoria 'nombre'_**

#### **PUT /categories/update**

Esta ruta nos permite cambiar el nombre de una categoría existente.

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- nombre (Nuevo nombre)
- id (Id de la categoría a modificar)

Si la categoría se actualizó correctamente obtenemos un status **_200_** y el mensaje **_Los datos se actualizaron correctamente_**.

Si el id pasado no se corresponde con ninguna categoría, nos devuelve un status **_404_** y un mensaje **_No data found_**.

#### **DELETE /categories/delete**

Esta ruta nos permite eliminar una categoría existente.

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- id (Id de la categoría a eliminar)

Si la eliminación se realizó exitosamente me devuelve un status **_200_** y el mensaje **_Los datos se borraron correctamente_**.

Si ninguna categoría se corresponde con el id enviado, nos devuelve un status **_404_** y un mensaje **_No data found_**.

### Rutas públicas

#### **GET /categories**

Esta es una ruta pública por lo que no necesita ningún _token_ y acepta una query **nombre** que me entregará una categoría por nombre.

Si la petición no tiene la query **_nombre_** me devuelve un status **_200_** y un array con todas las categorías de la base de datos y su información.

Si la petición lleva una query nombre, por ejemplo _/categories?nombre=tv_, me devuelve un array con todas las categorías que matcheen con el nombre pasado por query.

En ambos casos, si no se encuentra ninguna categoría, me devuelve un status **_404_** y un mensaje de error.

[Volver al índice](#indice)

## **RUTAS PEDIDO**

Todas las rutas de pedido son privadas y se encuentran en **/pedidos**

Las peticiones que se pueden realizar son:

#### **GET /pedidos**

Esta es una ruta para el administrador y me permite obtener todos los pedidos que se han realizado, también es posible filtrar los pedidos por query mediante la fecha de creación.

_Requerimientos:_

**_Header:_**

- x-auth-token

El filtrado por fecha de creación se realiza al recibir dos querys **_desde_** y **_hasta_** que son fechas en formato **YY-MM-DD**. Si encuentra pedidos en ese intervalo de fechas me envía un array con la información de los pedidos, y un status **_200_**. Si no haya pedidos me devuelve un status **_404_** y un mensaje **_No hay pedidos registrados en este periodo_**. Si solo se le envió una query (desde o hasta), devolverá un status **_400_** y el mensaje **_Para filtrar por fecha debe poner tanto una fecha de inicio (desde) como de fin (hasta)_**.

Si no se le pasó ninguna query me devolverá un array con todos los pedidos que se han realizado y un status **_200_**.
Si no hay ningún pedido registrado, devolverá un status **_404_**.

#### **POST /pedidos**

Esta es una ruta para el usuario registrado y me permite realizar un pedido.

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- pedidos

El atributo **_pedidos_** recibido por body es un array con la información de los productos.

**Ejemplo:**

`{ "pedidos": [ {"productoId": 1, "cantidad": 4}, {"productoId": 2, "cantidad": 6}, {"productoId": 3, "cantidad": 10}, {"productoId": 8, "cantidad": 3} ] }`

La petición se procesará de forma que si no halla la cantidad requerida de productos, le entrega todo lo que hay en stock y si no hay nada, no toma en cuenta ese producto para el cálculo del total del pedido.

Si no queda ningún producto de los que desea comprar, se le entregará un status **_400_** y el mensaje **_Ya no quedan productos en stock_**.

Si el pedido se realizó con éxito, le devolverá un status **_200_** un objeto con los campos:

- estado (PENDIENTE)
- productosComprados (array con la información de los productos disponibles para comprar)
- totalCompra (El precio final del pedido)
- pagado (false)

Inicialmente el pedido está en estado PENDIENTE hasta que el administrador manualmente lo marque como COMPLETADO y el campo pagado inicialmente esta en false hasta que se realice el pago respectivo.

#### **PUT /pedidos/:pedidoId**

Esta es una ruta para el administrador y me permite modificar únicamente el **_status_** de un pedido existente.

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- status

El status solo puede tomar los valores indicados: COMPLETADO o PENDIENTE.

**Ejemplo:**

`{ "status": "COMPLETADO" }`

[Volver al índice](#indice)

## **RUTAS PAGO**

#### **POST /pedidos**

El único tipo de petición que admite /pagos es POST y realiza un pago mediante targeta de crédito. Es una ruta privada que requiere autenticación:

_Requerimientos:_

**_Header:_**

- x-auth-token
- Content-type

**_Body:_**

- transaccionId
- pedidoId

Si el pedido ya se encuentra pagado, devolverá un status **_400_** y el mensaje **_El pedido ya está pagado_**.

Si el id del pedido no se corresponde con ningún pedido en la base de datos, devolverá un status **_400_** y el mensaje **_El id del pedido no es válido_**.

Mediante el pedidoId determina el monto a descontar de la cuenta y si el pago se ha realizado exitosamente devuelve un status **_200_** y un objeto con el atributo **_mensaje_** igual a **_Successful Payment_**.

[Volver al índice](#indice)
