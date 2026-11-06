import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "@/components/register-form";

export const instant = false;

export default function RegistracePage() {
  return (
    <>
      <SiteHeader />
      <RegisterForm />
    </>
  );
}
