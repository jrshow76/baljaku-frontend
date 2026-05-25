'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import PlaceIcon from '@mui/icons-material/Place';
import Link from 'next/link';
import MainLayout from '@/components/templates/MainLayout';
import PlaceCard from '@/components/home/PlaceCard';
import { placeService } from '@/services/placeService';
import { Place, PlaceCategory, PlaceStats } from '@/types';

const CATEGORIES: PlaceCategory[] = ['명소', '관광지', '공원', '공연장', '극장', '음식점'];

export default function HomePage() {
  const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);
  const [stats, setStats] = useState<PlaceStats>({ total: 0, thisMonth: 0, categories: 0 });

  useEffect(() => {
    Promise.all([placeService.getRecentPlaces(6), placeService.getStats()]).then(
      ([places, s]) => {
        setRecentPlaces(places);
        setStats(s);
      },
    );
  }, []);

  const statItems = [
    { icon: <PlaceIcon fontSize="large" />, label: '총 방문 장소', value: stats.total, unit: '곳', color: '#1976d2' },
    { icon: <CalendarTodayIcon fontSize="large" />, label: '이번 달 방문', value: stats.thisMonth, unit: '곳', color: '#2e7d32' },
    { icon: <CategoryIcon fontSize="large" />, label: '카테고리', value: stats.categories, unit: '개', color: '#9c27b0' },
  ];

  return (
    <MainLayout>
      {/* 히어로 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            나만의 발자국을 기록하세요
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 5 }}>
            명소, 관광지, 음식점 등 다녀온 장소를 기록하고 소중한 추억을 간직하세요
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/places/new"
              startIcon={<AddIcon />}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              장소 기록하기
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/places"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              전체 보기
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* 통계 */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {statItems.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Paper
                elevation={0}
                sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}
              >
                <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                  <Typography component="span" variant="h6" color="text.secondary" ml={0.5}>
                    {stat.unit}
                  </Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* 최근 방문 장소 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>최근 방문 장소</Typography>
            <Button component={Link} href="/places" size="small">전체 보기 →</Button>
          </Box>
          {recentPlaces.length > 0 ? (
            <Grid container spacing={3}>
              {recentPlaces.map((place) => (
                <Grid item xs={12} sm={6} md={4} key={place.id}>
                  <PlaceCard place={place} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
              <Typography variant="body1">아직 기록한 장소가 없습니다.</Typography>
              <Button component={Link} href="/places/new" variant="contained" sx={{ mt: 2 }} startIcon={<AddIcon />}>
                첫 번째 발자국 남기기
              </Button>
            </Box>
          )}
        </Box>

        {/* 카테고리 탐색 */}
        <Box>
          <Typography variant="h5" fontWeight={700} mb={2}>카테고리로 탐색</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                component={Link}
                href={`/places?category=${encodeURIComponent(cat)}`}
                clickable
              />
            ))}
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}
