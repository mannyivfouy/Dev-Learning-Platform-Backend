import { SetMetadata } from '@nestjs/common';

export const ACCOUNT_TYPE_KEY = 'account_type';

export const AccountType = (accountType: 'student' | 'user') =>
  SetMetadata(ACCOUNT_TYPE_KEY, accountType);