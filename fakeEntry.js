const firstnames = require("./firstnames.json");
const surnames = require("./surnames.json");
const axios = require("axios");
const prompt = require("prompt");

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

const addEntry = async (score) => {
  let entry = {
    adidasid: makeid(8),
    name: firstnames[Math.floor(Math.random() * firstnames.length)],
    surname: surnames[Math.floor(Math.random() * surnames.length)],
    game1: score,
    game2: score,
    game3: score,
    wristid: makeid(8),
  };
  console.log(entry);
  let host = "http://10.0.0.50";

  await axios.post(
    `${host}/registerid.php?adidasid=${entry.adidasid}&name=${entry.name}&surname=${entry.surname}&wristid=${entry.wristid}`
  );
  await axios.post(
    `${host}/addscore.php?wristid=${entry.wristid}&game=1&score=${entry.game1}`
  );
  await axios.post(
    `${host}/addscore.php?wristid=${entry.wristid}&game=2&score=${entry.game2}`
  );
  await axios.post(
    `${host}/addscore.php?wristid=${entry.wristid}&game=3&score=${entry.game3}`
  );
  await axios.post(`${host}/finishid.php?wristid=${entry.wristid}`);
};

const run = async () => {
  let { score } = await prompt.get(["score"]);
  addEntry(score);
  run();
};
run();
