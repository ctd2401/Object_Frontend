<template>
  <!-- <div class ="dashboard-root">123</div> -->
  <img src="../img/background/obj_background.jpg" alt="logo" class="fullscreen-image" />
  <!-- <div class="dashboard-root">
    <div class="leaves-layer">
      <span class="leaf" style="--x: 6%; --y: 12%; --s: 0.9; --rot: 12deg"></span>
      <span class="leaf" style="--x: 22%; --y: 8%; --s: 0.7; --rot: -8deg"></span>
      <span class="leaf" style="--x: 38%; --y: 18%; --s: 1.1; --rot: 20deg"></span>
      <span class="leaf" style="--x: 58%; --y: 10%; --s: 0.8; --rot: -15deg"></span>
      <span class="leaf" style="--x: 78%; --y: 14%; --s: 0.95; --rot: 6deg"></span>
      <span class="leaf" style="--x: 12%; --y: 42%; --s: 1; --rot: -5deg"></span>
      <span class="leaf" style="--x: 30%; --y: 46%; --s: 0.85; --rot: 18deg"></span>
      <span class="leaf" style="--x: 50%; --y: 40%; --s: 1.2; --rot: -12deg"></span>
      <span class="leaf" style="--x: 70%; --y: 48%; --s: 0.75; --rot: 9deg"></span>
      <span class="leaf" style="--x: 16%; --y: 76%; --s: 0.9; --rot: -18deg"></span>
      <span class="leaf" style="--x: 44%; --y: 80%; --s: 0.8; --rot: 4deg"></span>
      <span class="leaf" style="--x: 78%; --y: 78%; --s: 1.05; --rot: -10deg"></span>
    </div>

    <p class="p_style">THE OBJECT XIN CHÀO</p>
    <p class="p_style">🪵 Chính sách mua hàng</p>
    <p class="p_style">
      Các nàng tham khảo sản phẩm tại trang web, sau đó tư vấn size và mua hàng tại
      Instagram của shop là
      <a href="https://www.instagram.com/ob.jct" class="p_link">@ob.jct</a> nhé
    </p>
    <p class="p_style">
      Hầu hết các đơn hàng đều cọc từ 80% trở lên và không nhận ship COD ạ
    </p>
    <p class="p_style">Bật mí: OBJECT nhận ship COD đối với hàng có sẵn nha</p>
    <p class="p_style">
      🪵 Hàng sẽ về sau 3 tuần ạ (nếu có sự thay đổi OBJECT sẽ báo lại nhaa), ngoài ra, mỗi
      đơn hàng sau khi lên đơn đều sẽ được gửi mã vận đơn để được theo dõi kĩ hơn nè.
    </p>
    <p class="p_style">Chính sách đổi trả</p>
    <p class="p_style">
      OBJECT hiện KHÔNG đổi trả dưới mọi hình thức, tuy nhiên, trong trường hợp bị mất
      hàng do lỗi vận chuyển, OBJECT sẽ chịu trách nhiệm đền bù thiệt hại hoặc refund 100%
      nha
    </p>
    <p class="p_style">Thông tin của chúng mình</p>
    <p class="p_style">
      🪵 Website mua hàng:
      <a href="http://objct.com.vn" class="p_link">objct.com.vn</a>
    </p>
    <p class="p_style">
      🪵 Instagram: <a href="https://www.instagram.com/ob.jct" class="p_link">@ob.jct</a>
    </p>
    <p class="p_style">
      🪵 Tiktok: <a href="https://www.tiktok.com/@ob.jct" class="p_link"> @ob.jct</a>
    </p>
  </div> -->
</template>

<script setup>
// import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
// import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
// import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
// import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
// import StatsWidget from '@/components/dashboard/StatsWidget.vue';
</script>

<style scoped>
/* body,
html {
  background-image: src= "../img/background/obj_background.jpg";
  background-size: cover;
  background-position: center;
  background-color: #ccb999;
  min-height: 100vh;
  margin-bottom: 0;
  margin-top: -15px;
  margin-right: -14px;
  margin-left: -14px;
} */
html,
body {
  height: 100%;
  margin: 0;
  background-color: #5e1803;
}
.dashboard-root {
  position: relative;
  min-height: calc(100vh - var(--layout-header-height));
  overflow: hidden;
  padding: 2rem;
}
.leaves-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
/* Single maple leaf using inline SVG as background */
.leaves-layer .leaf {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: calc(110px * var(--s));
  height: calc(110px * var(--s));
  transform: rotate(var(--rot));
  opacity: 0.85; /* subtle but more visible watermark */
  background-repeat: no-repeat;
  background-size: contain;
  filter: saturate(0.8) contrast(0.9);
  /* background-image: url("https://wineandfood.vn/image/catalog/anh-bai-viet/cac-loai-thuc-pham-khac/siro-cay-la-phong/chiec-la-phong.jpg"); */
}

/* subtle repeating background to ensure visibility across the whole area */
.dashboard-root::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.07;
  background-image: url("https://wineandfood.vn/image/catalog/anh-bai-viet/cac-loai-thuc-pham-khac/siro-cay-la-phong/chiec-la-phong.jpg");
  background-size: 160px 160px;
  background-repeat: repeat;
}
.p_style {
  font-size: 40px;
  font-family: "Playfair Display", serif;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
}
.p_link {
  font-size: 40px;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 25px;
  text-decoration: underline;
  font-style: italic;
  position: relative;
  z-index: 1;
}
.p_link:hover {
  color: white;
}
/* Apply default background to everything unless overridden */
/*  */
.fullscreen-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ensures the image covers the screen */
  position: fixed; /* Keeps it fixed in place */
  top: 0;
  left: 0;
  z-index: -1; /* Sends it behind content */
}
</style>
