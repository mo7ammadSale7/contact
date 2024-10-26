import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private validUsers = ['user1', 'user2'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const username = request.headers['x-user'];
    return this.validUsers.includes(username);
  }
}