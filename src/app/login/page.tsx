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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = { email: '', password: '' };
    if (!form.email) next.email = '이메일을 입력하세요.';
    if (!form.password) next.password = '비밀번호를 입력하세요.';
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      router.push('/');
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper elevation={2} sx={{ px: 5, py: 6, width: '100%', maxWidth: 420, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
          테스트 계정: hong@example.com / password123
        </Typography>

        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
            helperText={errors.password}
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
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link component={NextLink} href="/register" variant="body2" underline="hover">
            회원가입
          </Link>
          <Link component={NextLink} href="/forgot-password" variant="body2" underline="hover">
            비밀번호 찾기
          </Link>
        </Box>
      </Paper>
    </AuthLayout>
  );
}
