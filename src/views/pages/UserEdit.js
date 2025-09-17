import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormSwitch, CRow, CSpinner, CToast, CToastBody, CToaster } from '@coreui/react';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchUserById, updateUser } from '../../api/user_api';

const UserEdit = () => {
  const { id } = useParams();
  const { token, scopes } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', is_active: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserById(id, token);
        setForm({ username: data.username, email: data.email, is_active: data.is_active });
      } catch (err) {
        setError('Failed to load user');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, form, token);
      navigate('/users');
    } catch (err) {
      setError('Failed to update user');
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
          <CCardHeader>Edit User</CCardHeader>
          <CCardBody>
            {loading ? <CSpinner /> : (
              <CForm onSubmit={handleSubmit}>
                <CFormInput className="mb-3" label="Username" name="username" value={form.username} onChange={handleChange} required />
                <CFormInput className="mb-3" label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />
                <CFormSwitch className="mb-3" label="Active" name="is_active" checked={form.is_active} onChange={handleChange} />
                <div className="d-flex justify-content-end">
                  <CButton color="secondary" className="me-2" onClick={() => navigate('/users')}>Cancel</CButton>
                  <CButton color="success" type="submit">Save</CButton>
                </div>
              </CForm>
            )}
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

export default UserEdit;
