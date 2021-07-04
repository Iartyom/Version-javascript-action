const constants = require('./constants');

const lodash = require('lodash');


function commitMessageToStep(message) {
  const results = message.toString().match(constants.STEP_REGEX);
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(results));

  var step = null;
  if (results && results.length > 1) {
    console.log(JSON.stringify(results[1]));
    if (results[1] == "PATCH") {
      return "PATCH";
    } else if (results[1] == "MINOR") {
      return "MINOR";
    } else if (results[1] == "MAJOR") {
      return "MAJOR";
    }
  }
  console.log(JSON.stringify(step));
  return step;
}

async function compareCommits(octokit, owner, repo, base, head) {
  console.log(`owner=${ owner }, repo=${ repo }, base=${ base }, head=${ head }`);

  var compare = null;
  
  const response = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base,
    head
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    compare = response.data;
  }

  console.log(`compare=${ JSON.stringify(compare) }`);
  return compare;
}

function generateChangeLog(relevantPullRequestsSet, version, date) {
  console.log(`version=${ version }, date=${ date }`);
  console.log(`relevantPullRequestsSet=${ JSON.stringify([...relevantPullRequestsSet]) }`);

  var changeLog = "";

  changeLog = `${ changeLog }Version ${ version } - date ${ date }\n`;
  
  lodash.forEach(relevantPullRequestsSet.values(), (relevantPullRequestString) => {
    const relevantPullRequest = JSON.parse(relevantPullRequestString).parsedPullRequest
    console.log(`relevantPullRequest=${ JSON.stringify(relevantPullRequest) }`);

    relevantPullRequest.descriptions.forEach(description => {
      changeLog = `${ changeLog }\t * ${ description.type }: ${ description.description }`;
    });

    relevantPullRequest.mondays.forEach(monday => {
      changeLog = `${ changeLog }(${ monday })`;
    });

    changeLog = `${ changeLog }\n`;
  });

  console.log(`changeLog=${ JSON.stringify(changeLog) }`);
  
  return changeLog;
}

function getFormattedDate() {
  let dateTimeFormat = new Intl.DateTimeFormat('en-US');
  let date = dateTimeFormat.format();
  console.log(date);
  return date;
}

function nextVersion(major, minor, patch, step = null) {
  const prevVersion = `v${ major }.${ minor }.${ patch }`;

  console.log(`major=${ major }, minor=${ minor }, patch=${ patch }`);
  console.log(`prevVersion=${ prevVersion }`);

  switch(step) {
    case "MINOR":
      minor += 1;
      patch = 1;
      break;
    case "MAJOR":
      major += 1;
      patch = 1;
      break;
    default:
      patch += 1;   
  }

  const nextVersion = `v${ major }.${ minor }.${ patch }`;

  console.log(`major=${ major }, minor=${ minor }, patch=${ patch }`);
  console.log(`nextVersion=${ nextVersion }`);

  return nextVersion;
}

async function updateMonday(relevantPullRequestsSet, version) {
  console.log(`version=${ version }`);
  console.log(`relevantPullRequestsSet=${ JSON.stringify([...relevantPullRequestsSet]) }`);

  lodash.forEach(relevantPullRequestsSet.values(), (relevantPullRequestString) => {
    const relevantPullRequest = JSON.parse(relevantPullRequestString).parsedPullRequest
    console.log(`relevantPullRequest=${ JSON.stringify(relevantPullRequest) }`);

    relevantPullRequest.mondays.forEach(monday => {
      console.log(`monday=${ JSON.stringify(monday) }`);
      
      const parsedMondayURL = new URL(monday);
      const mondayBoard = parsedMondayURL.searchParams.get("board");
      const mondayItem = parsedMondayURL.searchParams.get("item");

      if (mondayBoard != null && mondayItem != null) {
        console.log(`mondayBoard=${ JSON.stringify(mondayBoard) }`);
        console.log(`mondayItem=${ JSON.stringify(mondayItem) }`);

        const BoardItemColumns = mondayApiWrapper.postBoardItemColumnsQuery(mondayToken, boardID, itemID);
        console.log(`BoardItemColumns=${ JSON.stringify(BoardItemColumns) }`);
        const columnFound = BoardItemColumns.find(column => column.title == columnTitle);
        console.log(`columnFound=${ JSON.stringify(columnFound) }`);
        const columnID = columnFound.id;
        mondayApiWrapper.postBoardItemColumnValuesQuery(mondayToken, boardID, itemID, columnID);
        mondayApiWrapper.postChangeColumnValueMutationQuery(mondayToken, boardID, itemID, columnID, `\\\"${ version }\\\"`);
        const columnValue = mondayApiWrapper.postBoardItemColumnValuesQuery(mondayToken, boardID, itemID, columnID);
        console.log(`columnValue=${ JSON.stringify(columnValue) }`);
        console.log(`columnValue.value=${ columnValue.value }`);
        expect(columnValue.value).toBe(`\"${ version }\"`);
      }
    });
  });
}

module.exports = {
  commitMessageToStep,
  compareCommits,
  generateChangeLog,
  getFormattedDate,
  nextVersion,
  updateMonday
}