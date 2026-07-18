import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { AuthenticationDTO } from '../../shared/dto/auth.dto';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TokenDTO } from '../../shared/dto/token.dto';

@Controller('api/auth')
@UsePipes(new ValidationPipe({ expectedType: AuthenticationDTO }))
@ApiResponse({ type: TokenDTO, status: 201 })
@ApiCreatedResponse({
  description: 'Successful authentication or registration',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiConflictResponse({
    description: 'When a username is already taken',
  })
  @ApiBody({ type: AuthenticationDTO })
  @Post('register')
  register(@Body() data: AuthenticationDTO) {
    return this.authService.register(data);
  }

  @ApiUnauthorizedResponse({
    description: 'Invalid username/password combination',
  })
  @ApiBody({ type: AuthenticationDTO })
  @Post('login')
  login(@Body() data: AuthenticationDTO) {
    return this.authService.login(data);
  }
}
