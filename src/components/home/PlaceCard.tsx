'use client';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
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

export default function PlaceCard({ place }: { place: Place }) {
  const router = useRouter();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        onClick={() => router.push(`/places/${place.id}`)}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {place.imageUrl && (
          <CardMedia
            component="img"
            height="180"
            image={place.imageUrl}
            alt={place.name}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Chip
            label={place.category}
            color={CATEGORY_COLOR[place.category]}
            size="small"
            sx={{ alignSelf: 'flex-start', mb: 1 }}
          />
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {place.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {place.address}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Rating value={place.rating} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              {place.visitDate}
            </Typography>
          </Box>
          {place.memo && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {place.memo}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
