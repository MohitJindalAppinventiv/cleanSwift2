export default {
  LOGIN      : () => `/adminLogin`,
  REGISTER   : () => ``,
  FORGOT     : () => ``,
  LOGOUT     : () => `/adminLogout`,
  REFRESH_TOKEN :() => `/refreshToken`,
  RESET_PASSWORD : () => `/adminResetPassword`,
  ADMIN_CREATE_AREA :()=>`/createArea`,
  GET_AREAS: ()=>`/getAreas`,
  DELETE_AREA: ()=>`/deleteArea`,
  TOGGLE_AREA_ACTIVE: ()=>`/toggleAreaActive`,
  UPDATE_AREA: ()=>`/updateArea`,
  GET_ALL_COUPONS: ()=>`/getAllCoupons`,
  CREATE_COUPON: ()=>`/createCoupon`,
  TOGGLE_COUPON_STATUS: ()=>'',
  DELETE_COUPON: ()=>`/deleteCoupon`,
  UPDATE_COUPON: ()=>`updateCoupon`,
  GET_ALL_PRODUCTS: ()=>`/getAllProducts`,
  GET_PROFILE: ()=>`/getAdminProfile`,
  UPDATE_PHONE_NUMBER: ()=>`/adminUpdatePhoneNumber`,
  UPDATE_PASSWORD: ()=>`/adminChangePassword`,


  //SERVICES
  GET_ALL_SERVICES: ()=>`/getAllServices`,
  CREATE_SERVICE: ()=>`/createService`,
  TOGGLE_SERVICE_STATUS: ()=>'/changeStatusOfService',
  DELETE_SERVICE: ()=>`/deleteService`,
  UPDATE_SERVICE: ()=>`updateService`,

  //APP BANERS
  GET_ALL_BANNERS: ()=>`/getAllAppBanner`,
  CREATE_BANNER: ()=>`/createAppBanner`,
  TOGGLE_BANNER_STATUS: ()=>'/changeStatusAppBanner',
  DELETE_BANNER: ()=>`/deleteAppBanner`,
  UPDATE_BANNER: ()=>`updateAppBanner`,

  //CATEGORIES
  GET_ALL_CATEGORIES_BY_SERVICE_ID : ()=>`/getAllCategoriesByServiceId`,
  GET_ALL_CATEGORIES_BY_SERVICE_NAMES: ()=>`/getAllCategoriesWithServiceNames`,
  CREATE_CATEGORY: ()=>`/createCategory`,
  DELETE_CATEGORY: ()=>`/deleteCategory`,
  UPDATE_CATEGORY: ()=>`updateCategory`,

  //PRODUCTS
  GET_ALL_PRODUCT: ()=>`/getAllProducts`,
  GET_ALL_PRODUCT_BY_CATEGORY_ID: ()=>`/getAllProductsByCategoryId`,
  GET_ALL_PRODUCT_BY_SERVICE_ID: ()=>`/getProductByServiceId`,
  CREATE_PRODUCT: ()=>`/createProduct`,
  DELETE_PRODUCT: ()=>`/deleteProduct`,
  UPDATE_PRODUCT: ()=>`updateProduct`,
}; 