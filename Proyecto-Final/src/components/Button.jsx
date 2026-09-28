import { Link } from "react-router-dom";

function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}) {
  const classes = `button button-${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;