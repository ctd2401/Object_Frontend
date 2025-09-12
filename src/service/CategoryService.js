import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
export const CategoryService = {
  async getCategories(payload = {}) {
    try {
      const { page = 1, page_size = 12, keyword = '' } = payload || {};
      const q = keyword ? `&keyword=${encodeURIComponent(keyword)}` : '';
      const url = `${API_URL}/category/categories?page=${page}&page_size=${page_size}${q}`;
      const res = await axios.get(url);
      const results = Array.isArray(res?.data?.results) ? res.data.results : res.data;
      const total_pages = res?.data?.total_pages ?? 1;
      const current_page = res?.data?.current_page ?? page;
      return { success: true, data: results, meta: { total_pages, current_page } };
    } catch (error) {
      return { success: false, message: error?.message || 'Không thể lấy danh mục', error };
    }
  },
  async getCategory(idOrSlug) {
    try {
      const url = `${API_URL}/category/categories/${idOrSlug}`;
      const res = await axios.get(url);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, message: error?.message || 'Không thể lấy danh mục', error };
    }
  }
};
export default CategoryService;

