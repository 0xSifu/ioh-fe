import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface VercelInviteUserEmailProps {
    username: string;
    invitedByUsername: string;
    invitedUserPassword: string;
    userLanguage: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  export const InviteUserEmail = ({
    username,
    invitedByUsername,
    invitedUserPassword,
    userLanguage,
  }: VercelInviteUserEmailProps) => {
    const previewText =
      userLanguage === "en"
        ? `You have been invited by ${invitedByUsername} to SaasHQ app`
        : `Sie wurden von einem Benutzer eingeladen ${invitedByUsername} zur Bewerbung SaasHQ`;
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-slate-300 rounded-md my-[40px] mx-auto p-[20px] w-[465px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                {userLanguage === "en"
                  ? "You have been invited to cooperate on something special"
                  : "Sie wurden eingeladen, an etwas Erstaunlichem mitzuarbeiten"}
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                {userLanguage === "en"
                  ? `Hello ${username},`
                  : `Hallo ${username},`}
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                <strong>{invitedByUsername}</strong>
                {/*   (
              <Link
                  href={`mailto:${invitedByEmail}`}
                  className="text-blue-600 no-underline"
                >
                  {invitedByEmail}
                </Link>   )*/}
                {userLanguage === "en"
                  ? ` has invited you to the`
                  : ` Er hat Sie zur Mitarbeit eingeladen`}
              </Text>
              <Text>
                <strong>{process.env.NEXT_PUBLIC_APP_NAME}</strong> app:
                <strong>{process.env.NEXT_PUBLIC_APP_URL}</strong>.
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                {userLanguage === "en"
                  ? `
                To accept this invitation, click the button below. And use this
                password to login: `
                  : `
                  Klicken Sie auf die Schaltfläche unten, um diese Einladung anzunehmen. Und verwenden Sie dieses Passwort, um sich anzumelden:
                `}
                <strong>{invitedUserPassword}</strong>
              </Text>
  
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-slate-800 rounded-md text-white  py-3 px-4 text-[12px] font-semibold no-underline text-center"
                  href={process.env.NEXT_PUBLIC_APP_URL}
                >
                  {userLanguage === "en" ? "Join the team" : "Verbinden"}
                </Button>
              </Section>
              <Text className="text-black text-[14px] leading-[24px]">
                {userLanguage === "en"
                  ? `
                or copy and paste this URL into your browser:`
                  : `     oder kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:`}{" "}
                <Link
                  href={process.env.NEXT_PUBLIC_APP_URL}
                  className="text-blue-600 no-underline"
                >
                  {process.env.NEXT_PUBLIC_APP_URL}
                </Link>
              </Text>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-slate-500 text-muted-foreground text-[12px] leading-[24px]">
                {userLanguage === "en"
                ? `This invitation was intended for `
                : `Diese Einladung richtete sich an `}
              <span className="text-black">{username}. </span>
                {userLanguage === "en"
                  ? "If you were not expecting this invitation, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us."
                  : "Wenn Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren. Wenn Sie Bedenken hinsichtlich der Sicherheit Ihres Kontos haben, antworten Sie bitte auf diese E-Mail, um mit uns in Kontakt zu treten."}
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export default InviteUserEmail;