import JWT, { SignOptions } from 'jsonwebtoken';

export function getRefreshAccessToken({phone, id, roleId}: {phone: string, id: number, roleId: number}) {
   return JWT.sign(
        { userId: id, phone: phone, roleId: roleId },
        process.env.JWT_ACCESS_SECRET as string,
        {expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']}
      )
}