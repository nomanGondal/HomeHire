const RoleCard = ({ icon: Icon, title, description, buttonText, onClick }) => {
  return (
    <div className="role-card">
      <div className="role-card-icon">
        <Icon size={22} />
      </div>
      <h3 className="role-card-title">{title}</h3>
      <p className="role-card-desc">{description}</p>
      <button className="role-card-btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default RoleCard;