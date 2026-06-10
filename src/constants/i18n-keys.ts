export const I18N_KEYS = {
  ERRORS: {
    SYSTEM: {
      DEFAULT: 'errors.system.default',
      BAD_REQUEST: 'errors.system.badRequest',
      TOO_MANY_REQUESTS: 'errors.system.tooManyRequests',
      UNAUTHORIZED: 'errors.system.unauthorized',
      NOT_FOUND: 'errors.system.notFound',
      INTERNAL_SERVER_ERROR: 'errors.system.internalServerError',
      FORBIDDEN: 'errors.system.forbidden',
    },

    EMPLOYEE: {
      NOT_FOUND: 'errors.employee.notFound',
      ALREADY_EXISTS: 'errors.employee.alreadyExists',
    },
    USER_ACCOUNT: {
      NOT_FOUND: 'errors.userAccount.notFound',
      ALREADY_EXISTS: 'errors.userAccount.alreadyExists',
      USER_ACCOUNT_EMPLOYEE_EXISTS:
        'errors.userAccount.userAccountEmployeeExists',
      INVALID_PASSWORD: 'errors.userAccount.invalidPassword',
    },
  },
};
