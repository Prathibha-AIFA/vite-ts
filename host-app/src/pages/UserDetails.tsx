import React from "react";
import "./UserDetails.css";

interface UserEvent {
  username: string;
  type: "login" | "logout";
  timestamp: string;
}

interface UserDetailsProps {
  events: UserEvent[];
  user: string | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({ events, user }) => {
  const filtered = user ? events.filter((e) => e.username === user) : [];

  return (
  <div className="user-container">
    <div className="user-card">
      <h2 className="user-title">User Login / Logout Details</h2>

      {filtered.length > 0 ? (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Type</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => (
                <tr key={idx}>
                  <td>{event.username}</td>
                  <td
                    className={
                      event.type === "login" ? "login-type" : "logout-type"
                    }
                  >
                    {event.type}
                  </td>
                  <td>{event.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-events">No events found for this user.</p>
      )}
    </div>
  </div>
  );
}

export default UserDetails;
