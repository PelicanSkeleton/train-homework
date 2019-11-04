




//Reference variable for database
var database = firebase.database();

// Variables for the onClick event
var name;
var destination;
var firstTrain;
var frequency = 0;

$("#add-train").on("click", function () {
    event.preventDefault();
    // Storing and retreiving new train data
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    // Pushing to database
    database.ref().set({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("form")[0].reset();
});


database.ref().on("value", function (snapshot) {
    console.log(snapshot)
    var nextArr;
    var minAway;
    // Chang year so first train comes before now
    var firstTrainNew = moment(snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    // Difference between the current and firstTrain
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % snapshot.val().frequency;
    // Minutes until next train
    var minAway = snapshot.val().frequency - remainder;
    // Next train time
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append("<tr><td>" + snapshot.val().name +
        "</td><td>" + snapshot.val().destination +
        "</td><td>" + snapshot.val().frequency +
        "</td><td>" + nextTrain +
        "</td><td>" + minAway + "</td></tr>");

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


