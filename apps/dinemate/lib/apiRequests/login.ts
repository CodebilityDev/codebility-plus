import { getCookie, setCookie } from 'cookies-next';
import createAxiosInstance from './Axios';

const login = async (data: any, tableSessionId:string|null) => {
  try {
    const Axios = createAxiosInstance(); // Create a new Axios instance with the latest cookie

    const res = await Axios.post(`/api/users/login${tableSessionId ? `?tableSessionId=${tableSessionId}` : ""}`, data);

    console.log(res);

   
    setCookie('session', res.data.session, {
      path: "/",
      httpOnly: false,
      secure: true, // Use secure flag in production
      sameSite: "none", // Set to "none" for cross-site requests
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return error.response?.data || { message: 'Unknown error' };
  }
};

export default login;
