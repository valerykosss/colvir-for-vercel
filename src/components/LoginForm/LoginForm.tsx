'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import styles from './LoginForm.module.css';

const FormSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z
    .string()
    .min(1, 'A password is required')
    .min(8, 'The password must contain more than 8 characters'),
});

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      login: values.login,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      toast.error("Login error");
    } else {
      router.refresh();
      router.push("/admin-dashboard");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="login" className={styles.label}>Login</label>
          <input
            id="login"
            type="text"
            placeholder="Enter your username"
            className={styles.input}
            {...register('login')}
          />
          {errors.login && (
            <span className={styles.errorMessage}>{errors.login.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className={styles.input}
            {...register('password')}
          />
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password.message}</span>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Enter
        </button>
      </form>
    </div>
  );
}