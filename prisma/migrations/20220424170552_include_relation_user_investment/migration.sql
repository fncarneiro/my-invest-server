/*
  Warnings:

  - Added the required column `id_user` to the `investments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `investments` ADD COLUMN `id_user` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `investments` ADD CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;
