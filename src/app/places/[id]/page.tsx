'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/templates/MainLayout';
import { placeService } from '@/services/placeService';
import { Place, PlaceCategory } from '@/types';

const CATEGORY_COLOR: Record<
  PlaceCategory,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  명소: 'primary',
  관광지: 'success',
  공원: 'info',
  공연장: 'secondary',
  극장: 'error',
  음식점: 'warning',
};

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    placeService.getPlaceById(id).then((data) => {
      setPlace(data);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await placeService.deletePlace(id);
      router.push('/places');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!place) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            장소를 찾을 수 없습니다.
          </Typography>
          <Button component={Link} href="/places" startIcon={<ArrowBackIcon />}>
            내 장소로 돌아가기
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 5 }}>
        {/* 뒤로가기 */}
        <Button
          component={Link}
          href="/places"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          color="inherit"
        >
          내 장소
        </Button>

        {/* 이미지 */}
        {place.imageUrl && (
          <Box
            component="img"
            src={place.imageUrl}
            alt={place.name}
            sx={{
              width: '100%',
              height: { xs: 220, md: 380 },
              objectFit: 'cover',
              borderRadius: 2,
              mb: 3,
              display: 'block',
            }}
          />
        )}

        {/* 카테고리 + 액션 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip
            label={place.category}
            color={CATEGORY_COLOR[place.category]}
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              component={Link}
              href={`/places/${id}/edit`}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              삭제
            </Button>
          </Box>
        </Box>

        {/* 장소명 */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {place.name}
        </Typography>

        {/* 메타 정보 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body1" color="text.secondary">{place.address}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body1" color="text.secondary">{place.visitDate}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={place.rating} readOnly size="medium" />
            <Typography variant="body2" color="text.secondary">({place.rating}/5)</Typography>
          </Box>
        </Box>

        {/* 메모 */}
        {place.memo && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={700} mb={1.5}>
              메모
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {place.memo}
            </Typography>
          </>
        )}
      </Container>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>장소 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{place.name}</strong>을(를) 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined" disabled={deleting}>
            취소
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
