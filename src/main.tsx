import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Home.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostForm from './components/PostForm.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import SignUpForm from './components/SignUpForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/app' element={<App/>}/>
        <Route path='/signup' element={<SignUpForm/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/user-post' element={<PostForm isLoaded={true}/>}/>
    </Routes>
    </BrowserRouter> 
  </StrictMode>,
)
