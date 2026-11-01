import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE } from "../../../utils/constants";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);
      navigate(HOME_BY_ROLE[user.role], { replace: true });
    } catch {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex flex-col gap-4">
      <section>
        <small className="text-(--color-primary) font-bold">
          SELAMAT DATANG KEMBALI
        </small>
        <h2>Masuk ke NewsHub</h2>
        <p>Cerita terbaru dari komunitasmu menanti.</p>
      </section>
      <section>
        <form className="field" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Masukkan username"
            value={username}
            rightIcon={User}
            onChange={(e) => setUsername(e.target.value)}
          ></Input>

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={showPassword ? Eye : EyeOff}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
          ></Input>

          {error && <p className="field-error">{error}</p>}

          <Button type="submit" fullWidth size="lg" loading={loading} leftIcon={<ArrowRight size={20} />}>
            Log in
          </Button>
        </form>
      </section>
      <p className="text-center">
        Belum punya akun? <Link to="/register" className="font-bold">Daftar / Register</Link>
      </p>
    </div>
  );
};

export default LoginForm;
