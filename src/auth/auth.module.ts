import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [AuthController],
    imports: [PrismaModule],
    providers: [AuthService],
})

export class AuthModule {}