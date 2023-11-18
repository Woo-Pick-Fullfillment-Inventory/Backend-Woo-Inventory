CREATE TABLE "app_users" (
    app_user_id VARCHAR(255) PRIMARY KEY NOT NULL,
    app_username VARCHAR(255) NOT NULL,
    app_password VARCHAR(255) NOT NULL,
    app_url VARCHAR(255) NOT NULL,
    authenticated BOOLEAN DEFAULT false NOT NULL
);