import * as yup from 'yup';

export const loginSchema = yup.object({
  login: yup.string().required('Введіть логін'),
  password: yup.string().required('Введіть пароль'),
});

export const registerSchema = yup.object({
  login: yup.string().required('Введіть логін'),
  email: yup.string().required('Введіть пошту').email('Введіть пошту коректно'),
  password: yup
    .string()
    .required('Введіть пароль')
    .min(8, 'Мінімум 8 символів')
});

export const frogotPasswordSchema = yup.object({
  email: yup.string().required('Введіть пошту').email('Введіть пошту коректно'),
});
