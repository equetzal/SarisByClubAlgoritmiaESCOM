import { ContestData } from "../../types/contestDataTypes";
const verifyObject = contestData => {
  if (contestData == null) {
    throw new Error("contestData is null or undefined!");
  }

  if (contestData.contestName == null || typeof contestData.contestName !== "string") {
    throw new Error("contestData.contestName is not an string!");
  }
  if (
    contestData.freezeTimeMinutesFromStart == null ||
    typeof contestData.freezeTimeMinutesFromStart !== "number"
  ) {
    throw new Error("contestData.freezeTimeMinutesFromStart is not an number!");
  }
  if (!Array.isArray(contestData.problemLetters)) {
    throw new Error("contestData.problemLetters is not an array!");
  }
  if (!Array.isArray(contestData.contestants)) {
    throw new Error("contestData.contestants is not an array!");
  }
  if (!Array.isArray(contestData.runs)) {
    throw new Error("contestData.runs is not an array!");
  }

  contestData.problemLetters.forEach(letter => {
    if (typeof letter !== "string") {
      throw new Error(
        `contestData.problemLetters contains invalid data!\n${JSON.stringify(letter)}`
      );
    }
  });

  contestData.contestants.forEach(contestant => {
    if (typeof contestant !== "string") {
      throw new Error(
        `contestData.contestants contains invalid data!\n${JSON.stringify(contestant)}`
      );
    }
  });

  contestData.runs.forEach(run => {
    if (typeof run.contestant !== "string") {
      throw new Error(
        `contestData.runs contains invalid data!\ncontestant must be string${JSON.stringify(run)}`
      );
    }
    if (typeof run.problemLetter !== "string") {
      throw new Error(
        `contestData.runs contains invalid data!\nproblemLetter must be string${JSON.stringify(
          run
        )}`
      );
    }
    if (typeof run.timeMinutesFromStart !== "number") {
      throw new Error(
        `contestData.runs contains invalid data!\ntimeMinutesFromStart must be number${JSON.stringify(
          run
        )}`
      );
    }
    if (typeof run.success !== "boolean") {
      throw new Error(
        `contestData.runs contains invalid data!\nsuccess must be boolean${JSON.stringify(run)}`
      );
    }
  });
};

export const getContestDataWithSarisStandJSON = (rawText: string) => {
  const oldSarisData = JSON.parse(rawText);
  console.log("S4RiS StanD JSON, Input Object", oldSarisData);
  verifyObject(oldSarisData);
  return {
    contestMetadata: {
      duration: 300,
      frozenTimeDuration: 300 - oldSarisData.freezeTimeMinutesFromStart,
      name: oldSarisData.contestName,
      type: "ICPC",
      scoreMode: "absolute",
      penaltyPerSubmission: 20,
    },
    problems: oldSarisData.problemLetters.map(letter => {
      return { index: letter };
    }),
    contestants: oldSarisData.contestants.map((name, idx) => {
      return { id: idx, name };
    }),
    verdicts: {
      accepted: ["ACCEPTED"],
      partiallyAccepted: [],
      wrongAnswerWithPenalty: ["WRONG_ANSWER"],
      wrongAnswerWithoutPenalty: [],
    },
    submissions: oldSarisData.runs.map(run => {
      return {
        timeSubmitted: run.timeMinutesFromStart,
        contestantName: run.contestant,
        problemIndex: run.problemLetter,
        verdict: run.success ? "ACCEPTED" : "WRONG_ANSWER",
      };
    }),
  } as ContestData;
};
