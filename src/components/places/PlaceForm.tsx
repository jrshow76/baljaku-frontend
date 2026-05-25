'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaceCategory, PlaceFormData } from '@/types';

const CATEGORIES: PlaceCategory[] = ['명소', '관광지', '공원', '공연장', '극장', '음식점'];

interface PlaceFormProps {
  initialData?: Partial<PlaceFormData>;
  onSubmit: (data: PlaceFormData) => Promise<void>;
  submitLabel?: string;
  cancelHref?: string;
}

interface FormErrors {
  name: string;
  category: string;
  address: string;
  visitDate: string;
  rating: string;
}

const EMPTY_ERRORS: FormErrors = { name: '', category: '', address: '', visitDate: '', rating: '' };

export default function PlaceForm({
  initialData,
  onSubmit,
  submitLabel = '저장',
  cancelHref = '/places',
}: PlaceFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<PlaceFormData>({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '명소',
    address: initialData?.address ?? '',
    visitDate: initialData?.visitDate ?? new Date().toISOString().split('T')[0],
    rating: initialData?.rating ?? 0,
    memo: initialData?.memo ?? '',
    imageUrl: initialData?.imageUrl ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const set = <K extends keyof PlaceFormData>(key: K, value: PlaceFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setGeneralError('');
  };

  const validate = (): boolean => {
    const next = { ...EMPTY_ERRORS };
    if (!form.name.trim()) next.name = '장소명을 입력하세요.';
    if (!form.address.trim()) next.address = '주소를 입력하세요.';
    if (!form.visitDate) next.visitDate = '방문일을 선택하세요.';
    if (!form.rating || form.rating < 1) next.rating = '별점을 선택하세요.';
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ ...form, name: form.name.trim(), address: form.address.trim() });
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : '저장에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 장소명 */}
            <TextField
              label="장소명"
              required
              fullWidth
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="예) 경복궁, 광장시장, CGV 강남"
            />

            {/* 카테고리 */}
            <FormControl required error={!!errors.category} fullWidth>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={form.category}
                label="카테고리"
                onChange={(e) => set('category', e.target.value as PlaceCategory)}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>

            {/* 주소 */}
            <TextField
              label="주소"
              required
              fullWidth
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              placeholder="예) 서울특별시 종로구 사직로 161"
            />

            {/* 방문일 */}
            <TextField
              label="방문일"
              type="date"
              required
              fullWidth
              value={form.visitDate}
              onChange={(e) => set('visitDate', e.target.value)}
              error={!!errors.visitDate}
              helperText={errors.visitDate}
              slotProps={{ inputLabel: { shrink: true } }}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />

            {/* 별점 */}
            <Box>
              <Typography variant="body1" fontWeight={500} mb={1}>
                별점 <Typography component="span" color="error.main">*</Typography>
              </Typography>
              <Rating
                value={form.rating}
                onChange={(_, v) => set('rating', v ?? 0)}
                size="large"
              />
              {errors.rating && (
                <Typography variant="caption" color="error.main" display="block" mt={0.5}>
                  {errors.rating}
                </Typography>
              )}
            </Box>

            {/* 메모 */}
            <TextField
              label="메모"
              fullWidth
              multiline
              rows={4}
              value={form.memo}
              onChange={(e) => set('memo', e.target.value)}
              placeholder="이 장소에 대한 느낌, 추천 이유, 다음에 할 일 등을 자유롭게 기록하세요."
            />

            {/* 이미지 URL */}
            <TextField
              label="이미지 URL (선택)"
              fullWidth
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://..."
              helperText="대표 이미지 URL을 입력하세요."
            />
          </Box>
        </CardContent>
      </Card>

      {generalError && (
        <Typography color="error.main" variant="body2" mt={2}>
          {generalError}
        </Typography>
      )}

      {/* 액션 버튼 */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => router.push(cancelHref)} disabled={loading}>
          취소
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
        >
          {loading ? '저장 중...' : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}
