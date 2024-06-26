import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { dsepJobsTest } from "./dsepJobs.js";
import { dsepMentoringTest } from "./dsepMentoring.js";
import { dsepScholarshipsTest } from "./dsepScholarships.js";
import { retailTest } from "./retail.js";

export const options = {
  scenarios: {
    scenario_dsep_jobs: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
      maxDuration: "20m",
      exec: "scenario_dsep_jobs"
    },
    scenario_dsep_scholarships: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
      maxDuration: "20m",
      exec: "scenario_dsep_scholarships"
    },
    scenario_dsep_mentoring: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
      exec: "scenario_dsep_mentoring",
      maxDuration: "20m"
    },
    scenario_retail: {
      executor: "per-vu-iterations",
      vus: 1,
      exec: "scenario_retail",
      iterations: 1,
      maxDuration: "20m"
    }
  }
};

export function scenario_dsep_jobs() {
  dsepJobsTest();
  sleep(0);
}

export function scenario_dsep_scholarships() {
  dsepScholarshipsTest();
  sleep(0);
}

export function scenario_dsep_mentoring() {
  dsepMentoringTest();
  sleep(0);
}

export function scenario_retail() {
  retailTest();
  sleep(0);
}

export default function () {
  scenario_dsep_jobs();
  scenario_mentoring_jobs();
  scenario_dsep_scholarships();
  scenario_retail();
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data)
  };
}
