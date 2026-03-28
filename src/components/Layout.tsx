import { ReactNode } from "react";
import VaaniNav from "./VaaniNav";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <VaaniNav />
      <main className="pt-16 md:pt-16">{children}</main>
    </div>
  );
};

export default Layout;
