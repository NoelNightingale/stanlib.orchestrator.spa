import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  fetchUserGrants,
  addUserGrant,
  deleteUserGrant,
  fetchAllGrants,
  fetchUserById,
} from "../../api/user_api";
import { CFormSwitch, CButton, CSpinner } from "@coreui/react";

const UserGrants = ({ userId, token, onBack }) => {
  const [allGrants, setAllGrants] = useState([]);
  const [assignedGrantIds, setAssignedGrantIds] = useState([]);
  const [switchState, setSwitchState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadGrants = async () => {
      setLoading(true);
      try {
        const [all, assigned, user] = await Promise.all([
          fetchAllGrants(token),
          fetchUserGrants(userId, token),
          fetchUserById(userId, token),
        ]);
        setAllGrants(all);
        const assignedIds = assigned.map((g) => g.id);
        setAssignedGrantIds(assignedIds);
        // Initialize switch state
        const state = {};
        all.forEach((g) => {
          state[g.id] = assignedIds.includes(g.id);
        });
        setSwitchState(state);
        setUsername(user.username || "");
      } finally {
        setLoading(false);
      }
    };
    loadGrants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSwitchChange = (grantId) => {
    // Toggle the switch state for the specific grant
    setSwitchState((prev) => ({ ...prev, [grantId]: !prev[grantId] }));
  };

  const handleSave = async () => {
    console.log("SAVING CHANGES...");
    setSaving(true);
    try {
      const toAssign = allGrants.filter(
        (g) => switchState[g.id] && !assignedGrantIds.includes(g.id),
      );
      const toRemove = allGrants.filter(
        (g) => !switchState[g.id] && assignedGrantIds.includes(g.id),
      );
      // Assign new grants
      for (const grant of toAssign) {
        await addUserGrant(userId, { id: grant.id }, token);
      }
      // Remove unassigned grants
      for (const grant of toRemove) {
        await deleteUserGrant(userId, grant.id, token);
      }
      // Refresh state
      const assigned = allGrants.filter((g) => switchState[g.id]);
      setAssignedGrantIds(assigned.map((g) => g.id));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Grants for {username}</h2>
      {loading ? (
        <CSpinner />
      ) : (
        <form>
          {allGrants.map((grant) => (
            <div key={grant.id} style={{ marginBottom: 12 }}>
              <CFormSwitch
                id={`grant-switch-${grant.id}`}
                label={grant.name}
                checked={!!switchState[grant.id]}
                onChange={() => handleSwitchChange(grant.id)}
              />
            </div>
          ))}
          <div className="mt-3" style={{ display: "flex", gap: "8px" }}>
            <CButton color="secondary" onClick={onBack} disabled={saving}>
              Back
            </CButton>
            <CButton color="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </CButton>
          </div>
        </form>
      )}
    </div>
  );
};

UserGrants.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  token: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default UserGrants;
