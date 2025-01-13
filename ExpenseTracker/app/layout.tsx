import { ReactNode } from "react";
import { Metadata } from "next";
import Logo from "./[locale]/assets/logo.jpg";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Expense Tracker",
  description:
    "Expense tracker is a tool designed to help track financial transactions",
  authors: [
    { name: "Abdulelah Abacar" },
  ],
  icons: [{ rel: "icon", url: Logo.src }],
};
export default function RootLayout({ children }: Props) {
  return <html>
    <body>
      {children}
    </body>
  </html>;
}
