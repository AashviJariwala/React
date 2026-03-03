const AdminBackgroundLayout = ({ children }) => {
    return (
      <div className="app-background">
        <div className="app-content">
          {children}
        </div>
      </div>
    );
  };
  
  export default AdminBackgroundLayout;