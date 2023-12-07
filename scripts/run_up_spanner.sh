# script for spanner setup in gcloud

gcloud config configurations create emulator
gcloud config set auth/disable_credentials true
gcloud config set project test-development
gcloud config set api_endpoint_overrides/spanner http://spanner-emulator:9020/
gcloud config set auth/disable_credentials true
gcloud spanner instances create test-instance --config=emulator-config --description="Test Instance" --nodes=1

gcloud spanner databases create woo-app-users --instance=test-instance

# Define the DDL directly in the script
DDL="CREATE TABLE app_users (
    app_user_id STRING(255) NOT NULL,
    app_username STRING(255) NOT NULL,
    app_password STRING(255) NOT NULL,
    app_url STRING(255) NOT NULL,
    authenticated BOOL NOT NULL,
) PRIMARY KEY (app_user_id);

CREATE TABLE app_users_to_woo_users (
    app_user_id STRING(255) NOT NULL,
    woo_user_id STRING(255) NOT NULL,
) PRIMARY KEY (app_user_id, woo_user_id);

CREATE TABLE woo_users (
    woo_user_id STRING(255) NOT NULL,
    woo_token STRING(255) NOT NULL,
    woo_secret STRING(255) NOT NULL,
) PRIMARY KEY (woo_user_id);"

# Use the inline DDL in the update command
gcloud spanner databases ddl update woo-app-users --instance=test-instance --ddl="$DDL"

# Insert DML statement
INSERT_DML="INSERT INTO app_users (app_user_id, app_username, app_password, app_url, authenticated)
VALUES ('user123', 'john_doe', 'password123', 'https://example.com', FALSE);"

# Execute the insert DML statement
gcloud spanner databases execute-sql woo-app-users --instance=test-instance --sql="$INSERT_DML"

echo "✅ Successfully spinned up spanner"
