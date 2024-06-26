CREATE TABLE `weekly_report` (
	`user_id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`code` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`workload` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`description` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`solution` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`activity_type` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`subsidiary` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`year` YEAR NULL DEFAULT NULL,
	`start_date` DATE NULL DEFAULT NULL,
	`end_date` DATE NULL DEFAULT NULL,
	`week_no` INT(11) NULL DEFAULT NULL,
	`data` INT(11) NULL DEFAULT NULL
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;