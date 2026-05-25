import { User, LoginRequest, RegisterRequest } from '@/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

interface StoredUser extends User {
  password: string;
}

// 사전 등록된 테스트 계정
const PRESET_USERS: StoredUser[] = [
  {
    id: 1,
    username: '홍길동',
    email: 'hong@example.com',
    password: 'password123',
    role: 'USER',
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    username: '관리자',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: '2026-01-01',
  },
];

const KEY = {
  TOKEN: 'token',
  USER: 'auth_user',
  MOCK_USERS: 'mock_registered_users',
};

function getMockAllUsers(): StoredUser[] {
  const registered: StoredUser[] = JSON.parse(localStorage.getItem(KEY.MOCK_USERS) || '[]');
  return [...PRESET_USERS, ...registered];
}

function toPublicUser(u: StoredUser): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...pub } = u;
  return pub;
}

export const authService = {
  async login(req: LoginRequest): Promise<User> {
    if (USE_MOCK) {
      const found = getMockAllUsers().find(
        (u) => u.email === req.email && u.password === req.password,
      );
      if (!found) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      const user = toPublicUser(found);
      localStorage.setItem(KEY.TOKEN, `mock-token-${user.id}`);
      localStorage.setItem(KEY.USER, JSON.stringify(user));
      return user;
    }
    // TODO: 백엔드 연동 시 교체
    // const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', req);
    // const { user, accessToken } = res.data.data;
    // localStorage.setItem(KEY.TOKEN, accessToken);
    // localStorage.setItem(KEY.USER, JSON.stringify(user));
    // return user;
    throw new Error('Not implemented');
  },

  async register(req: RegisterRequest): Promise<User> {
    if (USE_MOCK) {
      if (getMockAllUsers().find((u) => u.email === req.email)) {
        throw new Error('이미 사용 중인 이메일입니다.');
      }
      const newUser: StoredUser = {
        id: Date.now(),
        username: req.username,
        email: req.email,
        password: req.password,
        role: 'USER',
        createdAt: new Date().toISOString().split('T')[0],
      };
      const registered: StoredUser[] = JSON.parse(localStorage.getItem(KEY.MOCK_USERS) || '[]');
      registered.push(newUser);
      localStorage.setItem(KEY.MOCK_USERS, JSON.stringify(registered));

      const user = toPublicUser(newUser);
      localStorage.setItem(KEY.TOKEN, `mock-token-${user.id}`);
      localStorage.setItem(KEY.USER, JSON.stringify(user));
      return user;
    }
    // TODO: 백엔드 연동 시 교체
    throw new Error('Not implemented');
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const str = localStorage.getItem(KEY.USER);
    return str ? JSON.parse(str) : null;
  },

  async updateProfile(data: { username: string }): Promise<User> {
    if (USE_MOCK) {
      const current = this.getStoredUser();
      if (!current) throw new Error('로그인이 필요합니다.');
      const updated: User = { ...current, ...data };

      const registered: StoredUser[] = JSON.parse(localStorage.getItem(KEY.MOCK_USERS) || '[]');
      const idx = registered.findIndex((u) => u.id === current.id);
      if (idx >= 0) {
        registered[idx] = { ...registered[idx], ...data };
        localStorage.setItem(KEY.MOCK_USERS, JSON.stringify(registered));
      }
      localStorage.setItem(KEY.USER, JSON.stringify(updated));
      return updated;
    }
    // TODO: 백엔드 연동 시 교체
    throw new Error('Not implemented');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      const current = this.getStoredUser();
      if (!current) throw new Error('로그인이 필요합니다.');

      const found = getMockAllUsers().find((u) => u.id === current.id);
      if (!found || found.password !== currentPassword) {
        throw new Error('현재 비밀번호가 올바르지 않습니다.');
      }

      const registered: StoredUser[] = JSON.parse(localStorage.getItem(KEY.MOCK_USERS) || '[]');
      const idx = registered.findIndex((u) => u.id === current.id);
      if (idx >= 0) {
        registered[idx].password = newPassword;
        localStorage.setItem(KEY.MOCK_USERS, JSON.stringify(registered));
      }
      return;
    }
    // TODO: 백엔드 연동 시 교체
    throw new Error('Not implemented');
  },

  logout(): void {
    localStorage.removeItem(KEY.TOKEN);
    localStorage.removeItem(KEY.USER);
  },
};
