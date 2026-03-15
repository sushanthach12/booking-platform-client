export const API_CONSTANTS = {
  BASE_URL:
    process.env.APP_ENV === 'production'
      ? 'https://api.booking.com'
      : 'http://localhost:3000',

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      REFRESH_TOKEN: '/auth/refresh-token',
      VERIFY_TOKEN: '/auth/verify-token',
    },
    UPLOAD: {
      PRESIGN: '/upload/presign',
    },
  },
};
