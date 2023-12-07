import React, { useState } from "react";
import { getContestDataWithCodeforcesAPI } from "../../parsers/codeforces/codeforces-api-parser";
import { ContestData } from "../../types/contestDataTypes";

const CodeforcesForm = ({
  setContestData,
  setStep,
}: {
  setContestData: (contestData: ContestData) => void;
  setStep: (step: string) => void;
}) => {
  const [contestId, setContestId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [frozenTime, setFrozenTime] = useState(60);

  const handleSubmit = async event => {
    event.preventDefault();
    setStep("loading");
    try {
      setContestData(
        await getContestDataWithCodeforcesAPI({
          frozenTime,
          contestId,
          isPrivate,
          groupId,
          apiKey,
          apiSecret,
        })
      );
      setStep("resolver");
    } catch (error) {
      alert(error.message);
      setStep("form");
    }
    return false;
  };

  return (
    <form className="form-box" onSubmit={e => handleSubmit(e)}>
      <fieldset className="form-field">
        <label>Frozen Time (duration in minutes):</label>
        <input
          type="number"
          name="cf_frozen_time"
          required
          onChange={e => setFrozenTime(parseInt(e.target.value))}
        />
      </fieldset>

      <fieldset className="form-field">
        <label>Contest ID:</label>
        <input
          type="text"
          name="cf_contest_id"
          required
          onChange={e => setContestId(e.target.value)}
        />
      </fieldset>

      <fieldset className="form-field form-switch">
        <label>Is Private Contest? </label>
        <label className="switch">
          <input type="checkbox" onChange={e => setIsPrivate(e.target.checked)} />
          <span className="slider round"></span>
        </label>
      </fieldset>

      {isPrivate && (
        <fieldset className="form-field">
          <label>Group ID:</label>
          <input
            type="text"
            name="cf_group_id"
            required
            onChange={e => setGroupId(e.target.value)}
          />
        </fieldset>
      )}

      {isPrivate && (
        <fieldset className="form-field">
          <label>API Key:</label>
          <input type="text" name="cf_api_key" required onChange={e => setApiKey(e.target.value)} />
        </fieldset>
      )}

      {isPrivate && (
        <fieldset className="form-field">
          <label>API Secret:</label>
          <input
            type="text"
            name="cf_api_secret"
            required
            onChange={e => setApiSecret(e.target.value)}
          />
        </fieldset>
      )}

      <fieldset className="form-field">
        <input type="submit" value="Start Dancing" />
      </fieldset>
    </form>
  );
};

export default CodeforcesForm;
