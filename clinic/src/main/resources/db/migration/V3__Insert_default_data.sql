INSERT INTO roles (role) VALUES ('MASTER'), ('ADMIN'), ('USER') ON CONFLICT (role) DO NOTHING;

-- Insert default admin
-- password: admin123 (with BCrypt)
INSERT INTO users (username, email, password)
VALUES ('admin', 'admin@clinic.com', '$2a$12$sKV6i1GKNanbPQKn6cLHCOb2Fa6ngMsbjFJ/50tKeoaSmW.05dEGy')
ON CONFLICT DO NOTHING;

-- Associar roles USER, ADMIN e MASTER ao usuário admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.role IN ('USER', 'ADMIN', 'MASTER')
ON CONFLICT DO NOTHING;