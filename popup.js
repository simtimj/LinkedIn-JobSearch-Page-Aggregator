// document.querySelector("h1");          // first <h1>
// document.querySelectorAll("")

// steps:
// 1. add button in popup.html
// 2. add event listener in popup.js
// 3. call content.js function on button click

// document.getElementsByClassName("job-details-jobs-unified-top-card__company-name")




// This function runs inside the webpage
function scrapePage() {
  let domain = window.location.href;
  let companyName;
  let positionName;
  let salaryRange;
  let location;
  let jobLink;



  if (domain.includes("linkedin")) {
    companyName = Array.from(document.getElementsByClassName("job-details-jobs-unified-top-card__company-name")).map(a => (a.innerText.trim()))[0];
    positionName = Array.from(document.getElementsByClassName("job-details-jobs-unified-top-card__job-title")).map(a => (a.innerText.trim()))[0];

    let jobDetailsFitLevelPrefs = Array.from(document.getElementsByClassName("job-details-fit-level-preferences")).map(a => (a.innerText.trim()).split("\n"));
    console.log("jobDetailsFitLevelPrefs:", jobDetailsFitLevelPrefs);

    salaryRange = jobDetailsFitLevelPrefs[0][0];
    location = jobDetailsFitLevelPrefs[0][2].slice(1);

    currTabUrl = window.location.href;
    let jobID = currTabUrl.split("currentJobId=")[1].split("&")[0];
    jobLink = `https://www.linkedin.com/jobs/view/${jobID}`;
  } else if (domain.includes("wellfound")) {
    // console.log("wellfound detected");

    companyName = document.getElementsByClassName("text-sm font-semibold text-black")[0].innerHTML;
    // console.log("companyName:", companyName);

    positionName = document.getElementsByClassName("inline text-xl font-semibold text-black")[0].innerHTML;
    // console.log("positionName:", positionName);

    salaryRange = document.getElementsByClassName("md:flex-none")[0].innerHTML;


    location = document.getElementsByClassName("font-normal text-black text-md")[0].innerHTML;
    // console.log("location:", location);

    jobLink = window.location.href;
    // console.log("jobLink:", jobLink);
  }

  let allData = {
    companyName,
    positionName,
    salaryRange,
    location,
    jobLink
  }

  console.log("allData:", allData);

  return allData;
}




document.getElementById("submit").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: scrapePage,
    },
    (results) => {
      const output = results[0].result;
      document.getElementById("output").textContent = JSON.stringify(output, null, 2);
      try {
        // sendDataToSheets(output);
        chrome.runtime.sendMessage(
          { type: "SEND_PAYLOAD", payload: { output } },
          response => {
            console.log("Background replied:", response);
          }
        );
        console.log("Sent data to background.js successfully");
      } catch (error) {
        console.error("Error sending data to Google Sheets:", error);
      }
    }
  );
});

