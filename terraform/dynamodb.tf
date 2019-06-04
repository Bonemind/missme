resource "aws_dynamodb_table" "missme_service_table" {
	name = "missme_services_${terraform.workspace}"
	billing_mode = "PAY_PER_REQUEST"
	hash_key = "ServiceId"

	attribute {
		name = "ServiceId"
		type = "S"
	}

	attribute {
		name = "UserId"
		type = "S"
	}

	global_secondary_index {
		name            = "GSI_UserId_Services"
		hash_key        = "UserId"
		projection_type = "ALL"
	}

	global_secondary_index {
		name            = "GSI_UserId_Services"
		hash_key        = "UserId"
		projection_type = "ALL"
	}
}

resource "aws_ssm_parameter" "missme_service_table_arn" {
	name = "/missme/${terraform.workspace}/service_table_arn"
	value = "${aws_dynamodb_table.missme_service_table.arn}"
	type = "String"
}

resource "aws_ssm_parameter" "missme_service_table_name" {
	name = "/missme/${terraform.workspace}/service_table_name"
	value = "${aws_dynamodb_table.missme_service_table.name}"
	type = "String"
}
