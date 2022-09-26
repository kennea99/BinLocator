const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

const convertDegreeToRad = (val) => {
  return val * Math.PI/180;
}
;
const getDistance =  async (feats, location) => {
  const earthRadius = 6371;
  const lat1 = convertDegreeToRad(location.latitude);
  const lon1 = convertDegreeToRad(location.longitude);
  const closeBins = [];
  feats.forEach((feat) => {
    //Adapted from GeeksForGeeks: https://www.geeksforgeeks.org/program-distance-two-points-earth/
    const lat2 = convertDegreeToRad(feat.geometry.coordinates[1]);
    const lon2 = convertDegreeToRad(feat.geometry.coordinates[0]);

    const degLat = lat2 - lat1;
    const degLon = lon2 - lon1;

    const a = Math.pow(Math.sin(degLat/2), 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.pow(Math.sin(degLon/2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));
    let d = c * earthRadius;
    d = d * 1000;// put in metres;
    if (d <= 100) {
      closeBins.push(feat);
    }
  });
  return closeBins;
};

exports.getClosestBins = functions.https.onCall(async(data, context) =>{
  let vals = null;
  let bins = null;
  await admin.database().ref(`Users/Username/${data.username}/position`)
      .once("value").then((snapshot) => {
        vals = snapshot.val();
      });
  await admin.database().ref("opendata/features").once("value").then((snapshot) => {
    bins = snapshot.val();
  });
  const closestBins = await getDistance(bins, vals);
  functions.logger.log("Data: ", closestBins);
  return closestBins;
});

