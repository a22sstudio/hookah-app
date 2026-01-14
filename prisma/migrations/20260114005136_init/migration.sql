-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GUEST', 'ADMIN', 'BRAND_CHEF');

-- CreateEnum
CREATE TYPE "MixStrength" AS ENUM ('LIGHT', 'MEDIUM', 'STRONG');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('LIKE', 'DISLIKE', 'ORDER');

-- CreateEnum
CREATE TYPE "FlavorTag" AS ENUM ('SWEET', 'SOUR', 'FRESH', 'SPICY', 'FRUITY', 'BERRY', 'CITRUS', 'MINT', 'ICE', 'CREAMY', 'NUTTY', 'FLORAL', 'HERBAL', 'EXOTIC', 'DESSERT', 'TOBACCO', 'COFFEE', 'CHOCOLATE', 'VANILLA', 'TROPICAL');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGINT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flavors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "brandId" INTEGER NOT NULL,
    "flavorProfile" "FlavorTag"[],
    "manufacturerStrength" INTEGER NOT NULL DEFAULT 5,
    "imageUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mixes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "authorId" BIGINT NOT NULL,
    "userStrength" "MixStrength" NOT NULL DEFAULT 'MEDIUM',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "dislikesCount" INTEGER NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mixes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mix_ingredients" (
    "id" SERIAL NOT NULL,
    "mixId" INTEGER NOT NULL,
    "flavorId" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,

    CONSTRAINT "mix_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mix_actions" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "mixId" INTEGER NOT NULL,
    "type" "ActionType" NOT NULL,
    "tableNumber" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mix_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "flavors_brandId_idx" ON "flavors"("brandId");

-- CreateIndex
CREATE INDEX "flavors_isDeleted_isAvailable_idx" ON "flavors"("isDeleted", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "flavors_brandId_slug_key" ON "flavors"("brandId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "mixes_slug_key" ON "mixes"("slug");

-- CreateIndex
CREATE INDEX "mixes_authorId_idx" ON "mixes"("authorId");

-- CreateIndex
CREATE INDEX "mixes_rating_idx" ON "mixes"("rating");

-- CreateIndex
CREATE INDEX "mixes_likesCount_idx" ON "mixes"("likesCount");

-- CreateIndex
CREATE INDEX "mixes_ordersCount_idx" ON "mixes"("ordersCount");

-- CreateIndex
CREATE INDEX "mix_ingredients_mixId_idx" ON "mix_ingredients"("mixId");

-- CreateIndex
CREATE INDEX "mix_ingredients_flavorId_idx" ON "mix_ingredients"("flavorId");

-- CreateIndex
CREATE UNIQUE INDEX "mix_ingredients_mixId_flavorId_key" ON "mix_ingredients"("mixId", "flavorId");

-- CreateIndex
CREATE INDEX "mix_actions_userId_idx" ON "mix_actions"("userId");

-- CreateIndex
CREATE INDEX "mix_actions_mixId_idx" ON "mix_actions"("mixId");

-- CreateIndex
CREATE INDEX "mix_actions_type_idx" ON "mix_actions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "mix_actions_userId_mixId_type_key" ON "mix_actions"("userId", "mixId", "type");

-- AddForeignKey
ALTER TABLE "flavors" ADD CONSTRAINT "flavors_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mixes" ADD CONSTRAINT "mixes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_ingredients" ADD CONSTRAINT "mix_ingredients_mixId_fkey" FOREIGN KEY ("mixId") REFERENCES "mixes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_ingredients" ADD CONSTRAINT "mix_ingredients_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "flavors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_actions" ADD CONSTRAINT "mix_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_actions" ADD CONSTRAINT "mix_actions_mixId_fkey" FOREIGN KEY ("mixId") REFERENCES "mixes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
