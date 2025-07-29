import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
    baseURL,
    headers : {
        "Content-Type" : "application/json",
        Accept: "application/json",
    },
})
// Thêm interceptors vào request
apiClient.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem("accessToken")
    if(token){
      //thêm token vào header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    };
    return config; // Trả về config đã chỉnh sửa
  },
  (error) =>{
    //Xử lý lỗi trong quá trình gửi request
    return Promise.reject(error);
  }
)

//Thêm interceptors vào response
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  (error) => {
    if(error.response?.status === 401){
      console.warn("Yêu cầu không hợp lệ hoặc token đã hết hạn ")
    }
    console.error("Lỗi từ API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;