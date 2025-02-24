-- CreateTable
CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "accelerometer" JSON NOT NULL,
    "gps" JSON NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentMessage_pkey" PRIMARY KEY ("id")
);
