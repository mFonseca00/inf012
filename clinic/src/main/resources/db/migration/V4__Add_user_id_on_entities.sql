ALTER TABLE patients ADD COLUMN user_id BIGINT;
ALTER TABLE patients ADD CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE patients ADD CONSTRAINT uk_patient_user UNIQUE (user_id);

ALTER TABLE doctors ADD COLUMN user_id BIGINT;
ALTER TABLE doctors ADD CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE doctors ADD CONSTRAINT uk_doctor_user UNIQUE (user_id);