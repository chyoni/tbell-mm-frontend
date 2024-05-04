import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

/* (요청 인터셉터) 매 요청마다 accessToken, refreshToken을 파라미터로 추가하는게 아니라 interceptor를 이용해서 간단하게 할 수 있다.
instance.interceptors.request.use(request => {
  // 각 요청에 Authorization 헤더 추가
  const accessToken = localStorage.getItem('token');
  if (accessToken) {
      request.headers['Access-Token'] = accessToken;
  }
  return request;
  }, error => {
  return Promise.reject(error);
}) 
*/

let isRefreshing = false;

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (
      error.response.status === 401 &&
      error.response.data === 'access token expired' &&
      !originalRequest._retry
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refreshToken');

        try {
          // Refresh Token을 사용하여 Access Token 갱신
          const response = await axios.post(
            'http://localhost:9090/mm/api/v1/auth/reissue',
            { refreshToken },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );

          const newAccessToken = response.data.data.newAccessToken;
          const newRefreshToken = response.data.data.newRefreshToken;

          localStorage.setItem('token', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // 새 Access Token으로 헤더 설정
          instance.defaults.headers.common['Access-Token'] = newAccessToken;
          originalRequest.headers['Access-Token'] = newAccessToken;

          // 원본 요청 다시 실행
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh Token 또한 만료되었을 경우, 로그인 화면으로 리다이렉트
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/mms';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export const loginInstance = axios.create({
  baseURL: process.env.REACT_APP_LOGIN_URL,
  withCredentials: true,
});
