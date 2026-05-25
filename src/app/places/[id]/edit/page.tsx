'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/templates/MainLayout';
import PlaceForm from '@/components/places/PlaceForm';
import { placeService } from '@/services/placeService';
import { Place, PlaceFormData } from '@/types';

export default function EditPlacePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    placeService.getPlaceById(id).then((data) => {
      setPlace(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: PlaceFormData) => {
    await placeService.updatePlace(id, data);
    router.push(`/places/${id}`);
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
        <Button
          component={Link}
          href={`/places/${id}`}
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ mb: 3 }}
        >
          {place.name}
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700}>장소 수정</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            기록을 수정합니다.
          </Typography>
        </Box>

        <PlaceForm
          initialData={place}
          onSubmit={handleSubmit}
          submitLabel="수정 저장"
          cancelHref={`/places/${id}`}
        />
      </Container>
    </MainLayout>
  );
}
