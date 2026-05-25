'use client';

import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/templates/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockPlaces } from '@/mocks/data/places';

export default function MyPage() {
  const { user, loading, updateProfile, changePassword } = useAuth();
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({ username: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) setProfileForm({ username: user.username });
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // 프로필 수정
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.username.trim()) {
      setProfileError('이름을 입력하세요.');
      return;
    }
    if (profileForm.username.trim().length < 2) {
      setProfileError('이름은 2자 이상이어야 합니다.');
      return;
    }
    setProfileLoading(true);
    setProfileError('');
    try {
      await updateProfile({ username: profileForm.username.trim() });
      showSnackbar('프로필이 수정되었습니다.');
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : '수정에 실패했습니다.');
    } finally {
      setProfileLoading(false);
    }
  };

  // 비밀번호 변경
  const validatePw = () => {
    const next = { current: '', next: '', confirm: '' };
    if (!pwForm.current) next.current = '현재 비밀번호를 입력하세요.';
    if (!pwForm.next) next.next = '새 비밀번호를 입력하세요.';
    else if (pwForm.next.length < 8) next.next = '비밀번호는 8자 이상이어야 합니다.';
    if (!pwForm.confirm) next.confirm = '비밀번호 확인을 입력하세요.';
    else if (pwForm.next !== pwForm.confirm) next.confirm = '비밀번호가 일치하지 않습니다.';
    setPwErrors(next);
    return !next.current && !next.next && !next.confirm;
  };

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePw()) return;
    setPwLoading(true);
    setPwError('');
    try {
      await changePassword(pwForm.current, pwForm.next);
      setPwForm({ current: '', next: '', confirm: '' });
      showSnackbar('비밀번호가 변경되었습니다.');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : '변경에 실패했습니다.');
    } finally {
      setPwLoading(false);
    }
  };

  const visitCount = mockPlaces.length;

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h5" fontWeight={700} mb={4}>
          마이페이지
        </Typography>

        <Grid container spacing={3}>
          {/* 프로필 카드 */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: 'primary.main',
                    fontSize: 28,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {user.username[0]}
                </Avatar>
                <Typography variant="h6" fontWeight={700}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  {user.role === 'ADMIN' ? '관리자' : '일반 회원'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <PlaceIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    방문 장소 <strong>{visitCount}</strong>곳
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  가입일: {user.createdAt}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 설정 영역 */}
          <Grid item xs={12} md={8}>
            {/* 정보 수정 */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  정보 수정
                </Typography>
                {profileError && (
                  <Alert severity="error" sx={{ mb: 2 }}>{profileError}</Alert>
                )}
                <Box component="form" onSubmit={handleProfileSubmit}>
                  <TextField
                    label="이메일"
                    value={user.email}
                    fullWidth
                    disabled
                    sx={{ mb: 2 }}
                    helperText="이메일은 변경할 수 없습니다."
                  />
                  <TextField
                    label="이름"
                    fullWidth
                    required
                    value={profileForm.username}
                    onChange={(e) => {
                      setProfileForm({ username: e.target.value });
                      setProfileError('');
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={profileLoading}
                    startIcon={profileLoading ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {profileLoading ? '저장 중...' : '저장'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* 비밀번호 변경 */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  비밀번호 변경
                </Typography>
                {pwError && (
                  <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>
                )}
                <Box component="form" onSubmit={handlePwSubmit}>
                  <TextField
                    label="현재 비밀번호"
                    type="password"
                    fullWidth
                    required
                    value={pwForm.current}
                    onChange={(e) => { setPwForm((p) => ({ ...p, current: e.target.value })); setPwErrors((p) => ({ ...p, current: '' })); setPwError(''); }}
                    error={!!pwErrors.current}
                    helperText={pwErrors.current}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="새 비밀번호"
                    type="password"
                    fullWidth
                    required
                    value={pwForm.next}
                    onChange={(e) => { setPwForm((p) => ({ ...p, next: e.target.value })); setPwErrors((p) => ({ ...p, next: '' })); }}
                    error={!!pwErrors.next}
                    helperText={pwErrors.next || '8자 이상 입력하세요.'}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="새 비밀번호 확인"
                    type="password"
                    fullWidth
                    required
                    value={pwForm.confirm}
                    onChange={(e) => { setPwForm((p) => ({ ...p, confirm: e.target.value })); setPwErrors((p) => ({ ...p, confirm: '' })); }}
                    error={!!pwErrors.confirm}
                    helperText={pwErrors.confirm}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={pwLoading}
                    startIcon={pwLoading ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {pwLoading ? '변경 중...' : '비밀번호 변경'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
