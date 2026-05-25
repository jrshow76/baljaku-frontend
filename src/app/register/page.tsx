'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/templates/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

interface FormState {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface ErrorState extends FormState {
  general: string;
}

const EMPTY_ERRORS: ErrorState = { username: '', email: '', password: '', passwordConfirm: '', general: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ username: '', email: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState<ErrorState>(EMPTY_ERRORS);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = { ...EMPTY_ERRORS };
    if (!form.username.trim()) next.username = '이름을 입력하세요.';
    else if (form.username.trim().length < 2) next.username = '이름은 2자 이상이어야 합니다.';

    if (!form.email) next.email = '이메일을 입력하세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = '올바른 이메일 형식이 아닙니다.';

    if (!form.password) next.password = '비밀번호를 입력하세요.';
    else if (form.password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';

    if (!form.passwordConfirm) next.passwordConfirm = '비밀번호 확인을 입력하세요.';
    else if (form.password !== form.passwordConfirm) next.passwordConfirm = '비밀번호가 일치하지 않습니다.';

    setErrors(next);
    return !next.username && !next.email && !next.password && !next.passwordConfirm;
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '', general: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ username: form.username.trim(), email: form.email, password: form.password });
      router.push('/');
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err instanceof Error ? err.message : '회원가입에 실패했습니다.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper elevation={2} sx={{ px: 5, py: 6, width: '100%', maxWidth: 440, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={4}>
          회원가입
        </Typography>

        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="이름"
            fullWidth
            required
            value={form.username}
            onChange={handleChange('username')}
            error={!!errors.username}
            helperText={errors.username}
            sx={{ mb: 2 }}
          />
          <TextField
            label="이메일"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={handleChange('password')}
            error={!!errors.password}
            helperText={errors.password || '8자 이상 입력하세요.'}
            sx={{ mb: 2 }}
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            fullWidth
            required
            value={form.passwordConfirm}
            onChange={handleChange('passwordConfirm')}
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" textAlign="center" color="text.secondary">
          이미 계정이 있으신가요?{' '}
          <Link component={NextLink} href="/login" underline="hover" fontWeight={600}>
            로그인
          </Link>
        </Typography>
      </Paper>
    </AuthLayout>
  );
}
