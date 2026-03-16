import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", () => {
  const url = process.env.API_URL;

  if (!url) {
    console.error("Cron Job Error: API_URL environment variable is not defined.");
    return;
  }

  console.log(`Cron Job Triggered: Sending request to ${url}`);

  https
    .get(url, (res) => {
      const { statusCode } = res;

      if (statusCode === 200) {
        console.log(`Cron Success: Server responded with status ${statusCode}`);
      } else {
        console.error(
          `Cron Warning: Server responded with unexpected status ${statusCode}`
        );
      }
    })
    .on("error", (error) => {
      console.error(
        `Cron Request Failed: Unable to reach ${url}. Error: ${error.message}`
      );
    });
});

export default job;