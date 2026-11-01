import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE } from "../../../utils/constants";
import { isAxiosError } from "axios";
import { registerRequest } from "../services/authService";

function getErrorMessage(err: unknown) {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (err.response?.status === 422) return "Data yang diisi tidak valid";
  }
  return "Terjadi kesalahan, coba lagi";
}

const RegisterForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mismatch = confirmPassword.length > 0 && password != confirmPassword;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
    }

    if (password != confirmPassword) {
      setError("Konfirmasi password tidak sama");
    }

    setLoading(true);
    try {
      await registerRequest({ name: nama, username, password });
      const user = await login(username, password);
      navigate(HOME_BY_ROLE[user.role], { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex flex-col gap-4">
      <section>
        <small className="text-(--color-primary) font-bold">
          JADI BAGIAN DARI CERITA
        </small>
        <h2>Buat akunmu</h2>
        <p>Mulai membaca, berdiskusi, dan berbagi cerita</p>
      </section>
      <section>
        <form className="field" onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap"
            name="nama"
            type="text"
            placeholder="Masukkan Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />

          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Masukkan Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={showPassword ? Eye : EyeOff}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
            required
          />

          <Input
            label="Konfirmasi Password"
            name="confirm_password"
            type={showPassword ? "text" : "password"}
            placeholder="Ulangi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightIcon={showPassword ? Eye : EyeOff}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
            error={mismatch ? "Password tidak sama" : undefined}
            required
          />

          {error && <p className="field-error">{error}</p>}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={mismatch}
            leftIcon={<ArrowRight size={20} />}
          >
            Register
          </Button>
        </form>
      </section>
      <p className="text-center">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-bold">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
