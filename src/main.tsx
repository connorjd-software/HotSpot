import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login.tsx'
import PostForm from './components/PostForm.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import SignUpForm from './components/SignUpForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/signup' element={<SignUpForm/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/user-post' element={<PostForm/>}/>
    </Routes>
    </BrowserRouter> 
  </StrictMode>,
)
