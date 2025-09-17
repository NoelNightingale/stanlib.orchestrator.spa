/* eslint-disable prettier/prettier */
import React, { useState, useContext } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AuthContext } from '../../../contexts/AuthContext.jsx'

const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('');

    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register(formData.username, formData.email, formData.password);
        } catch (err) {
            // Try to extract error message from backend response
            if (err && err.message) {
                setError(err.message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };


  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" name="username" onChange={handleChange} autoComplete="username" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" name="email" onChange={handleChange} autoComplete="email" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      onChange={handleChange}
                      value={formData.password}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      name="confirmPassword"
                      onChange={handleChange}
                      value={formData.confirmPassword}
                    />
                  </CInputGroup>
                  {error && (
                    <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
                  )}
                  <div className="d-grid">
                    <CButton color="success" onClick={handleSubmit}  type="submit">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
