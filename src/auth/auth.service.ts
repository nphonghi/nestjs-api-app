import { Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './DTO';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})

export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    async register(authDTO: AuthDTO) {
        const hashedPassword = await argon.hash(authDTO.password);
        try {
            // insert data into database
            const user = await this.prismaService.user.create({
                data: {
                    email: authDTO.email,
                    hashedPassword: hashedPassword,
                    firstName: '',
                    lastName: ''
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            })
            return user
        } catch (error) {
            return error
        }
    }
    async login(authDTO: AuthDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDTO.email
            }
        });

        if (!user ||!(await argon.verify(user.hashedPassword, authDTO.password))) {
            throw new Error('Invalid credentials')
        }
        delete user.hashedPassword;
        return await this.signJwtToken(user.id, user.email)
    }

    async signJwtToken(userId: number, email: string)
    : Promise<{accessToken: string}> {
        const payload = {
            sub  : userId,
            email: email
        };
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret   :  this.configService.get('JWT_SECRET')
        });
        return {
            accessToken: jwtString
        }
    }
}