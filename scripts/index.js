import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { generateUUID } from "./generateUUID.js";
export const options = {
  scenarios: {
    contacts: {
      executor: "per-vu-iterations",
      vus: 200,
      iterations: 50,
      maxDuration: "20m"
    }
  }
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
        transaction_id: generateUUID(),
        message_id: generateUUID(),
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
      if (JSON.parse(r.body).responses) {
        console.log(`Success:${JSON.parse(r.body).responses.length > 0}`);
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data)
  };
}
