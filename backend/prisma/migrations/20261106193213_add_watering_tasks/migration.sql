-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'DONE');

-- CreateTable
CREATE TABLE "watering_tasks" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "plant_id" UUID NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "done_at" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "watering_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "watering_tasks_request_id_due_date_idx" ON "watering_tasks"("request_id", "due_date");

-- AddForeignKey
ALTER TABLE "watering_tasks" ADD CONSTRAINT "watering_tasks_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "sitting_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watering_tasks" ADD CONSTRAINT "watering_tasks_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
