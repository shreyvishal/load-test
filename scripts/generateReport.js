const fs = require("fs");

// Read the JSON results from the file
const rawData = fs.readFileSync("results.json", "utf8");
const lines = rawData
  .split("\n")
  .filter((line) => line.trim() !== "")
  .map(JSON.parse);

const metrics = {
  http_reqs: { count: 0 },
  http_req_duration: { values: { percentiles: {} } },
  http_req_blocked: { values: { percentiles: {} } },
  http_req_connecting: { values: { percentiles: {} } },
  http_req_tls_handshaking: { values: { percentiles: {} } },
  http_req_sending: { values: { percentiles: {} } },
  http_req_waiting: { values: { percentiles: {} } },
  http_req_receiving: { values: { percentiles: {} } },
  http_req_failed: { count: 0 },
  checks: { count: 0 },
  vus: { value: 0 },
  vus_max: { value: 0 },
  data_sent: { count: 0 },
  data_received: { count: 0 },
  iteration_duration: { values: { percentiles: {} } },
  iterations: { count: 0 }
};

// Process each line and aggregate the metrics
lines.forEach((line) => {
  if (line.type === "Point") {
    const metric = line.metric;
    if (metrics[metric]) {
      metrics[metric].count =
        (metrics[metric].count || 0) + (line.data.value || 0);
      if (line.data.tags) {
        if (
          line.data.tags.expected_response === "true" &&
          metric === "http_req_duration"
        ) {
          metrics[metric].values.percentiles["0.99"] = line.data.value;
        }
        if (metric === "vus" || metric === "vus_max") {
          metrics[metric].value = line.data.value;
        }
      }
    }
  }
});

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>k6 Load Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>k6 Load Test Report</h1>
  <h2>Summary</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Iterations</td><td>${metrics.iterations.count}</td></tr>
    <tr><td>Iteration Duration (99th Percentile)</td><td>${
      metrics.iteration_duration.values.percentiles["0.99"] || "N/A"
    } ms</td></tr>
    <tr><td>Requests</td><td>${metrics.http_reqs.count}</td></tr>
    <tr><td>Failed Requests</td><td>${metrics.http_req_failed.count}</td></tr>
    <tr><td>Virtual Users</td><td>${metrics.vus.value}</td></tr>
    <tr><td>Max Virtual Users</td><td>${metrics.vus_max.value}</td></tr>
  </table>
  <h2>Details</h2>
  <pre>${JSON.stringify(metrics, null, 2)}</pre>
</body>
</html>`;

// Write the HTML content to a file
fs.writeFileSync("report.html", htmlContent);
console.log("HTML report generated as report.html");
