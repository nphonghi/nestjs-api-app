import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './DTO'; // import a "folder"
 
@Controller('auth')

export class AuthController {
    // auth service is automatically created when initializing the controller
    constructor(private authService: AuthService) {

    }

    // some requests from client
    // POST: .../auth/register
    @Post("register") // register a new user
    register(@Body() auth: AuthDTO) {
    // register(@Req() request: Request) {
        
        return this.authService.register(auth);
    }
 
    @Post("login") 
    login(@Body() auth: AuthDTO) {
        return this.authService.login(auth);
    }
}
