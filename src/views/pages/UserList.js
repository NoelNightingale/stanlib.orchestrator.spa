import React, { useContext, useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CToast,
  CToastBody,
  CToaster,
} from "@coreui/react";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchUsers, deleteUser } from "../../api/user_api";
import { useNavigate } from "react-router-dom";
import UserGrants from "../users/UserGrants";

const UserList = () => {
  const { token, scopes } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(token);
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, token);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError("Failed to delete user");
      setShowToast(true);
    }
    setDeleteId(null);
  };

  const canEdit = scopes.includes("admin");

  if (selectedUserId) {
    return (
      <UserGrants
        userId={selectedUserId}
        token={token}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>User Management</span>
            {canEdit && (
              <CButton
                color="primary"
                onClick={() => navigate("/users/create")}
              >
                Add User
              </CButton>
            )}
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <CSpinner />
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Active</CTableHeaderCell>
                    {canEdit && <CTableHeaderCell>Actions</CTableHeaderCell>}
                    {canEdit && <CTableHeaderCell>Grants</CTableHeaderCell>}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell>{user.id}</CTableDataCell>
                      <CTableDataCell>{user.username}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        {user.is_active ? "Yes" : "No"}
                      </CTableDataCell>
                      {canEdit && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="info"
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                            className="me-2"
                          >
                            Edit
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            onClick={() => setDeleteId(user.id)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      )}
                      {canEdit && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="secondary"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            Manage Grants
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
            {deleteId && (
              <div className="mt-3">
                <span>Are you sure you want to delete this user?</span>
                <CButton
                  color="danger"
                  className="ms-2"
                  onClick={() => handleDelete(deleteId)}
                >
                  Yes, Delete
                </CButton>
                <CButton
                  color="secondary"
                  className="ms-2"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </CButton>
              </div>
            )}
            <CToaster placement="top-end">
              {showToast && (
                <CToast
                  color="danger"
                  visible
                  autohide
                  onClose={() => setShowToast(false)}
                >
                  <CToastBody>{error}</CToastBody>
                </CToast>
              )}
            </CToaster>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserList;
