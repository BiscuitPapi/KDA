const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use("/", (req, res) => {
  res.json({ users: ["userOne", "userTwo"] });
  const { fileContent } = req.body;

  if (!fileContent) {
    console.log("File content is missing");
  }
});

app.get("/api/sorting", async (req, res) => {
  try {
    const fileContent = req.query;
    var rawData = JSON.parse(fileContent.fileContent);

    let proceedData = rawData.toString().split("\n");
    var i = 0;
    let obj = [];
    let list = [];
    var previousUser = "";

    while (i < proceedData.length) {
      //Check the user
      var currentUser = proceedData[i].split(" ")[0];
      var currentTextCount = wordsCount(
        proceedData[i].split(" ").slice(1).join(" ")
      );
      currentUser = currentUser.replace("<", "").replace(">", "");

      //Set the current user similar to the previous, and amend the current text
      if (!currentUser.includes("user")) {
        currentUser = previousUser;
        currentTextCount = wordsCount(proceedData[i]);
      }

      let jsonData = { user: currentUser, value: currentTextCount };
      list.push(jsonData);
      i++;
      previousUser = currentUser;
    }

    //Check for distinct user
    let userList = [];
    for (var key in list) {
      if (list.hasOwnProperty(key)) {
        if (!userList.includes(list[key].user)) {
          userList.push(list[key].user);
        }
      }
    }
    var counter = 0;
    let newList = [];

    //Total up the count for each user
    while (counter < userList.length) {
      var value = 0;

      for (var key in list) {
        if (list.hasOwnProperty(key)) {
          if (list[key].user == userList[counter]) {
            value = value + list[key].value;
          }
        }
      }
      let jsonData = { user: userList[counter], value: value };
      newList.push(jsonData);
      counter++;
    }

    //Sort the list in descending order
    newList = newList.sort((a, b) => {
      if (a.value > b.value) {
        return -1;
      }
    });

    let sortedList = [];
    var currentRank = 1;
    var previousVal = -1;
    for (var key in newList) {
      if (newList.hasOwnProperty(key)) {
        if (newList[key].value == previousVal) {
          let jsonData = {
            user: newList[key].user,
            value: newList[key].value,
            rank: "  ",
          };
          sortedList.push(jsonData);
        } else {
          let jsonData = {
            user: newList[key].user,
            value: newList[key].value,
            rank: currentRank + ".",
          };
          sortedList.push(jsonData);
          currentRank++;
        }
      }
      previousVal = newList[key].value;
    }

    res.send(sortedList);
  } catch (error) {
    console.log("Failed to upload file: ", error);
  }
});
app.listen(8000, console.log("Server is running on port 5001."));
