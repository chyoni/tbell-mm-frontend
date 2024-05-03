import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { logAdminIn } from '../api/auth';

interface IAuthContext {
  token: string | null;
  login: (userData: ILoginData) => void;
  logout: () => void;
}

interface ILoginData {
  username: string;
  password: string;
}

// Context 생성
const AuthContext = createContext<IAuthContext>({
  token: null,
  login(ILoginData) {},
  logout() {},
});

// Context를 사용하기 쉽게 하는 Custom Hook
export const useAuth = () => useContext(AuthContext);

// Provider 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      setToken(jwt);
    }
  }, []);

  const login = async (userData: ILoginData) => {
    const responseBody = await logAdminIn(userData.username, userData.password);

    const accessTokenKeyValue = responseBody.split(';')[0];
    const refreshTokenKeyValue = responseBody.split(';')[1];

    const accessToken = accessTokenKeyValue.split('=')[1];
    const refreshToken = refreshTokenKeyValue.split('=')[1];
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
