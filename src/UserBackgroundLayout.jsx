const UserBackgroundLayout = ({ children }) => {
    return (
      <div className="user-app-background">
        <div className="user-app-content">
          {children}
        </div>
      </div>
    );
  };
  
  export default UserBackgroundLayout;