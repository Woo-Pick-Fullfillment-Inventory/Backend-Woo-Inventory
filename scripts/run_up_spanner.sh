# script for spanner setup in gcloud

gcloud config configurations create emulator
gcloud config set auth/disable_credentials true
gcloud config set project ${SPANNER_PROJECT_ID}
gcloud config set api_endpoint_overrides/spanner ${SPANNER_EMULATOR_HOST}
gcloud spanner instances create ${SPANNER_INSTANCE_ID} --config=emulator-config --description="Test Instance" --nodes=1

gcloud spanner databases create ${SPANNER_DATABASE_ID} --instance=${SPANNER_INSTANCE_ID} 

# Define the DDL directly in the script
DDL="CREATE TABLE app_users (
    app_user_id STRING(255) NOT NULL,
    app_email STRING(255) NOT NULL,
    app_username STRING(255) NOT NULL,
    app_password STRING(255) NOT NULL,
    app_url STRING(255) NOT NULL,
    authenticated BOOL NOT NULL
) PRIMARY KEY (app_user_id);

CREATE UNIQUE INDEX EmailUniqueIndex ON app_users (app_email);

CREATE TABLE app_users_to_woo_users (
    app_user_id STRING(255) NOT NULL,
    woo_user_id STRING(255) NOT NULL
) PRIMARY KEY (app_user_id, woo_user_id);

CREATE TABLE woo_users (
    woo_user_id STRING(255) NOT NULL,
    woo_token STRING(255) NOT NULL,
    woo_secret STRING(255) NOT NULL
) PRIMARY KEY (woo_user_id);"

# Use the inline DDL in the update command
gcloud spanner databases ddl update ${SPANNER_DATABASE_ID}  --instance=${SPANNER_INSTANCE_ID}  --ddl="$DDL"

# Insert DML statement
INSERT_DML="INSERT INTO app_users (app_user_id,app_email, app_username, app_password, app_url, authenticated)
VALUES ('user123','test@email.com', 'john_doe', 'password123', 'https://example.com', FALSE);"

# Execute the insert DML statement
gcloud spanner databases execute-sql ${SPANNER_DATABASE_ID} --instance=${SPANNER_INSTANCE_ID}  --sql="$INSERT_DML"

echo "✅ Successfully spinned up spanner"
