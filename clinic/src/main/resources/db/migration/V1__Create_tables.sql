CREATE TABLE IF NOT EXISTS address (
    id BIGSERIAL PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20),
    complement VARCHAR(255),
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    cep VARCHAR(9) NOT NULL
);

CREATE TABLE IF NOT EXISTS patient (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    address_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_patient_address FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE IF NOT EXISTS doctor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    crm VARCHAR(20) NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    address_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_doctor_address FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE IF NOT EXISTS appointment (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient(id),
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);