CREATE TABLE `projects` (
	`Project_id` INT(50) NOT NULL AUTO_INCREMENT,
	`code` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Description` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Project_manager` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Solution` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Activity_type` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`subsidiary` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`start_date` DATE NULL DEFAULT NULL,
	`end_date` DATE NULL DEFAULT NULL,
	`actual_step` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`critical` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`weather` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`past_two_weaks_review` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`coming_two_weaks_review` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`major_problem` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Project_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
