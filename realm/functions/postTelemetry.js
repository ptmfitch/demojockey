exports = function({ query, headers, body}, response) {

    const reqBody = JSON.parse(body.text());

    context.services.get("dev-sandbox").db("demo-jockey").collection("telemetry").insertOne(reqBody);

};
