'use client';

import { Suspense, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/templates/MainLayout';
import PlaceCard from '@/components/home/PlaceCard';
import { placeService } from '@/services/placeService';
import { Place, PlaceCategory, PlaceFilters, PlaceSortKey } from '@/types';

const CATEGORIES: Array<{ value: PlaceCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: '명소', label: '명소' },
  { value: '관광지', label: '관광지' },
  { value: '공원', label: '공원' },
  { value: '공연장', label: '공연장' },
  { value: '극장', label: '극장' },
  { value: '음식점', label: '음식점' },
];

const SORT_OPTIONS: Array<{ value: PlaceSortKey; label: string }> = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'rating-high', label: '별점 높은순' },
  { value: 'rating-low', label: '별점 낮은순' },
  { value: 'name', label: '이름순' },
];

function PlacesContent() {
  const searchParams = useSearchParams();
  const initCategory = (searchParams.get('category') as PlaceCategory | null) ?? 'all';

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaceCategory | 'all'>(initCategory);
  const [sort, setSort] = useState<PlaceSortKey>('latest');

  useEffect(() => {
    setLoading(true);
    const filters: PlaceFilters = {
      category: category !== 'all' ? category : 'all',
      sort,
      search,
    };
    placeService.getAllPlaces(filters).then((data) => {
      setPlaces(data);
      setLoading(false);
    });
  }, [category, sort, search]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>내 장소</Typography>
        <Button
          variant="contained"
          component={Link}
          href="/places/new"
          startIcon={<AddIcon />}
        >
          장소 추가
        </Button>
      </Box>

      {/* 검색 + 정렬 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="장소명 또는 주소 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as PlaceSortKey)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* 카테고리 탭 */}
      <Tabs
        value={category}
        onChange={(_, v) => setCategory(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {CATEGORIES.map((c) => (
          <Tab key={c.value} value={c.value} label={c.label} />
        ))}
      </Tabs>

      {/* 결과 수 */}
      <Typography variant="body2" color="text.secondary" mb={2}>
        {loading ? '검색 중...' : `${places.length}개의 장소`}
      </Typography>

      {/* 목록 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : places.length > 0 ? (
        <Grid container spacing={3}>
          {places.map((place) => (
            <Grid item xs={12} sm={6} md={4} key={place.id}>
              <PlaceCard place={place} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
          <Typography variant="h6" gutterBottom>
            {search || category !== 'all' ? '조건에 맞는 장소가 없습니다.' : '아직 기록한 장소가 없습니다.'}
          </Typography>
          <Typography variant="body2" mb={3}>
            {search || category !== 'all'
              ? '다른 검색어나 카테고리를 시도해보세요.'
              : '첫 번째 발자국을 남겨보세요!'}
          </Typography>
          {!search && category === 'all' && (
            <Button variant="contained" component={Link} href="/places/new" startIcon={<AddIcon />}>
              장소 기록하기
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}

export default function PlacesPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        }
      >
        <PlacesContent />
      </Suspense>
    </MainLayout>
  );
}
