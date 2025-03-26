const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var xml;
let parkNS = "http://www.example.org/PFRMapData";

async function loadXml() {
  if (xml == undefined) {
    let response = await fetch(
      "http://localhost:8888/facilities-data.xml",
      {
        method: "get",
        headers: {
          "Content-Type": "application/xml"
        }
      }
    );
    //convert XML string to XML DOM document
    data = new JSDOM(
      await response.text(), 
      { contentType: "application/xml" }
    );
    console.log(data);
    xml = data.window.document; //set the xml to the XML DOM document which we can query using DOM methods
  }
  return xml;
}
async function loadParks() {
  xml = await loadXml(); //retrieve the XML DOM document so we can query it
  return xml.querySelectorAll("Location");

}
async function getParkById(id) {
  xml = await loadXml(); //XML DOM document
  xpath = `//Location[LocationID/text()='${id}']`;
  let results = xml.evaluate(
    xpath,
    xml,
    parkNS,
    4, //4 is the UNORDERED_NODE_ITERATOR_TYPE
    null //no existing XPathResult object so return a new one
  );
  return results.iterateNext(); //only one result expected, so we can just do this
  //If multiple results expected, use results.iterateNext() in a while loop.
}

module.exports = {
  loadParks,
  getParkById
};