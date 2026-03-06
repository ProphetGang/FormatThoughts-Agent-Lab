import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BlogHome } from './pages/BlogHome'
import { Labs } from './pages/Labs'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/labs" element={<Labs />} />
      </Routes>
    </BrowserRouter>
  )
}
