<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="not-found-container">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- 404 Illustration -->
      <div class="illustration-section">
        <div class="error-number">404</div>
        <div class="error-icon">
          <i class="pi pi-search"></i>
        </div>
      </div>

      <!-- Error Message -->
      <div class="message-section">
        <h1 class="error-title">Oops! Trang không tìm thấy</h1>
        <p class="error-description">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <p class="error-suggestion">
          Có thể bạn đã nhập sai địa chỉ hoặc trang này đã được thay đổi.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="action-section">
        <Button 
          label="Về trang chủ" 
          icon="pi pi-home" 
          @click="goHome"
          class="primary-button"
        />
        <Button 
          label="Quay lại" 
          icon="pi pi-arrow-left" 
          @click="goBack"
          severity="secondary"
          class="secondary-button"
        />
      </div>

      <!-- Helpful Links -->
      <div class="help-section">
        <h3 class="help-title">Có thể bạn quan tâm:</h3>
        <div class="help-links">
          <router-link to="/" class="help-link">
            <i class="pi pi-home"></i>
            <span>Trang chủ</span>
          </router-link>
          <router-link to="/category" class="help-link">
            <i class="pi pi-tags"></i>
            <span>Danh mục sản phẩm</span>
          </router-link>
          <router-link to="/product" class="help-link">
            <i class="pi pi-shopping-bag"></i>
            <span>Sản phẩm</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ccb999 0%, #b8a68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Background Pattern */
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 129, 118, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(120, 129, 118, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 129, 118, 0.05) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
}

/* Content Wrapper */
.content-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  max-width: 600px;
  width: 90%;
  position: relative;
  z-index: 1;
}

/* Illustration Section */
.illustration-section {
  margin-bottom: 2rem;
  position: relative;
}

.error-number {
  font-size: 8rem;
  font-weight: 900;
  color: #788176;
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.error-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: rgba(120, 129, 118, 0.3);
  animation: search 3s ease-in-out infinite;
}

@keyframes search {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-50%, -50%) rotate(10deg); }
  75% { transform: translate(-50%, -50%) rotate(-10deg); }
}

/* Message Section */
.message-section {
  margin-bottom: 2.5rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.error-description {
  font-size: 1.2rem;
  color: #5a6b5f;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.error-suggestion {
  font-size: 1rem;
  color: #7a8b7f;
  line-height: 1.5;
}

/* Action Section */
.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.primary-button {
  background: linear-gradient(135deg, #788176, #5a6b5f) !important;
  border: none !important;
  padding: 0.75rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.primary-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(120, 129, 118, 0.3) !important;
}

.secondary-button {
  background: rgba(120, 129, 118, 0.1) !important;
  color: #788176 !important;
  border: 2px solid #788176 !important;
  padding: 0.75rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.secondary-button:hover {
  background: #788176 !important;
  color: white !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(120, 129, 118, 0.3) !important;
}

/* Help Section */
.help-section {
  border-top: 1px solid rgba(120, 129, 118, 0.2);
  padding-top: 2rem;
}

.help-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.help-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.help-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(120, 129, 118, 0.1);
  border-radius: 12px;
  text-decoration: none;
  color: #788176;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.help-link:hover {
  background: #788176;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(120, 129, 118, 0.3);
  border-color: #5a6b5f;
}

.help-link i {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .error-number {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1.1rem;
  }
  
  .action-section {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 250px;
  }
  
  .help-links {
    flex-direction: column;
    align-items: center;
  }
  
  .help-link {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-number {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .content-wrapper {
    padding: 1.5rem 1rem;
  }
}
</style>
