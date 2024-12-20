-- CreateTable
CREATE TABLE `ApplicationLogs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(2000) NOT NULL,
    `ip` VARCHAR(100) NOT NULL,
    `module` VARCHAR(100) NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message` TEXT NOT NULL,

    UNIQUE INDEX `ApplicationLogs_id_key`(`id`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApplicationLogs` ADD CONSTRAINT `ApplicationLogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
