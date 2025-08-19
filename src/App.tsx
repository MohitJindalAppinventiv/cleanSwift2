// import { Provider } from 'react-redux';
// import { persistor, store } from './store';
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthGuard } from "@/components/auth/AuthGuard";
// import { PublicGuard } from '@/components/auth/PublicGuard';
// import { PersistGate } from 'redux-persist/integration/react';
// import Index from "./pages/Index";
// import OrdersPage from "./pages/orders";
// import OrderDetailsPage from "./pages/order-details";
// import CreateOrderPage from "./pages/order/create";
// import CustomersPage from "./pages/customers";
// import CustomerDetailsPage from "./pages/customer-details";
// import CreateCustomerPage from "./pages/customer/create";
// import ServicesConfigPage from "./pages/config/services";
// import ServiceEditPage from "./pages/service-config/edit";
// import ServiceCreatePage from "./pages/service-config/create";
// import AppBannerPage from "./pages/config/app-banner";
// import BannerCreatePage from "./pages/config/app-banner/create";
// import BannerEditPage from "@/pages/config/components/app-banner/BannerEditPage";
// import FCMConfigPage from "./pages/config/fcm";
// import AreaConfigPage from "./pages/config/area";
// import CategoriesConfigPage from "./pages/config/categories";
// import ProductsConfigPage from "./pages/config/products";
// import CouponsConfigPage from "./pages/config/coupons";
// import CreateCouponPage from "./pages/config/coupons/create";
// import LoginPage from "./pages/auth/login";
// import PaymentsPage from "./pages/payments";
// import ReviewsPage from "./pages/reviews";
// import NotificationsPage from "./pages/notifications";
// import SettingsPage from "./pages/settings";
// import NotFound from "./pages/NotFound";
// import Seed from "./pages/SeedPage";
// import ForgotPassword from './pages/auth/forgot-password';
// import SuccessPage from './pages/redirect-login';
// import AreaConfig from './pages/area-config';
// import ServicePage from "./pages/Service";
// import AppBanner from "./pages/AppBanner";
// import MapDemo from './pages/map-demo';
// import Temp from "./pages/Temp";
// import SlotsConfigPage from './pages/SlotsConfigPage';

// const queryClient = new QueryClient();

// const App = () => (
//   <Provider store={store}>
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <PersistGate loading={null} persistor={persistor}>
//           <BrowserRouter>
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/login" element={<PublicGuard><LoginPage /></PublicGuard>} />
//               <Route path="/forgot-password" element={<PublicGuard><ForgotPassword /></PublicGuard>} />
//               <Route path="/redirect-login" element={<PublicGuard><SuccessPage /></PublicGuard>} />
//               <Route path="/area-config" element={<AreaConfig />} />
//               <Route path="/AppBanner" element={<AppBanner />} />
//               <Route path="/Serv" element={<ServicePage />} />
//               <Route path="/temp" element={<Temp />} />
//               <Route path="/seed" element={<Seed />} />

//               {/* Protected Routes */}
//               <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
//               <Route path="/orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
//               <Route path="/order-details/:id" element={<AuthGuard><OrderDetailsPage /></AuthGuard>} />
//               <Route path="/order/create" element={<AuthGuard><CreateOrderPage /></AuthGuard>} />
//               <Route path="/customers" element={<AuthGuard><CustomersPage /></AuthGuard>} />
//               <Route path="/customers/create" element={<AuthGuard><CreateCustomerPage /></AuthGuard>} />
//               <Route path="/customer-details/:id" element={<AuthGuard><CustomerDetailsPage /></AuthGuard>} />
//               <Route path="/payments" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
//               <Route path="/reviews" element={<AuthGuard><ReviewsPage /></AuthGuard>} />
//               <Route path="/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
//               <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />

//               {/* Configuration Service */}
//               <Route path="/config/services" element={<AuthGuard><ServicesConfigPage /></AuthGuard>} />
//               <Route path="/config/services/edit/:id" element={<AuthGuard><ServiceEditPage /></AuthGuard>} />
//               <Route path="/config/services/create" element={<AuthGuard><ServiceCreatePage /></AuthGuard>} />
//               <Route path="/config/app-banner" element={<AuthGuard><AppBannerPage /></AuthGuard>} />
//               <Route path="/config/app-banner/create" element={<AuthGuard><BannerCreatePage /></AuthGuard>} />
//               <Route path="/config/app-banner/edit/:id" element={<AuthGuard><BannerEditPage /></AuthGuard>} />
//               <Route path="/config/fcm" element={<AuthGuard><FCMConfigPage /></AuthGuard>} />
//               <Route path="/config/area" element={<AuthGuard><AreaConfigPage /></AuthGuard>} />
//               <Route path="/config/categories" element={<AuthGuard><CategoriesConfigPage /></AuthGuard>} />
//               <Route path="/config/categories/:serviceId" element={<AuthGuard><CategoriesConfigPage /></AuthGuard>} />
//               <Route path="/config/products" element={<AuthGuard><ProductsConfigPage /></AuthGuard>} />
//               <Route path="/config/products/:serviceId" element={<AuthGuard><ProductsConfigPage /></AuthGuard>} />
//               <Route path="/config/coupons" element={<AuthGuard><CouponsConfigPage /></AuthGuard>} />
//               <Route path="/config/coupons/create" element={<AuthGuard><CreateCouponPage /></AuthGuard>} />
//               <Route path="/config/slots" element={<AuthGuard><SlotsConfigPage /></AuthGuard>} />

//               {/* Demo Routes */}
//               <Route path="/map-demo" element={<AuthGuard><MapDemo /></AuthGuard>} />

//               {/* Catch All routes */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </BrowserRouter>
//         </PersistGate>
//       </TooltipProvider>
//     </QueryClientProvider>
//   </Provider>
// );

// export default App;

import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PublicGuard } from "@/components/auth/PublicGuard";
import { PersistGate } from "redux-persist/integration/react";

// Lazy imports
const Index = lazy(() => import("./pages/Index"));
const OrdersPage = lazy(() => import("./pages/orders"));
const OrderDetailsPage = lazy(() => import("./pages/order-details"));
const CreateOrderPage = lazy(() => import("./pages/order/create"));
const CustomersPage = lazy(() => import("./pages/customer/customers"));
const CustomerDetailsPage = lazy(
  () => import("./pages/customer/customer-details")
);
const CreateCustomerPage = lazy(() => import("./pages/customer/create"));
const ServicesConfigPage = lazy(() => import("./pages/config/services"));
const ServiceEditPage = lazy(() => import("./pages/service-config/edit"));
const ServiceCreatePage = lazy(() => import("./pages/service-config/create"));
const AppBannerPage = lazy(() => import("./pages/config/app-banner"));
const BannerCreatePage = lazy(() => import("./pages/config/app-banner/create"));
const BannerEditPage = lazy(
  () => import("@/pages/config/components/app-banner/BannerEditPage")
);
const FCMConfigPage = lazy(() => import("./pages/config/fcm"));
const AreaConfigPage = lazy(() => import("./pages/config/area"));
const CategoriesConfigPage = lazy(() => import("./pages/config/categories"));
const ProductsConfigPage = lazy(() => import("./pages/config/products"));
const CouponsConfigPage = lazy(() => import("./pages/coupons/coupons"));
const CreateCouponPage = lazy(() => import("./pages/config/coupons/create"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const PaymentsPage = lazy(() => import("./pages/payments"));
const ReviewsPage = lazy(() => import("./pages/reviews"));
const NotificationsPage = lazy(() => import("./pages/notifications"));
const SettingsPage = lazy(() => import("./pages/settings/settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Seed = lazy(() => import("./pages/SeedPage/SeedPage"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const SuccessPage = lazy(() => import("./pages/redirect-login"));
const AreaConfig = lazy(() => import("./pages/initial/area-config"));
const ServicePage = lazy(() => import("./pages/Service"));
const AppBanner = lazy(() => import("./pages/initial/AppBanner"));
const MapDemo = lazy(() => import("./pages/map-demo"));
const Temp = lazy(() => import("./pages/temp/Temp"));
const SlotsConfigPage = lazy(() => import("./pages/slots/SlotsConfigPage"));
import LaundryPageLoader from "./PageLoading";
const queryClient = new QueryClient();

const AppRoutes = () => {
  const routes = [
    // Public routes
    {
      path: "/login",
      element: (
        <PublicGuard>
          <LoginPage />
        </PublicGuard>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicGuard>
          <ForgotPassword />
        </PublicGuard>
      ),
    },
    {
      path: "/redirect-login",
      element: (
        <PublicGuard>
          <SuccessPage />
        </PublicGuard>
      ),
    },
    { path: "/area-config", element: <AreaConfig /> },
    { path: "/AppBanner", element: <AppBanner /> },
    { path: "/Serv", element: <ServicePage /> },
    { path: "/temp", element: <Temp /> },
    { path: "/seed", element: <Seed /> },

    // Protected routes
    {
      path: "/",
      element: (
        <AuthGuard>
          <Index />
        </AuthGuard>
      ),
    },
    {
      path: "/orders",
      element: (
        <AuthGuard>
          <OrdersPage />
        </AuthGuard>
      ),
    },
    {
      path: "/order-details/:id",
      element: (
        <AuthGuard>
          <OrderDetailsPage />
        </AuthGuard>
      ),
    },
    {
      path: "/order/create",
      element: (
        <AuthGuard>
          <CreateOrderPage />
        </AuthGuard>
      ),
    },
    {
      path: "/customers",
      element: (
        <AuthGuard>
          <CustomersPage />
        </AuthGuard>
      ),
    },
    {
      path: "/customers/create",
      element: (
        <AuthGuard>
          <CreateCustomerPage />
        </AuthGuard>
      ),
    },
    {
      path: "/customer-details/:id",
      element: (
        <AuthGuard>
          <CustomerDetailsPage />
        </AuthGuard>
      ),
    },
    {
      path: "/payments",
      element: (
        <AuthGuard>
          <PaymentsPage />
        </AuthGuard>
      ),
    },
    {
      path: "/reviews",
      element: (
        <AuthGuard>
          <ReviewsPage />
        </AuthGuard>
      ),
    },
    {
      path: "/notifications",
      element: (
        <AuthGuard>
          <NotificationsPage />
        </AuthGuard>
      ),
    },
    {
      path: "/settings",
      element: (
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      ),
    },

    // Config
    {
      path: "/config/services",
      element: (
        <AuthGuard>
          <ServicesConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/services/edit/:id",
      element: (
        <AuthGuard>
          <ServiceEditPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/services/create",
      element: (
        <AuthGuard>
          <ServiceCreatePage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/app-banner",
      element: (
        <AuthGuard>
          <AppBannerPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/app-banner/create",
      element: (
        <AuthGuard>
          <BannerCreatePage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/app-banner/edit/:id",
      element: (
        <AuthGuard>
          <BannerEditPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/fcm",
      element: (
        <AuthGuard>
          <FCMConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/area",
      element: (
        <AuthGuard>
          <AreaConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/categories",
      element: (
        <AuthGuard>
          <CategoriesConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/categories/:serviceId",
      element: (
        <AuthGuard>
          <CategoriesConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/products",
      element: (
        <AuthGuard>
          <ProductsConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/products/:serviceId",
      element: (
        <AuthGuard>
          <ProductsConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/coupons",
      element: (
        <AuthGuard>
          <CouponsConfigPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/coupons/create",
      element: (
        <AuthGuard>
          <CreateCouponPage />
        </AuthGuard>
      ),
    },
    {
      path: "/config/slots",
      element: (
        <AuthGuard>
          <SlotsConfigPage />
        </AuthGuard>
      ),
    },

    // Demo
    {
      path: "/map-demo",
      element: (
        <AuthGuard>
          <MapDemo />
        </AuthGuard>
      ),
    },

    // Not found
    { path: "*", element: <NotFound /> },
  ];

  return useRoutes(routes);
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Suspense fallback={<LaundryPageLoader />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </PersistGate>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
