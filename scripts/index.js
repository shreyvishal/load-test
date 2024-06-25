import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 1,
  // A string specifying the total duration of the test run.
  duration: "15s",
  iterations: 1

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // cloud: {
  //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //   // By default tests are executed in default project.
  //   projectID: "",
  //   // The name of the test in the k6 Cloud UI.
  //   // Test runs with the same name will be grouped.
  //   name: "script.js"
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function () {
  const res = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/select",
    JSON.stringify({
      context: {
        domain: "dsep:jobs",
        bpp_id: "bpp-ps-network-sandbox-vistaar.becknprotocol.io",
        bpp_uri: "http://bpp-ps-network-sandbox-vistaar.becknprotocol.io",
        bap_id: "bap-ps-network-vistaar.becknprotocol.io",
        action: "select",
        bap_uri: "https://bap-ps-network-vistaar.becknprotocol.io",
        version: "1.1.0",
        transaction_id: "429839c0-23f8-46c0-a0dd-8efecc85d0ac",
        message_id: "4e674703-1f0b-4d5f-b9f6-507ecf9584d0",
        location: {
          country: {
            name: "India",
            code: "IND"
          },
          city: {
            name: "Bangalore",
            code: "std:080"
          }
        },
        ttl: "PT10M",
        timestamp: "2024-06-17T08:44:36.418Z"
      },
      message: {
        order: {
          provider: {
            id: "13"
          },
          items: [
            {
              id: "6"
            }
          ]
        }
      }
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(res, {
    "success call": (r) => {
      console.log(r);
      return JSON.parse(r.body).responses.length > 0;
    }
  });
  sleep(1);
}
