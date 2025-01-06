CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    whatsapp_number VARCHAR(15) NOT NULL,
    owner_name VARCHAR(50) NOT NULL,
    pet_name VARCHAR(50) NOT NULL,
    pet_type VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
