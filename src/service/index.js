import AuthService from './AuthService';
import CountryService from './CountryService';
import CustomerService from './CustomerService';
import NodeService from './NodeService';
import PhotoService from './PhotoService';
import ProductService from './ProductService';
import StoreService from './StoreService';
import MenuService from './MenuService';
import CategoryService from './CategoryService';
export const BaseService = {
  auth: AuthService,
  country: CountryService,
  store: StoreService,
  customer: CustomerService,
  node: NodeService,
  photo: PhotoService,
  product: ProductService,
  menu: MenuService,
  category: CategoryService,
};

export default BaseService;
