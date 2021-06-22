import * as yup from 'yup';

export const loginSchema = yup.object({
  login: yup.string().required('Введіть логін').max(35),
  password: yup.string().required('Введіть пароль'),
});

export const registerSchema = yup.object({
  login: yup.string().required('Введіть логін'),
  email: yup.string().required('Введіть пошту').email('Введіть пошту коректно'),
  password: yup.string().required('Введіть пароль').min(8, 'Мінімум 8 символів'),
});

export const forogotPasswordSchema = yup.object({
  email: yup.string().required('Введіть пошту').email('Введіть пошту коректно'),
});

export const editProfileSchema = yup.object({
  login: yup.string().required('Введіть логін').max(35),
});

export const resetCodeSchema = yup.object({
  code: yup.string().required('Введіть код'),
});

export const newPasswordSchema = yup.object({
  newPassword: yup.string().required('Введіть пароль').min(8, 'Мінімум 8 символів'),
});
