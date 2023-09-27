import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokensFromRequest = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const tokens = request?.cookies['auth-cookie'];

  if (!tokens) {
    return null;
  }

  if (data) {
    return tokens[data];
  }

  return tokens;
});
