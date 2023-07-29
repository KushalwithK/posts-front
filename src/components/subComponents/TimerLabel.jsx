import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { styled } from "styled-components";
import { API_SINGLETON } from "../../extras/Constant";
import { AppContext } from "../../AppContext";
import { useContext } from "react";

const TimerLabel = ({ currentTimerInfo }) => {
  const { decryptPassword } = useContext(AppContext);
  const [thisTimerInfo, setThisTimerInfo] = useState(currentTimerInfo);
  const [transformedTime, setTransformedTime] = useState(
    calculateTimeDuration(thisTimerInfo.timeElapsed)
  );
  const intervalRef = useRef();

  function calculateTimeDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      throw new Error("Invalid input. Seconds must be a non-negative number.");
    }

    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const timeDuration = {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };

    return timeDuration;
    // return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  useEffect(() => {
    setTransformedTime(calculateTimeDuration(thisTimerInfo.timeElapsed));
  }, [thisTimerInfo]);

  const storeTimeSpent = (timeElapsed) => {
    const formData = new FormData();
    formData.append("username", localStorage.getItem("username"));
    formData.append(
      "password",
      decryptPassword(localStorage.getItem("password"))
    );
    formData.append("time", timeElapsed);
    API_SINGLETON.post(`/todos/${currentTimerInfo.todo}/spendTime`, formData);
  };

  const handleTimerStart = () => {
    if (!thisTimerInfo.start) {
      setThisTimerInfo((old) => {
        return {
          ...old,
          start: true,
        };
      });
      intervalRef.current = setInterval(() => {
        setThisTimerInfo((old) => {
          return {
            ...old,
            timeElapsed: old.timeElapsed + 1,
          };
        });
      }, 1000);
    }
  };

  const handleTimerStop = () => {
    if (thisTimerInfo.start) {
      setThisTimerInfo((old) => {
        return {
          ...old,
          start: false,
        };
      });
      clearInterval(intervalRef.current);
      storeTimeSpent(thisTimerInfo.timeElapsed);
    }
  };

  useEffect(() => {
    console.log(currentTimerInfo);
  }, []);

  return (
    <Main>
      {!thisTimerInfo.start ? (
        <span className="controls" onClick={handleTimerStart}>
          <AiFillPlayCircle color="green" size={25} />
        </span>
      ) : (
        <span className="controls" onClick={handleTimerStop}>
          <AiFillPauseCircle color="red" size={25} />
        </span>
      )}

      <p>{`${transformedTime.days > 0 ? transformedTime.days + "d" : ""} ${
        transformedTime.hours > 0 ? transformedTime.hours + "h" : ""
      } ${transformedTime.minutes > 0 ? transformedTime.minutes + "m" : ""} ${
        transformedTime.seconds
      }s`}</p>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .controls {
    cursor: pointer;
  }
`;

export default TimerLabel;
