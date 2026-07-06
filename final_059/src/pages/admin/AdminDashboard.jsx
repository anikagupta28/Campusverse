import "./AdminDashboard.css";

export default function AdminDashboard(){

  return(
    <div>

      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Notices</h3>
          <p>Manage campus announcements</p>
        </div>

        <div className="dashboard-card">
          <h3>RiseWall</h3>
          <p>Student achievements</p>
        </div>

        <div className="dashboard-card">
          <h3>TalkNest</h3>
          <p>Student discussions</p>
        </div>

        <div className="dashboard-card">
          <h3>Alumni</h3>
          <p>Manage alumni profiles</p>
        </div>

        <div className="dashboard-card">
          <h3>Reviews</h3>
          <p>User feedback</p>
        </div>

      </div>

    </div>
  )
}