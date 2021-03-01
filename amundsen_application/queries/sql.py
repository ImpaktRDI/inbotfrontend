# flake8: noqa: E131


insert_or_update_ms_user_query = (
    "INSERT INTO `user` (email, first_name, last_name, full_name, tenant_id) "
    "VALUES (%s, %s, %s, %s, %s) "
    "ON DUPLICATE KEY UPDATE "
        "first_name=VALUES(first_name), "
        "last_name=VALUES(last_name), "
        "full_name=VALUES(full_name), "
        "tenant_id=VALUES(tenant_id);"
)

get_user_by_email_query = (
    "SELECT * FROM `user` WHERE user.email = %s;"
)
