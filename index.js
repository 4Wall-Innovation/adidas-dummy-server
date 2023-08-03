const express = require("express");
const fs = require("fs");
const firstnames = require("./firstnames.json");
const surnames = require("./surnames.json");

const app = express();
app.use(express.json());

const port = 5000;

const makeid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const updateEntries = (entries) => {
  //Add new entries
  let newEntryCount = Math.floor(Math.random() * 10);
  for (let index = 0; index < newEntryCount; index++) {
    let newEntry = {
      id: makeid(8),
      name: firstnames[Math.floor(Math.random() * firstnames.length)],
      surname: surnames[Math.floor(Math.random() * surnames.length)],
      game1: "",
      game2: "",
      game3: "",
      total: 0,
      timestamp: Date.now(),
    };
    entries.push(newEntry);
  }
  console.log(`Added ${newEntryCount} new entries`);

  //Add game times
  let updateCount = 0;
  let newCompletedCount = 0;

  for (let entry of entries) {
    if (!entry.total && Math.random() < 0.7) {
      updateCount++;
      if (entry.game1 == "")
        entry.game1 = Math.floor(Math.random() * 200 * 1000);
      else if (entry.game2 == "")
        entry.game2 = Math.floor(Math.random() * 200 * 1000);
      else if (entry.game3 == "") {
        entry.game3 = Math.floor(Math.random() * 200 * 1000);
        entry.total = Math.floor(
          1000000 / entry.game1 + 1000000 / entry.game2 + 1000000 / entry.game3
        );
        newCompletedCount++;
      }
      entry.timestamp = Date.now();
    }
  }
  console.log(`Updated ${updateCount} entries`);
  console.log(`New completed users count: ${newCompletedCount}`);

  let newEntries = entries;

  let data = JSON.stringify(newEntries);
  fs.writeFileSync("entries.json", data);
  return newEntries;
};

const getEntries = () => {
  let rawdata = fs.readFileSync("entries.json");
  return JSON.parse(rawdata);
};

const createEntryXML = (entries) => {
  let xml = "<xml>";
  for (let entry of entries) {
    xml += `<entry>`;
    for (let [key, value] of Object.entries(entry)) {
      xml += `<${key}>${value}</${key}>`;
    }
    xml += `</entry>`;
  }
  xml += "</xml>";
  return xml;
};

app.get("/", (req, res) => {
  let entries = getEntries();
  entries = updateEntries(entries);
  let xml = createEntryXML(entries);
  res.send(xml);
});

app.put("/", (req, res) => {
  console.log("RECEIVED PUT", req.body);
  let entries = getEntries();
  console.log(entries);

  let newEntry = req.body;
  let foundEntryIndex = entries.findIndex(
    (findEntry) => findEntry.id == newEntry.id
  );

  if (newEntry.id && foundEntryIndex != -1) {
    entries[foundEntryIndex] = newEntry;
  } else {
    if (!newEntry.id) newEntry.id = makeid(8);
    entries.push(newEntry);
  }

  let data = JSON.stringify(entries);
  fs.writeFileSync("entries.json", data);
  return res.send();
});

app.listen(port, () => {
  console.log(`Dummy server listening on port ${port}`);
});
