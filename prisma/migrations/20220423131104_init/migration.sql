-- CreateTable
CREATE TABLE `investments` (
    `id_investment` INTEGER NOT NULL AUTO_INCREMENT,
    `period` DATE NOT NULL,

    UNIQUE INDEX `period_UNIQUE`(`period`),
    PRIMARY KEY (`id_investment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stocks` (
    `id_stock` INTEGER NOT NULL AUTO_INCREMENT,
    `stock_name` VARCHAR(10) NOT NULL,
    `by_amount` INTEGER NOT NULL,
    `by_price` DECIMAL(12, 2) NOT NULL,
    `by_tax` DECIMAL(12, 2) NULL,
    `target_profit` DECIMAL(12, 2) NULL,
    `sell_profit` DECIMAL(12, 2) NULL,
    `sell_amount` INTEGER NULL,
    `sell_tax` DECIMAL(12, 2) NULL,
    `note` VARCHAR(200) NULL,
    `id_investment` INTEGER NOT NULL,

    INDEX `id_investment_idx`(`id_investment`),
    PRIMARY KEY (`id_stock`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `permission_level` INTEGER NOT NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `id_investment` FOREIGN KEY (`id_investment`) REFERENCES `investments`(`id_investment`) ON DELETE CASCADE ON UPDATE NO ACTION;
