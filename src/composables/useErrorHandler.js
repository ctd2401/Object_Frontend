import { useRouter } from 'vue-router';

export const useErrorHandler = () => {
  const router = useRouter();

  const handle404Error = (error) => {
    if (error.response?.status === 404) {
      console.warn("Resource not found (404)");
      // Chuyển đến trang NotFound
      router.push('/404');
      return true; // Đã xử lý lỗi
    }
    return false; // Chưa xử lý lỗi
  };

  const handleApiError = (error) => {
    // Xử lý các loại lỗi khác nhau
    if (error.response?.status === 401) {
      console.warn("Yêu cầu không hợp lệ hoặc token đã hết hạn");
      // Có thể chuyển đến trang login
      // router.push('/login');
    } else if (error.response?.status === 403) {
      console.warn("Không có quyền truy cập");
    } else if (error.response?.status === 500) {
      console.error("Lỗi server");
    } else {
      console.error("Lỗi từ API:", error.response?.data || error.message);
    }
  };

  return {
    handle404Error,
    handleApiError
  };
};
