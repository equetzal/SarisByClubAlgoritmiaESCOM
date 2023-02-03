import React, { useState } from "react";
import Scoreboard from "./Scoreboard";
import { getContestDataWithRawData } from "../parsers/raw/raw-json-parser";
import { getContestDataWithCodeforcesAPI } from "../parsers/codeforces/codeforces-api-parser";
import "./WelcomeForm.css";

let contestData = {};

const RawDataForm = ({ setStep }) => {
  const [rawDataValue, setRawDataValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(rawDataValue);
    setStep("loading");
    try {
      contestData = await getContestDataWithRawData(rawDataValue);
      setStep("resolver");
    } catch (error) {
      alert(error);
      setStep("form");
    }
    return false;
  };

  return (
    <div>
      <form className="all-forms" onSubmit={handleSubmit}>
        <p>
          <label>Please, paste your JSON data object:</label>
        </p>
        <textarea
          className="form-raw-data-json-box"
          id="rawContestDataJSON"
          name="rawContestDataJSON"
          rows="4"
          cols="50"
          value={rawDataValue}
          onChange={(e) => {
            setRawDataValue(e.target.value);
          }}
        />
        <br />
        <p>
          <label>
            To format the raw JSON object, follow{" "}
            <a href="https://github.com/equetzal/SarisResolver/blob/main/public/example.json">
              this
            </a>{" "}
            example.
          </label>
        </p>
        <input type="submit" value="Start Dancing" />
      </form>
    </div>
  );
};

const CodeforcesForm = ({ setStep }) => {
  const [contestId, setContestId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [frozenTime, setFrozenTime] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      `contestId: ${contestId}, groupId: ${groupId}, apiKey: ${apiKey}, apiSecret: ${apiSecret}`
    );
    setStep("loading");
    try {
      contestData = await getContestDataWithCodeforcesAPI(
        frozenTime,
        contestId,
        groupId,
        apiKey,
        apiSecret
      );
      console.log(contestData);
      setStep("resolver");
    } catch (error) {
      alert(error.message);
      setStep("form");
    }
    return false;
  };

  return (
    <div>
      <form className="all-forms" onSubmit={(e) => handleSubmit(e)}>
        <label>Frozen Time (duration in minutes):</label>
        <input
          type="number"
          name="cf_frozen_time"
          required
          onChange={(e) => setFrozenTime(parseInt(e.target.value))}
        />

        <label>Contest ID:</label>
        <input
          type="text"
          name="cf_contest_id"
          required
          onChange={(e) => setContestId(e.target.value)}
        />

        <label>Group ID:</label>
        <input
          type="text"
          name="cf_group_id"
          required
          onChange={(e) => setGroupId(e.target.value)}
        />

        <label>API Key:</label>
        <input
          type="text"
          name="cf_api_key"
          required
          onChange={(e) => setApiKey(e.target.value)}
        />

        <label>API Secret:</label>
        <input
          type="text"
          name="cf_api_secret"
          required
          onChange={(e) => setApiSecret(e.target.value)}
        />

        <br />
        <input type="submit" value="Start Dancing" />
      </form>
    </div>
  );
};

const getForm = (dataSource, setStep) => {
  switch (dataSource) {
    case "raw":
      return <RawDataForm setStep={setStep} />;
    case "codeforces":
      return <CodeforcesForm setStep={setStep} />;
    default:
      return <p>No Option Selected</p>;
  }
};

const WelcomeForm = () => {
  const [step, setStep] = useState("form");
  const [dataSource, setDataSource] = useState("raw");
  return (
    <div className="saris-box">
      {step === "form" && (
        <div className="data-source-selector-box">
          <h1 className="saris-title">Saris Resolver</h1>
          <p className="saris-description">
            Saris resolver an ICPC-like standing resolver to be used to reveal
            what happens on the frozen time of a competition. You can check the
            source code of this project on{" "}
            <a href="https://github.com/equetzal/SarisResolver">github</a>.
            IOI-like contest (partial scoring) is not supported yet.
          </p>
          <hr height="1px" width="50%" />
          <div>
            <label className="text-white">Select a data source:</label>
            <select
              id="data-source"
              onChange={(event) => {
                setDataSource(event.target.value);
              }}
            >
              <option value="raw">Raw JSON data</option>
              <option value="codeforces">Codeforces API</option>
            </select>
          </div>
          <div className="text-white">{getForm(dataSource, setStep)}</div>
        </div>
      )}
      {step === "loading" && <span>...</span>}
      {step === "resolver" && <Scoreboard submissionsData={contestData} />}
    </div>
  );
};

export default WelcomeForm;
