CREATE TABLE app_users (
    app_user_id STRING(255) NOT NULL,
    app_email STRING(255) NOT NULL,
    app_username STRING(255) NOT NULL,
    app_password STRING(255) NOT NULL,
    app_url STRING(255) NOT NULL,
    authenticated BOOL NOT NULL
) PRIMARY KEY (app_user_id);

CREATE UNIQUE INDEX EmailUniqueIndex ON app_users (app_email);
CREATE UNIQUE INDEX UsernameUniqueIndex ON app_users (app_username);

CREATE TABLE app_users_to_woo_users (
    app_user_id STRING(255) NOT NULL,
    woo_user_id STRING(255) NOT NULL
) PRIMARY KEY (app_user_id, woo_user_id);

CREATE TABLE woo_users (
    woo_user_id STRING(255) NOT NULL,
    woo_token STRING(255) NOT NULL,
    woo_secret STRING(255) NOT NULL
) PRIMARY KEY (woo_user_id);