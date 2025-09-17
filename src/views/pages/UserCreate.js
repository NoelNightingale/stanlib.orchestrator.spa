import React, { useContext, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormSwitch, CRow, CToast, CToastBody, CToaster } from '@coreui/react';
import { AuthContext } from '../../contexts/AuthContext';
import { createUser } from '../../api/user_api';
import { useNavigate } from 'react-router-dom';

const UserCreate = () => {
  const { token, scopes } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', is_active: true });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(form, token);
      navigate('/users');
    } catch (err) {
      setError('Failed to create user');
      setShowToast(true);
    }
  };

  if (!scopes.includes('admin')) {
    return <div>Unauthorized</div>;
  }

  return (
    <CRow>
      <CCol md={8} className="mx-auto">
        <CCard>
          <CCardHeader>Create User</CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormInput className="mb-3" label="Username" name="username" value={form.username} onChange={handleChange} required />
              <CFormInput className="mb-3" label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />
              <CFormSwitch className="mb-3" label="Active" name="is_active" checked={form.is_active} onChange={handleChange} />
              <div className="d-flex justify-content-end">
                <CButton color="secondary" className="me-2" onClick={() => navigate('/users')}>Cancel</CButton>
                <CButton color="success" type="submit">Create</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
        <CToaster placement="top-end">
          {showToast && (
            <CToast color="danger" visible autohide onClose={() => setShowToast(false)}>
              <CToastBody>{error}</CToastBody>
            </CToast>
          )}
        </CToaster>
      </CCol>
    </CRow>
  );
};

export default UserCreate;
