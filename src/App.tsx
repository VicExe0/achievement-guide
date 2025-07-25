import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '@/pages/home';
import Guide from '@/pages/guide';
import LoginSuccess from './pages/loginsuccess';

import "@/styles/custom.css";

const App = () => {
    return (
        <BrowserRouter basename="/achievement-guide">
            <Routes>
                <Route index element={<Home />} />
                <Route path="/guide/:game" element={<Guide />} />
                <Route path="/login-success" element={<LoginSuccess />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;