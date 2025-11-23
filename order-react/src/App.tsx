import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import { OrderProvider } from './context/OrderContext';
import { OrderItemProvider } from './context/OrderItemContext';
import { UserProvider } from './context/UserContext';
import { ItemProvider } from './context/ItemContext';
import { CategoryProvider } from './context/CategoryContext';
import './styles/global.scss';

function App() {
  return (
    <UserProvider>
      <OrderProvider>
        <OrderItemProvider>
          <ItemProvider>
            <CategoryProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CategoryProvider>
          </ItemProvider>
        </OrderItemProvider>
      </OrderProvider>
    </UserProvider>
  );
}

export default App;
