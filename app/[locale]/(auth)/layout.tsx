import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";
import { GithubIcon, Star } from "lucide-react";

import "@/app/[locale]/globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/app/[locale]/(routes)/components/Footer";
import getGithubRepoStars from "@/actions/github/get-repo-stars";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

type Props = {
  params: { locale: string };
};

async function getLocales(locale: string) {
  try {
    return (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({ params: { locale } }: Props) {
  const messages = await getLocales(locale);
  const t = createTranslator({ locale, messages });
  return {
    title: t("RootLayout.title"),
    description: t("RootLayout.description"),
  };
}

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  //Get github stars from github api
  // const githubStars = await getGithubRepoStars();

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <div className="flex justify-end items-center space-x-5 w-full p-5">
        <ThemeToggle />
      </div>
      <div className="flex items-center h-full overflow-hidden">{children}</div>
      <Footer />
    </div>
  );
};

export default AuthLayout;