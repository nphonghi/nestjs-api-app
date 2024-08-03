import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request: Express.Request = context.switchToHttp().getRequest();
    const user = request["user"];
    return data ? user?.[data] : user
  },
); 