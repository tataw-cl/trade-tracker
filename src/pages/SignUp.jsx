import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (user) navigate("/landing");
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signUp(email, password);
      navigate("/landing");
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="page-container signup-page">
      <main className="page-main">
        <h2>Create account</h2>
        <form onSubmit={onSubmit} className="form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Create account
          </button>
        </form>
        {error && <div className="form-error">{error}</div>}
        <div style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </main>
    </div>
  );
}
