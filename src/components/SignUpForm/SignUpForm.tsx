'use client';

import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import styles from './SignUpForm.module.css';

const FormSchema = z
  .object({
    login: z.string().min(1, 'A username is required').max(100),
    password: z
      .string()
      .min(1, 'A password is required')
      .min(8, 'The password must contain more than 8 characters'),
    confirmPassword: z.string().min(1, 'Be sure to confirm the password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const SignUpForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      login: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: values.login,
        password: values.password
      })
    });

    if(response.ok) {
      router.push("/login");
    } else {
      toast.error("Registration error");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="login" className={styles.label}>Login</label>
            <Controller
              name="login"
              control={control}
              render={({ field }) => (
                <input
                  id="login"
                  type="text"
                  placeholder="Enter your username, for example john doe"
                  className={styles.input}
                  {...field}
                />
              )}
            />
            {errors.login && (
              <span className={styles.errorMessage}>{errors.login.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  id="password"
                  type="password"
                  placeholder="Enter the password"
                  className={styles.input}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Repeat the password</label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat the password"
                  className={styles.input}
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>
            )}
          </div>


        <button type="submit" className={styles.submitButton}>
          Register
        </button>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerText}>or</span>
      </div>

      <p className={styles.loginPrompt}>
        If you already have an account&nbsp;
        <Link href="/login" className={styles.loginLink}>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;