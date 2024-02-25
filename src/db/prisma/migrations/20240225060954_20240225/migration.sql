-- CreateTable
CREATE TABLE "SWYP_User_Authority" (
    "authority_id" SERIAL NOT NULL,
    "authority_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "SWYP_User_Authority_pkey" PRIMARY KEY ("authority_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SWYP_User_Authority_authority_name_key" ON "SWYP_User_Authority"("authority_name");

-- AddForeignKey
ALTER TABLE "SWYP_User_Authority" ADD CONSTRAINT "SWYP_User_Authority_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "SWYP_User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
