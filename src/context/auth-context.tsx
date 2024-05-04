import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { logAdminIn } from '../api/auth';
import { AxiosError, HttpStatusCode } from 'axios';

interface IAuthContext {
  accessToken: string | null;
  refreshToken: string | null;
  login: (userData: ILoginData) => Promise<HttpStatusCode>;
  logout: () => void;
  refreshTokenUpdate: (refresh: string) => void;
}

interface ILoginData {
  username: string;
  password: string;
}

// Context 생성
const AuthContext = createContext<IAuthContext>({
  accessToken: null,
  refreshToken: null,
  login(ILoginData) {
    return Promise.resolve(HttpStatusCode.Ok);
  },
  logout() {},
  refreshTokenUpdate(refresh) {},
});

// Context를 사용하기 쉽게 하는 Custom Hook
export const useAuth = () => useContext(AuthContext);

// Provider 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      setAccessToken(jwt);
    }
  }, []);

  const login = async (userData: ILoginData): Promise<HttpStatusCode> => {
    const res = await logAdminIn(userData.username, userData.password);
    if (res instanceof AxiosError) {
      return HttpStatusCode.Unauthorized;
    }

    const accessTokenKeyValue = res.data.split(';')[0];
    const refreshTokenKeyValue = res.data.split(';')[1];

    const access = accessTokenKeyValue.split('=')[1];
    const refresh = refreshTokenKeyValue.split('=')[1];

    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);

    setAccessToken(access);
    setRefreshToken(refresh);

    return HttpStatusCode.Ok;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAccessToken(null);
    setRefreshToken(null);
  };

  const refreshTokenUpdate = (refresh: string) => {
    setRefreshToken(refresh);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, refreshTokenUpdate }}
    >
      {children}
    </AuthContext.Provider>
  );
};
