ALTER TABLE patient ADD COLUMN user_id BIGINT;
ALTER TABLE patient ADD CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE patient ADD CONSTRAINT uk_patient_user UNIQUE (user_id);

ALTER TABLE doctor ADD COLUMN user_id BIGINT;
ALTER TABLE doctor ADD CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE doctor ADD CONSTRAINT uk_doctor_user UNIQUE (user_id);