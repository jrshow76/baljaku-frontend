'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          fontWeight={700}
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          발자국
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" component={Link} href="/places">
              내 장소
            </Button>
            <Button
              variant="contained"
              component={Link}
              href="/places/new"
              startIcon={<AddIcon />}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              장소 추가
            </Button>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.dark', fontSize: 15 }}>
                {user.username[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { elevation: 2, sx: { minWidth: 180, mt: 0.5 } } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>{user.username}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { setAnchorEl(null); router.push('/mypage'); }}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                마이페이지
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                로그아웃
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} href="/login">
              로그인
            </Button>
            <Button
              variant="contained"
              component={Link}
              href="/register"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
