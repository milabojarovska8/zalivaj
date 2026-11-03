-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "sitting_requests" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "location" VARCHAR(150) NOT NULL,
    "note" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "sitter_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sitting_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_plants" (
    "request_id" UUID NOT NULL,
    "plant_id" UUID NOT NULL,

    CONSTRAINT "request_plants_pkey" PRIMARY KEY ("request_id","plant_id")
);

-- AddForeignKey
ALTER TABLE "sitting_requests" ADD CONSTRAINT "sitting_requests_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitting_requests" ADD CONSTRAINT "sitting_requests_sitter_id_fkey" FOREIGN KEY ("sitter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_plants" ADD CONSTRAINT "request_plants_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "sitting_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_plants" ADD CONSTRAINT "request_plants_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
