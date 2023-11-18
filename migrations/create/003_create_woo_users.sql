CREATE TABLE "woo_users" (
    woo_user_id VARCHAR(255) PRIMARY KEY NOT NULL,
    woo_token VARCHAR(255) NOT NULL,
    woo_secret BOOLEAN NOT NULL
);