-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
