INSERT INTO roles (role) VALUES ('ADMIN'), ('USER') ON CONFLICT (role) DO NOTHING;

-- Insert default admin
-- password: admin123 (with BCrypt)
INSERT INTO users (username, email, password)
VALUES ('admin', 'admin@clinic.com', '$2a$10$N.zmdr9k7uOCQb97h3/WX.JG5cj7SOJ9OgG8zCZ4rqv6yUS.r3WGi')
ON CONFLICT DO NOTHING;

-- Associar role ADMIN ao usuário admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.role = 'ADMIN'
ON CONFLICT DO NOTHING;