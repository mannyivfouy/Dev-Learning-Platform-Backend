import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ACCOUNT_TYPE_KEY } from '../../decorators/account-type.decorator.js';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccountTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const accountType = request.user?.account_type;

    if (!accountType) {
      throw new ForbiddenException('Account type is required');
    }

    const requiredAccountType = this.reflector.get<string>(
      ACCOUNT_TYPE_KEY,
      context.getHandler(),
    );

    if (!requiredAccountType) {
      return true;
    }

    if (accountType !== requiredAccountType) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
