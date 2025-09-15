import { useRouter } from 'vue-router';

export default {
  install(app) {
    // Global error handler cho Vue
    app.config.errorHandler = (err, instance, info) => {
      console.error('Global Vue Error:', err, info);
      
      // Xử lý lỗi 404 từ API
      if (err.is404 || (err.response && err.response.status === 404)) {
        const router = useRouter();
        router.push('/404');
      }
    };

    // Global error handler cho unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      // Xử lý lỗi 404 từ API
      if (event.reason && (event.reason.is404 || (event.reason.response && event.reason.response.status === 404))) {
        window.location.href = '/404';
      }
    });
  }
};
