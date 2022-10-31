exports = function({query, headers, body}, response) {

    console.log(body.text())

    const reqBody = JSON.parse(body.text());
    
    console.log(reqBody)

    context.services.get("mongodb-atlas").db("demojockey").collection("events").insertOne(reqBody);

};
