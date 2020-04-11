import Axios from 'axios';
export const getProduct = () => {
  return {
    type: 'GET_PRODUCT',
    payload: Axios.get('http://54.158.219.28:8011/api/v1/product/'),
  };
};
