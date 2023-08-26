-- CreateTable
CREATE TABLE "Tokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_id_key" ON "Tokens"("id");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
