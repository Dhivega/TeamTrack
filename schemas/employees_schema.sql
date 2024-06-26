CREATE TABLE `employees` (
	`user_id` INT(50) NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`lastname` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`email` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ph_no` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`password` VARCHAR(512) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Designation` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Address` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`Manager` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`role_id` INT(50) NULL DEFAULT NULL,
	`status_id` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`user_id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=223
;
