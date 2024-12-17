-- CreateTable
CREATE TABLE `UserToken` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(255) NOT NULL,
    `token_ex` TIMESTAMP(0) NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `UserToken_id_key`(`id`),
    UNIQUE INDEX `UserToken_token_key`(`token`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserToken` ADD CONSTRAINT `UserToken_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
