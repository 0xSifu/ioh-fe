"use server";

import dayjs from "dayjs";
import axios from "axios";

import { prismadb } from "@/lib/prisma";
import resendHelper from "@/lib/resend";
import AiTasksReportEmail from "@/emails/AiTasksReport";

export async function getUserAiTasks(session: any) {
  /*
  Resend.com function init - this is a helper function that will be used to send emails
  */
  const resend = await resendHelper();

  const today = dayjs().startOf("day");
  const nextWeek = dayjs().add(7, "day").startOf("day");

  let prompt = "";

  const user = await prismadb.users.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return { message: "No user found" };

  const getTaskPastDue = await prismadb.tasks.findMany({
    where: {
      AND: [
        {
          id: session.user.id,
          taskStatus: "ACTIVE",
          dueDateAt: {
            lte: new Date(),
          },
        },
      ],
    },
  });

  const getTaskPastDueInSevenDays = await prismadb.tasks.findMany({
    where: {
      AND: [
        {
          user: session.user.is,
          taskStatus: "ACTIVE",
          dueDateAt: {
            //lte: dayjs().add(7, "day").toDate(),
            gt: today.toDate(), // Due date is greater than or equal to today
            lt: nextWeek.toDate(), // Due date is less than next week (not including today)
          },
        },
      ],
    },
  });

  if (!getTaskPastDue || !getTaskPastDueInSevenDays) {
    return { message: "No tasks found" };
  }

  switch (user.userLanguage) {
    case "en":
      prompt = `Hi, Iam ${process.env.NEXT_PUBLIC_APP_URL} API Bot.
      \n\n
      There are ${getTaskPastDue.length} tasks past due and ${
        getTaskPastDueInSevenDays.length
      } tasks due in the next 7 days.
      \n\n
      Details today tasks: ${JSON.stringify(getTaskPastDue, null, 2)}
      \n\n
      Details next 7 days tasks: ${JSON.stringify(
        getTaskPastDueInSevenDays,
        null,
        2
      )}
      \n\n
      As a personal assistant, write a message  to remind tasks and write detail summary. And also do not forget to send them a some positive vibes.
      \n\n
      Final result must be in MDX format.
      `;
      break;
    case "de":
      prompt = `Als professionelle Assistentin ist Emma mit perfekten Kenntnissen im Projektmanagement für die Projekte vor Ort verantwortlich${
        process.env.NEXT_PUBLIC_APP_URL
      }, Erstellen Sie eine Managementzusammenfassung der Aufgaben, einschließlich ihrer Details und Fristen. Alles muss perfekt tschechisch und prägnant sein.
      \n\n
      Hier finden Sie Informationen zu den Aufgaben:
      \n\n
      Projektinformationen: Anzahl der heute zu lösenden Aufgaben: ${
        getTaskPastDue.length
      }, Die Anzahl der Aufgaben, die innerhalb von spätestens sieben Tagen gelöst werden müssen: ${
        getTaskPastDueInSevenDays.length
      }.
      \n\n
      Detaillierte Informationen im JSON-Format für Aufgaben, die heute erledigt werden müssen: ${JSON.stringify(
        getTaskPastDue,
        null,
        2
      )}
      \n\n
      Detaillierte Informationen zu Aufgaben, die innerhalb der nächsten sieben Tage erledigt werden müssen: ${JSON.stringify(
        getTaskPastDueInSevenDays,
        null,
        2
      )}
    
      \n\n
      Schreiben Sie am Ende eine Managementzusammenfassung und fügen Sie einen Link hinzu ${
        process.env.NEXT_PUBLIC_APP_URL + "/projects/dashboard"
      } als Link zum Aufgabendetail. Am Ende der Zusammenfassung hinzufügen. 1 Management-Skill-Tipp im Bereich Projektmanagement und Zeitmanagement, 2-3 Sätze mit positiver Einstellung und Unterstützung, abschließend einen schönen Arbeitstag wünschen und mitteilen, dass diese Nachricht durch die künstliche Intelligenz von OpenAi generiert wurde.
      \n\n
      Das Endergebnis muss im MDX-Format vorliegen.
      `;
      break;
  }

  if (!prompt) return { message: "No prompt found" };

  const getAiResponse = await axios
    .post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/openai/create-chat-completion`,
      {
        prompt: prompt,
        userId: session.user.id,        
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data);

  //console.log(getAiResponse, "getAiResponse");
  //console.log(getAiResponse.response.message.content, "getAiResponse");  

  //skip if api response is error
  if (getAiResponse.error) {
    console.log("Error from OpenAI API");
  } else {
    try {
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email!,
        subject: `${process.env.NEXT_PUBLIC_APP_NAME} OpenAI Project manager assistant from: ${process.env.NEXT_PUBLIC_APP_URL}`,
        text: getAiResponse.response.message.content,
        react: AiTasksReportEmail({
          username: session.user.name,
          avatar: session.user.avatar,
          userLanguage: session.user.userLanguage,
          data: getAiResponse.response.message.content,
        }),
      });
      //console.log(data, "Email sent");
    } catch (error) {
      console.log(error, "Error from get-user-ai-tasks");
    }
  }

  return { user: user.email };
}