import AdminPage from "../pages/AdminPage/AdminPage";
import BuildPC from "../pages/BuildPC/BuildPC";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import HomePage from "../pages/HomePage/HomePage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TrangChu from "../pages/TrangChu/TrangChu";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import TypeProductPageBuildPC from "../pages/TypeProductPageBuildPC/TypeProductPageBuildPC";
export const routes = [
    {
        path: '/',
        page: TrangChu,
        isShowHeader:false
    },
    {
        path: '/allproduct',
        page: HomePage,
        isShowHeader:true
    },
    {
        path: '/buildpc',
        page: BuildPC,
        isShowHeader:true
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader:true
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader:true
    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
        isShowHeader:true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader:true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader:true
    },
    {
        path: '/product-buildpc/:type',
        page: TypeProductPageBuildPC,
        isShowHeader:true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader:false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader:false
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader:true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader:true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader:true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]