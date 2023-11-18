CREATE TABLE "woousers" (
    id SERIAL PRIMARY KEY,
    woo_token VARCHAR(255),
    woo_secret VARCHAR(255),
    woo_url VARCHAR(255)
);