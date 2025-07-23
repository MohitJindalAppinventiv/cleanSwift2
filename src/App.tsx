
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import OrdersPage from "./pages/orders";
import OrderDetailsPage from "./pages/order-details";
import CreateOrderPage from "./pages/order/create";
import CustomersPage from "./pages/customers";
import CustomerDetailsPage from "./pages/customer-details";
import CreateCustomerPage from "./pages/customer/create";
import ServicesConfigPage from "./pages/config/services";
import ServiceEditPage from "./pages/service-config/edit";
import ServiceCreatePage from "./pages/service-config/create";
import AppBannerPage from "./pages/config/app-banner";
import BannerCreatePage from "./pages/config/app-banner/create";
import FCMConfigPage from "./pages/config/fcm";
import AreaConfigPage from "./pages/config/area";
import CategoriesConfigPage from "./pages/config/categories";
import ProductsConfigPage from "./pages/config/products";
import ProductCreatePage from "./pages/config/products/create";
import CouponsConfigPage from "./pages/config/coupons";
import CreateCouponPage from "./pages/config/coupons/create";
import LoginPage from "./pages/auth/login";
import PaymentsPage from "./pages/payments";
import ReviewsPage from "./pages/reviews";
import NotificationsPage from "./pages/notifications";
import SettingsPage from "./pages/settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
            <Route path="/orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
            <Route path="/order-details/:id" element={<AuthGuard><OrderDetailsPage /></AuthGuard>} />
            <Route path="/order/create" element={<AuthGuard><CreateOrderPage /></AuthGuard>} />
            <Route path="/customers" element={<AuthGuard><CustomersPage /></AuthGuard>} />
            <Route path="/customers/create" element={<AuthGuard><CreateCustomerPage /></AuthGuard>} />
            <Route path="/customer-details/:id" element={<AuthGuard><CustomerDetailsPage /></AuthGuard>} />
              <Route path="/payments" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
              <Route path="/reviews" element={<AuthGuard><ReviewsPage /></AuthGuard>} />
              <Route path="/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
              <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
            <Route path="/config/services" element={<AuthGuard><ServicesConfigPage /></AuthGuard>} />
            <Route path="/config/services/edit/:id" element={<AuthGuard><ServiceEditPage /></AuthGuard>} />
            <Route path="/config/services/create" element={<AuthGuard><ServiceCreatePage /></AuthGuard>} />
            <Route path="/config/app-banner" element={<AuthGuard><AppBannerPage /></AuthGuard>} />
            <Route path="/config/app-banner/create" element={<AuthGuard><BannerCreatePage /></AuthGuard>} />
            <Route path="/config/fcm" element={<AuthGuard><FCMConfigPage /></AuthGuard>} />
            <Route path="/config/area" element={<AuthGuard><AreaConfigPage /></AuthGuard>} />
            <Route path="/config/categories" element={<AuthGuard><CategoriesConfigPage /></AuthGuard>} />
            <Route path="/config/products" element={<AuthGuard><ProductsConfigPage /></AuthGuard>} />
            <Route path="/config/products/create" element={<AuthGuard><ProductCreatePage /></AuthGuard>} />
            <Route path="/config/coupons" element={<AuthGuard><CouponsConfigPage /></AuthGuard>} />
            <Route path="/config/coupons/create" element={<AuthGuard><CreateCouponPage /></AuthGuard>} />
            
            {/* Catch-all and not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
  </Provider>
);

export default App;
