# script for spanner setup in gcloud

gcloud config configurations create emulator
gcloud config set auth/disable_credentials true
gcloud config set project ${SPANNER_PROJECT_ID}
gcloud config set api_endpoint_overrides/spanner ${SPANNER_EMULATOR_HOST}
gcloud spanner instances create ${SPANNER_INSTANCE_ID} --config=emulator-config --description="Test Instance" --nodes=1

gcloud spanner databases create ${SPANNER_DATABASE_ID} --instance=${SPANNER_INSTANCE_ID} 

gcloud spanner databases ddl update ${SPANNER_DATABASE_ID}  --instance=${SPANNER_INSTANCE_ID}  --ddl-file=/home/spanner/ddl/woo_app_users.sql

gcloud spanner databases execute-sql ${SPANNER_DATABASE_ID} --instance=${SPANNER_INSTANCE_ID}  --sql="$(< /home/spanner/dml/insert_app_users_001.sql)"

echo "✅ Successfully spinned up spanner"
