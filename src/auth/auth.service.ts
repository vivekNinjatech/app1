import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { isInstance } from "class-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {
        try {
            const hash: string = await argon.hash(dto.password);
            const user: any = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                },
            });
            return user;
        } catch (error: any) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials already taken");
                }
            }
            throw error;
        }
    }
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })

        if (!user) {
            throw new ForbiddenException("Credentials incorrect");
        }

        const isCorrectPassword = await argon.verify(user.hash, dto.password);

        if (!isCorrectPassword) {
            throw new ForbiddenException("Credentials incorrect");
        }

        delete user.hash;

        return user
    }
}