-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN_TIC', 'ANALISTA_SOC', 'RESPONSABLE_RIESGO', 'AUDITOR_INTERNO', 'DIRECTIVO');

-- CreateEnum
CREATE TYPE "ClassificationLevel" AS ENUM ('PUBLICA', 'USO_INTERNO', 'RESTRINGIDA');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('SERVIDOR', 'APLICATIVO', 'RED', 'RADIO', 'ESTACION', 'SIG', 'USUARIO', 'OTRO');

-- CreateEnum
CREATE TYPE "VulnerabilityStatus" AS ENUM ('ABIERTA', 'MITIGADA', 'ACEPTADA');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "ControlMaturity" AS ENUM ('INEXISTENTE', 'INICIAL', 'REPETIBLE', 'DEFINIDO', 'GESTIONADO', 'OPTIMIZADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'RESPONSABLE_RIESGO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "AssetType" NOT NULL,
    "criticality" INTEGER NOT NULL,
    "confidentiality" INTEGER NOT NULL,
    "integrity" INTEGER NOT NULL,
    "availability" INTEGER NOT NULL,
    "classification" "ClassificationLevel" NOT NULL DEFAULT 'USO_INTERNO',
    "ownerId" TEXT,
    "location" TEXT,
    "inherentRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "residualRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgEffectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'BAJO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerabilities" (
    "id" TEXT NOT NULL,
    "cve" TEXT,
    "description" TEXT NOT NULL,
    "severity" DOUBLE PRECISION,
    "status" "VulnerabilityStatus" NOT NULL DEFAULT 'ABIERTA',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mitigationDeadline" TIMESTAMP(3),
    "mitigatedAt" TIMESTAMP(3),
    "assetId" TEXT NOT NULL,

    CONSTRAINT "vulnerabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "IncidentSeverity" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "rootCause" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetId" TEXT,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controls" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "framework" TEXT NOT NULL DEFAULT 'ISO27001',

    CONSTRAINT "controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_controls" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "maturity" "ControlMaturity" NOT NULL DEFAULT 'INICIAL',
    "effectiveness" DOUBLE PRECISION NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextEvaluationAt" TIMESTAMP(3),

    CONSTRAINT "asset_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "controls_code_key" ON "controls"("code");

-- CreateIndex
CREATE UNIQUE INDEX "asset_controls_assetId_controlId_key" ON "asset_controls"("assetId", "controlId");

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerabilities" ADD CONSTRAINT "vulnerabilities_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_controls" ADD CONSTRAINT "asset_controls_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_controls" ADD CONSTRAINT "asset_controls_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
