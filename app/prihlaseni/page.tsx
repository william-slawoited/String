import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/login-form";

export const instant = false;

export default function PrihlaseniPage() {
  return (
    <>
      <SiteHeader />
      <LoginForm />
    </>
  );
}
