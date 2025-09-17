/* eslint-disable prettier/prettier */
import React, { Suspense, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute';
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import { AuthProvider } from './contexts/AuthContext'
//import { AuthProvider.isAuthenticated } from './contexts/AuthContext'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  const token = AuthProvider.token;

//  const {isAuthenticated} = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <AuthProvider>

        <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />

          <Route path="*" name="Home" element={<ProtectedRoute>
                                                    <DefaultLayout />
                                                  </ProtectedRoute>} />

        </Routes>
        </AuthProvider>

      </Suspense>
    </HashRouter>
  )
}

export default App
