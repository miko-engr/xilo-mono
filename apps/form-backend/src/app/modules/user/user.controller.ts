import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../guards/auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  list() {
    return this.userService.list();
  }
  @Get('profile/:id')
  @UseGuards(AuthGuard)
  listOne() {
    return this.userService.listOne();
  }
  @Get('profile/one/:id')
  @UseGuards(AuthGuard)
  listById(@Param('id') id: number) {
    return this.userService.listById(id);
  }
  @Get('company')
  @UseGuards(AuthGuard)
  listByCompany() {
    return this.userService.listByCompany();
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: number, @Body() userBody: CreateUserDto) {
    return this.userService.update(id, userBody);
  }
  @Patch('edit/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  updateUser(@Param('id') id: number, @Body() userBody: CreateUserDto) {
    return this.userService.updateUser(id, userBody);
  }

  @Patch('platform-manager/edit')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  updatePlatformManagerId() {
    return this.userService.updatePlatformManagerId();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() userBody: CreateUserDto) {
    return this.userService.create(userBody);
  }
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.userService.destroy(id);
  }

  @Post('update/settings')
  @UseGuards(AuthGuard)
  updateSettings() {
    return this.userService.updateSettings();
  }

  @Post('sendInvitationEmail')
  @UseGuards(AuthGuard)
  sendInvitationEmail() {
    return this.userService.sendInvitationEmail();
  }
  // router.post('/platform-manager', (req, res, next) => userController.verify(req, res));
}
