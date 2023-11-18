CREATE TABLE "app_users_to_woo_users" (
    app_user_id VARCHAR(255) NOT NULL,
    woo_user_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (app_user_id, woo_user_id)
);
