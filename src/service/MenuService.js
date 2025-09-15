import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const MenuService = {
  getData() {
    return data;
  },
  async getProducts(payload = {}) {
    try {
      const { page = 1, page_size = 12, raw = false, keyword = '', category = '' } = payload || {};
      const q = keyword ? `&keyword=${encodeURIComponent(keyword)}` : '';
      const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
      const url = `${API_URL}/product/products?page=${page}&page_size=${page_size}${q}${categoryParam}`;
      const res = await axios.get(url);
      const results = Array.isArray(res?.data?.results) ? res.data.results : res.data;
      if (raw) {
        const total_pages = res?.data?.total_pages ?? 1;
        const current_page = res?.data?.current_page ?? page;
        return { success: true, data: results, meta: { total_pages, current_page } };
      }
      // Enrich with price from detail endpoint (origin_price)
      const enriched = await Promise.all(
        (results || []).map(async (item) => {
          try {
            const detailRes = await axios.get(`${API_URL}/product/products/${item.id}`);
            const detail = detailRes.data || {};
            return { ...item, origin_price: detail.origin_price, image: detail.image || item.image_url };
          } catch {
            return item;
          }
        })
      );
      const total_pages = res?.data?.total_pages ?? 1;
      const current_page = res?.data?.current_page ?? page;
      return {
        success: true,
        data: enriched,
        meta: { total_pages, current_page }
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Không thể lấy danh sách sản phẩm',
        error
      };
    }
  },
  async getProduct(idOrSlug) {
    try {
      const url = `${API_URL}/product/products/${idOrSlug}`;
      const res = await axios.get(url);
      return {
        success: true,
        data: res.data
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Không thể lấy dữ liệu sản phẩm',
        error
      };
    }
  }
};
export default MenuService;
const data = [
  {
    "id": 1,
    "name": "meo cam",
    "slug": "meo-cam",
    "description": "con meo cam",
    "code": "ORCAT",
    "origin_price": 500000.0,
    "category": "Mèo",
    "available": true,
    "image": "http://res.cloudinary.com/dhrwpx1cy/image/upload/v1757484314/kiscmd5bbinmbnkcooex.jpg",
    "created_at": "2025-09-10T06:05:14.591903Z",
    "updated_at": "2025-09-10T06:05:14.591935Z",
    "variants": {
        "Age": [
            {
                "id": 2,
                "name": "5y",
                "type": "Age",
                "price_diff": -50000.0,
                "available": true,
                "image": "https://res.cloudinary.com/dhrwpx1cy/image/upload/v1757580408/azxfp9zqkmz6fn2wzh4u.jpg"
            },
            {
                "id": 3,
                "name": "1y",
                "type": "Age",
                "price_diff": 0.0,
                "available": true,
                "image": "http://res.cloudinary.com/dhrwpx1cy/image/upload/v1757488173/ef6pf2ltfya3yko27quo.jpg"
            }
        ],
        "Size": [
            {
                "id": 1,
                "name": "S",
                "type": "Size",
                "price_diff": -200000.0,
                "available": true,
                "image": "http://res.cloudinary.com/dhrwpx1cy/image/upload/v1757488003/aouwebjz2dwtg8nuraez.jpg"
            }
        ]
    }
  }
];

