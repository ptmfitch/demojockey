exports = function({query, headers, body}, response) {

    console.log(body.text())

    const reqBody = JSON.parse(body.text());
    
    console.log(reqBody)

    context.services.get("mongodb-atlas").db("demo-jockey").collection("telemetry").insertOne(reqBody);

};
