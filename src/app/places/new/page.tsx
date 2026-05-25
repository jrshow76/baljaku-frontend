'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/templates/MainLayout';
import PlaceForm from '@/components/places/PlaceForm';
import { placeService } from '@/services/placeService';
import { PlaceFormData } from '@/types';

export default function NewPlacePage() {
  const router = useRouter();

  const handleSubmit = async (data: PlaceFormData) => {
    const created = await placeService.createPlace(data);
    router.push(`/places/${created.id}`);
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          component={Link}
          href="/places"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ mb: 3 }}
        >
          내 장소
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700}>장소 기록하기</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            다녀온 장소를 기록하고 소중한 추억을 남겨보세요.
          </Typography>
        </Box>

        <PlaceForm onSubmit={handleSubmit} submitLabel="기록 저장" />
      </Container>
    </MainLayout>
  );
}
