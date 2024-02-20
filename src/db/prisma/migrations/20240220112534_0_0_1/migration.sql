-- CreateEnum
CREATE TYPE "SWYP_QuestionType" AS ENUM ('STRENGTH', 'WEAKNESS', 'BOTH');

-- CreateEnum
CREATE TYPE "SWYP_UserLoginType" AS ENUM ('KAKAO', 'GOOGLE');

-- CreateEnum
CREATE TYPE "SWYP_QuestionTarget" AS ENUM ('TEAM', 'FRIEND');

-- CreateEnum
CREATE TYPE "SWYP_ReviewType" AS ENUM ('STRENGTH', 'WEAKNESS');

-- CreateEnum
CREATE TYPE "SWYP_ChipName" AS ENUM ('JUDGMENT', 'OBSERVATION', 'LISTENING', 'COMMUNICATION', 'FRIENDLINESS', 'EXECUTION', 'PERSEVERANCE');

-- CreateTable
CREATE TABLE "SWYP_User" (
    "user_id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_nickname" TEXT NOT NULL,
    "user_login_type" "SWYP_UserLoginType" NOT NULL,

    CONSTRAINT "SWYP_User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "SWYP_Question" (
    "question_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_type" "SWYP_QuestionType" NOT NULL,
    "question_target" "SWYP_QuestionTarget" NOT NULL,
    "question_title" TEXT NOT NULL,
    "question_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_used" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SWYP_Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "SWYP_Response" (
    "response_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "response_title" TEXT NOT NULL,
    "response_responder" TEXT NOT NULL,

    CONSTRAINT "SWYP_Response_pkey" PRIMARY KEY ("response_id")
);

-- CreateTable
CREATE TABLE "SWYP_Chip" (
    "chip_id" SERIAL NOT NULL,
    "chip_name" "SWYP_ChipName" NOT NULL,

    CONSTRAINT "SWYP_Chip_pkey" PRIMARY KEY ("chip_id")
);

-- CreateTable
CREATE TABLE "SWYP_Review" (
    "review_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "chip_id" INTEGER NOT NULL,
    "response_id" INTEGER NOT NULL,
    "review_type" "SWYP_ReviewType" NOT NULL,
    "review_description" TEXT,

    CONSTRAINT "SWYP_Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SWYP_User_user_email_key" ON "SWYP_User"("user_email");

-- AddForeignKey
ALTER TABLE "SWYP_Question" ADD CONSTRAINT "SWYP_Question_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "SWYP_User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SWYP_Response" ADD CONSTRAINT "SWYP_Response_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "SWYP_User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SWYP_Response" ADD CONSTRAINT "SWYP_Response_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "SWYP_Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SWYP_Review" ADD CONSTRAINT "SWYP_Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "SWYP_User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SWYP_Review" ADD CONSTRAINT "SWYP_Review_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "SWYP_Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SWYP_Review" ADD CONSTRAINT "SWYP_Review_chip_id_fkey" FOREIGN KEY ("chip_id") REFERENCES "SWYP_Chip"("chip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SWYP_Review" ADD CONSTRAINT "SWYP_Review_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "SWYP_Response"("response_id") ON DELETE RESTRICT ON UPDATE CASCADE;
