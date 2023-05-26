import mongoose from "mongoose";
import chalk from "chalk";

const dbConnector = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
    console.log(chalk.blueBright("[DATABASE] Connected to database"));
  } catch (err) {
    console.log(
      chalk.redBright("[DATABASE] Error when connecting to database")
    );
  }
};

export default dbConnector;
