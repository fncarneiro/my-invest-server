/*
  Warnings:

  - A unique constraint covering the columns `[period,id_user]` on the table `investments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `investments_period_id_user_key` ON `investments`(`period`, `id_user`);
