# Sistema de Gestión de Inventario (Mini Inventory System)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%20LTS-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker%20Compose-v2.x-2496ED.svg)](https://www.docker.com/)

Solución full-stack desarrollada para la prueba técnica de **Desarrollador/a Full Stack Junior** en **Technology Factory Consulting**. 

La aplicación permite la gestión integral del ciclo de vida (CRUD) de un catálogo de productos en tiempo real, integrando frontend en React, backend en Spring Boot, base de datos relacional PostgreSQL y orquestación unificada mediante Docker Compose.

---

## 📋 Tabla de Contenidos

1. [Arquitectura y Estructura del Proyecto](#-arquitectura-y-estructura-del-proyecto)
2. [Análisis: ¿Monorepo o Repositorios Independientes?](#-análisis-monorepo-vs-repositorios-independientes)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instrucciones de Despliegue con Docker Compose](#-instrucciones-de-despliegue-con-docker-compose)
5. [URLs y Puertos de Acceso](#-urls-y-puertos-de-acceso)
6. [Colección de Endpoints de la API REST](#-colección-de-endpoints-de-la-api-rest)
7. [Decisiones Técnicas y Buenas Prácticas](#-decisiones-técnicas-y-buenas-prácticas)
8. [Ejecución en Entorno Local (Sin Docker)](#-ejecución-en-entorno-local-sin-docker)
9. [Pruebas Automatizadas](#-pruebas-automatizadas)

---

## 🏗 Arquitectura y Estructura del Proyecto

El proyecto implementa una arquitectura en capas desacoplada con separación estricta de responsabilidades:

```text
Inventory-system/
├── docker-compose.yml              # Orquestación de servicios (Database, Backend, Frontend)
├── README.md                       # Documentación principal de la solución
├── .gitignore                      # Exclusiones de control de versiones
│
├── database/                       # Recursos de Base de Datos
│   └── init.sql                    # Script DDL/DML de inicialización y datos de muestra
│
├── backend/                        # Backend: Java 17 + Spring Boot 3.3.4
│   ├── Dockerfile                  # Multi-stage build (Maven -> Eclipse Temurin JRE 17)
│   ├── .dockerignore
│   ├── pom.xml                     # Gestión de dependencias Maven
│   └── src/
│       ├── main/
│       │   ├── java/com/techfactory/inventory/
│       │   │   ├── InventoryApplication.java       # Punto de entrada Spring Boot
│       │   │   ├── config/                         # Configuraciones de CORS y OpenAPI
│       │   │   │   ├── CorsConfig.java
│       │   │   │   └── OpenApiConfig.java
│       │   │   ├── controller/                     # Controladores REST (@RestController)
│       │   │   │   └── ProductController.java
│       │   │   ├── dto/                            # Data Transfer Objects y validaciones
│       │   │   │   ├── ProductRequestDto.java
│       │   │   │   └── ProductResponseDto.java
│       │   │   ├── entity/                         # Entidades JPA (@Entity)
│       │   │   │   └── Product.java
│       │   │   ├── exception/                      # Manejo global de excepciones (@ControllerAdvice)
│       │   │   │   ├── ErrorResponse.java
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   └── ResourceNotFoundException.java
│       │   │   ├── repository/                     # Persistencia Spring Data JPA
│       │   │   │   └── ProductRepository.java
│       │   │   └── service/                        # Capa de lógica de negocio y contratos
│       │   │       ├── ProductService.java
│       │   │       └── impl/
│       │   │           └── ProductServiceImpl.java
│       │   └── resources/
│       │       └── application.yml                 # Variables y propiedades de configuración
│       └── test/                                   # Pruebas unitarias y de integración
│           └── java/com/techfactory/inventory/
│               ├── controller/
│               │   └── ProductControllerTest.java  # Pruebas MockMvc del controlador
│               └── service/
│                   └── ProductServiceTest.java     # Pruebas Mockito del servicio
│
└── frontend/                       # Frontend: React 18 + Vite + Tailwind CSS
    ├── Dockerfile                  # Multi-stage build (Node 22 -> Nginx Alpine)
    ├── .dockerignore
    ├── nginx.conf                  # Servidor web Nginx con fallback SPA y proxy
    ├── package.json                # Dependencias de npm
    ├── vite.config.js              # Configuración de empaquetado Vite
    ├── tailwind.config.js          # Configuración de diseño y colores
    ├── index.html
    └── src/
        ├── main.jsx                # Punto de entrada React
        ├── App.jsx                 # Estado principal y orquestación visual
        ├── index.css               # Estilos globales y utilidades Tailwind
        ├── services/
        │   └── productService.js   # Cliente HTTP Axios para la API REST
        └── components/
            ├── Navbar.jsx          # Barra superior institucional
            ├── StatsOverview.jsx   # Métricas y KPIs en tiempo real
            ├── ProductTable.jsx    # Tabla reactiva con búsqueda y filtros
            ├── ProductFormModal.jsx# Formulario Crear/Editar con validación visual
            ├── DeleteConfirmModal.jsx # Confirmación de seguridad previa a eliminación
            └── AlertToast.jsx      # Notificaciones flotantes de estado
```

---

## 🔍 Análisis: ¿Monorepo vs Repositorios Independientes?

Para este requerimiento técnico, se optó por una arquitectura **Monorepo** por las siguientes razones determinantes:

1. **Requisito de comando único:** Las especificaciones exigen que toda la solución se levante ejecutando `docker compose up --build`. Un monorepo permite que el archivo `docker-compose.yml` en la raíz acceda a los contextos `./backend`, `./frontend` y `./database` de forma directa sin requerir clonaciones secundarias ni submódulos de Git.
2. **Evaluación fluida y sin fricción:** El evaluador técnico puede clonar un único repositorio público, inspeccionar el historial cronológico de commits y verificar la aplicación inmediatamente.
3. **Coherencia de versionado:** Garantiza que los contratos de la API REST (DTOs, nombres de campos, endpoints) y el frontend estén sincronizados en el mismo commit.

---

## ⚙️ Requisitos Previos

Para ejecutar la solución en cualquier sistema operativo (Windows, macOS o Linux), únicamente se requiere:

- **Docker Desktop** (versión 24 o superior) con **Docker Compose v2** habilitado y en ejecución.
- **Git** (para clonar el repositorio).

> **Nota:** Gracias a los contenedores multi-etapa (*multi-stage Docker builds*), **no es necesario tener instalados Java, Maven ni Node.js en la máquina host**. Docker se encarga de compilar el backend y el frontend dentro de sus propios entornos aislados.

---

## 🚀 Instrucciones de Despliegue con Docker Compose

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Inventory-system
```

### 2. Iniciar todos los servicios
Asegúrese de que Docker Desktop esté en ejecución y ejecute en la raíz del proyecto:
```bash
docker compose up --build
```

> **Consejo:** Para ejecutarlo en segundo plano (modo detached), utilice:
> ```bash
> docker compose up --build -d
> ```

### 3. Detener los servicios
Para detener la aplicación de forma limpia:
```bash
docker compose down
```

Si además desea purgar el volumen de base de datos persistente para reiniciar los datos de fábrica:
```bash
docker compose down -v
```

---

## 🌐 URLs y Puertos de Acceso

Una vez levantados los contenedores, los servicios están disponibles en las siguientes rutas:

| Servicio | URL / Endpoint | Descripción |
| :--- | :--- | :--- |
| **Frontend (React)** | [http://localhost:3000](http://localhost:3000) | Aplicación web interactiva de gestión de inventario |
| **Backend REST API** | [http://localhost:8080/api/products](http://localhost:8080/api/products) | Endpoint base para el consumo de productos |
| **Documentación Swagger** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interfaz interactiva OpenAPI 3 para probar la API |
| **Especificación OpenAPI JSON** | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) | Esquema formal de contratos REST en formato JSON |
| **PostgreSQL Database** | `localhost:5432` | Servidor relacional (DB: `inventory_db`, User: `postgres`) |

---

## 📡 Colección de Endpoints de la API REST

Todos los endpoints cumplen estrictamente con los verbos HTTP semánticos y convenciones REST:

| Método | Endpoint | Código Éxito | Códigos Error | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | `200 OK` | `500` | Listar catálogo completo. Admite parámetros opcionales `?search=` y `?category=` |
| `GET` | `/api/products/{id}` | `200 OK` | `404` | Obtener el detalle de un producto por ID |
| `POST` | `/api/products` | `201 Created` | `400` | Registrar un nuevo producto con validación de campos |
| `PUT` | `/api/products/{id}` | `200 OK` | `400, 404` | Modificar un producto existente por su ID |
| `DELETE` | `/api/products/{id}` | `204 No Content` | `404` | Eliminar físicamente un producto del catálogo |

### Ejemplo de Solicitud (POST / PUT)
```json
{
  "name": "Monitor Curvo 34 Pulgadas",
  "description": "Pantalla UltraWide 144Hz con panel IPS",
  "price": 499.99,
  "stock": 12,
  "category": "Electrónica"
}
```

### Respuestas de Error Estructuradas (Bean Validation)
Cuando un campo no cumple las reglas de negocio (ej. precio negativo o nombre en blanco), el backend responde con código `400 Bad Request` y un payload descriptivo:
```json
{
  "timestamp": "2026-10-13T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/products",
  "validationErrors": {
    "name": "Product name is required and cannot be blank",
    "price": "Price must be greater than 0"
  }
}
```

---

## 💡 Decisiones Técnicas y Buenas Prácticas

### Backend (Java / Spring Boot)
1. **Nomenclatura y Convenciones en Inglés:** Todo el código fuente (clases, interfaces, paquetes, variables, endpoints y DTOs) está implementado en inglés siguiendo estándares universales de la industria.
2. **Desacoplamiento con DTOs:** La entidad de base de datos `Product` no se expone directamente a la capa de presentación; se utilizan `ProductRequestDto` y `ProductResponseDto` para aislar el modelo de datos interno de los contratos públicos de la API.
3. **Validación Declarativa (`@Valid`):** Uso de Bean Validation de Jakarta (`@NotBlank`, `@NotNull`, `@DecimalMin`, `@Min`, `@Size`) para asegurar la integridad de datos antes de entrar a la lógica de negocio.
4. **Manejo Centralizado de Excepciones (`@RestControllerAdvice`):** Captura global de `ResourceNotFoundException`, `MethodArgumentNotValidException` y errores imprevistos, entregando siempre respuestas JSON homogéneas.
5. **Configuración de CORS Explicita:** Habilitado para orígenes de desarrollo local (`localhost:3000`, `localhost:5173`) con soporte de métodos REST completos.
6. **Documentación Swagger / OpenAPI 3:** Integrada mediante `springdoc-openapi-starter-webmvc-ui`, facilitando la prueba inmediata de los endpoints sin requerir herramientas externas como Postman.

### Frontend (React + Vite + Tailwind CSS)
1. **Presentación en Español con Código en Inglés:** Nombres de componentes y funciones en inglés (`ProductTable`, `productService`, etc.), mientras que la interfaz gráfica, etiquetas, modales y mensajes para el usuario final se presentan en español.
2. **Validación Visual en Tiempo Real:** El formulario valida los datos tanto al escribir (`onChange`) como al desenfocar (`onBlur`), mostrando alertas visuales en rojo cuando un campo obligatorio no cumple las reglas.
3. **Confirmación de Seguridad en Eliminación:** Modal de confirmación para prevenir borrados accidentales, mostrando el nombre del producto involucrado.
4. **Feedback Inmediato:** Notificaciones tipo Toast para confirmar la creación, actualización y eliminación de registros, así como alertas amigables en caso de errores de red o validación del servidor.
5. **Diseño Responsivo:** Adaptado a pantallas de escritorio, tablets y dispositivos móviles mediante Tailwind CSS.
6. **Métricas en Vivo:** Tarjetas KPI que calculan automáticamente el total de productos, valor monetario del inventario, alertas de stock bajo y diversidad de categorías.

### Base de Datos & Contenedores
1. **Persistencia Garantizada:** El volumen Docker `postgres_data` conserva los datos incluso tras reiniciar o reconstruir los contenedores.
2. **Inicialización Automática (`init.sql`):** Incluye productos de muestra precargados para que el evaluador pueda observar la interfaz en funcionamiento de inmediato.
3. **Healthcheck y Sincronización:** El contenedor del backend espera a que PostgreSQL pase su prueba de salud (`pg_isready`) antes de iniciar, evitando errores de conexión durante el arranque en frío.
4. **Multi-stage Docker Builds:** Reducción drástica del tamaño de las imágenes finales y mayor seguridad al no incluir compiladores ni herramientas de desarrollo en producción.

---

## 💻 Ejecución en Entorno Local (Sin Docker)

Si se desea ejecutar cada componente individualmente en local:

### 1. Base de Datos PostgreSQL
Asegurarse de tener PostgreSQL corriendo en el puerto `5432` con una base de datos llamada `inventory_db` (usuario `postgres` y contraseña `postgres`).

### 2. Backend (Spring Boot)
Requiere JDK 17 y Maven:
```bash
cd backend
./mvnw spring-boot:run
# O si tiene Maven instalado: mvn spring-boot:run
```
El servidor iniciará en `http://localhost:8080`.

### 3. Frontend (React)
Requiere Node.js 18+:
```bash
cd frontend
npm install
npm run dev
```
La aplicación web iniciará en `http://localhost:3000`.

---

## 🧪 Pruebas Automatizadas

El backend incluye pruebas unitarias y de integración utilizando **JUnit 5**, **Mockito** y **MockMvc**:

- `ProductServiceTest`: Valida la lógica de negocio, búsquedas, filtrado, operaciones CRUD y excepciones de recurso no encontrado.
- `ProductControllerTest`: Valida los códigos de estado HTTP (200, 201, 204, 400, 404), serialización JSON y manejo de validaciones.

Para ejecutar los tests en local:
```bash
cd backend
mvn test
```

---

## 👤 Autor

- **Candidato:** Erick Solares
- **Correo Electrónico:** [ericksolaresr@gmail.com](mailto:ericksolaresr@gmail.com)
- **Fecha de Desarrollo:** Octubre 2026
- **Evaluador:** Technology Factory Consulting
