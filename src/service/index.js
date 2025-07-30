import CountryService from './CountryService';
import CustomerService from './CustomerService';
import NodeService from './NodeService';
import PhotoService from './PhotoService';
import ProductService from './ProductService';
import StoreService from './StoreService';

export const BaseService = {
  country: CountryService,
  store: StoreService,
  customer: CustomerService,
  node: NodeService,
  photo: PhotoService,
  product: ProductService
};

export default BaseService;
