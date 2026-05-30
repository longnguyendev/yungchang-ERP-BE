import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_VERIFIED = 'skipVerified';
export const SkipVerify = () => SetMetadata(IS_SKIP_VERIFIED, true);
