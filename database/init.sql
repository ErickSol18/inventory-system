-- =============================================================================
-- Technology Factory Consulting - Technical Test
-- Inventory Management System Database Initialization
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    category VARCHAR(80),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample initial catalog for evaluation demonstration
INSERT INTO products (name, description, price, stock, category)
SELECT 'Laptop Dell XPS 15', 'Laptop de alto rendimiento para desarrollo con procesador Intel i7 y 32GB RAM', 1599.99, 15, 'Electrónica'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop Dell XPS 15');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Monitor UltraWide 34"', 'Monitor curvo IPS 144Hz resolución WQHD con conectividad USB-C', 489.50, 8, 'Electrónica'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Monitor UltraWide 34"');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Teclado Mecánico RGB', 'Teclado inalámbrico con switches táctiles y batería de larga duración', 89.99, 25, 'Electrónica'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teclado Mecánico RGB');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Silla Ergonómica Pro', 'Silla de oficina ergonómica con soporte lumbar y reposabrazos 4D', 249.00, 10, 'Hogar'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Silla Ergonómica Pro');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Café Colombiano Premium 1kg', 'Café en grano tostado artesanal de altura 100% arábica', 18.75, 40, 'Alimentos'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Café Colombiano Premium 1kg');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Camiseta Deportiva Transpirable', 'Camiseta de secado rápido con tecnología anti-olor talla M', 24.50, 30, 'Ropa'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Camiseta Deportiva Transpirable');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Auriculares Inalámbricos Noise-Cancelling', 'Cancelación activa de ruido con 30 horas de reproducción', 129.99, 3, 'Electrónica'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Auriculares Inalámbricos Noise-Cancelling');
