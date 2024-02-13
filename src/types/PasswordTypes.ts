export type PasswordReset = {
    email: string;
};

export type PasswordVerify = {
    code: string;
};

export type PasswordChange = {
    newPassword: string;
};
