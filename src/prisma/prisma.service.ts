import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()

// This service is used to connect DB
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    // url: 'postgresql://postgres:Abc123456789@localhost:5434/testdb?schema=public'
                    url: configService.get<string>('DATABASE_URL')
                }
            }
        }); 
        // console.log('configService: ', + JSON.stringify(configService));
    }

    cleanDatabase() {
        // Delete relationship MANY first, then delete relationship ONE
        return this.$transaction([
            this.note.deleteMany(),
            this.user.deleteMany()
        ])
    }
}
