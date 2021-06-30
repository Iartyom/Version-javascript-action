const constants = require('./constants');

function commit_message_to_step(message) {
  const results = message.toString().match(constants.STEP_REGEX);
  console.log(JSON.stringify(message, null, 2));
  console.log(JSON.stringify(results, null, 2));

  var step = null;
  if (results && results.length > 1) {
    console.log(JSON.stringify(results[1], null, 2));
    if (results[1] == "PATCH") {
      return "PATCH";
    } else if (results[1] == "MINOR") {
      return "MINOR";
    } else if (results[1] == "MAJOR") {
      return "MAJOR";
    }
  }
  console.log(JSON.stringify(step, null, 2));
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
  console.log(`response=${ JSON.stringify(response, null, 2) }`);

  if (response.status == 200) {
    compare = response.data;
  }

  console.log(`compare=${ JSON.stringify(compare, null, 2) }`);
  return compare;
}

function generateChangeLog(relevant_pull_requests_set, version, date) {
  console.log(`version=${ version }, date=${ date }`);
  console.log(`relevant_pull_requests_set=${ JSON.stringify([...relevant_pull_requests_set], null, 2) }`);

  var change_log = "";

  change_log = `${ change_log }Version ${ version } - date ${ date }\n`;

  for (const relevant_pull_request_string of relevant_pull_requests_set.values()) {
    const relevant_pull_request = JSON.parse(relevant_pull_request_string).parsed_pull_request
    console.log(`relevant_pull_request=${ JSON.stringify(relevant_pull_request, null, 2) }`);

    relevant_pull_request.descriptions.forEach(description => {
      change_log = `${ change_log }\t * ${ description.type }: ${ description.description }`;
    });

    relevant_pull_request.mondays.forEach(monday => {
      change_log = `${ change_log }(${ monday })`;
    });

    change_log = `${ change_log }\n`;
  }

  console.log(`change_log=${ JSON.stringify(change_log, null, 2) }`);
  
  return change_log;
}

function getFormattedDate() {
  let date_time_format = new Intl.DateTimeFormat('en-US');
  let date = date_time_format.format();
  console.log(date);
  return date;
}

function nextVersion(major, minor, patch, step = null) {
  const prev_version = `v${ major }.${ minor }.${ patch }`;

  console.log(`major=${ major }, minor=${ minor }, patch=${ patch }`);
  console.log(`prev_version=${ prev_version }`);

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

async function updateMonday(relevant_pull_requests_set, version) {
  console.log(`version=${ version }`);
  console.log(`relevant_pull_requests_set=${ JSON.stringify([...relevant_pull_requests_set], null, 2) }`);

  for (const relevant_pull_request_string of relevant_pull_requests_set.values()) {
    const relevant_pull_request = JSON.parse(relevant_pull_request_string).parsed_pull_request
    console.log(`relevant_pull_request=${ JSON.stringify(relevant_pull_request, null, 2) }`);

    relevant_pull_request.mondays.forEach(monday => {
      console.log(`monday=${ JSON.stringify(monday, null, 2) }`);
      
      const parsed_monday_url = new URL(monday);
      const monday_board = parsed_monday_url.searchParams.get("board");
      const monday_item = parsed_monday_url.searchParams.get("item");

      if (monday_board != null && monday_item != null) {
        console.log(`monday_board=${ JSON.stringify(monday_board, null, 2) }`);
        console.log(`monday_item=${ JSON.stringify(monday_item, null, 2) }`);

        const BoardItemColumns = monday_api_wrapper.postBoardItemColumnsQuery(monday_token, board_id, item_id);
        console.log(`BoardItemColumns=${ JSON.stringify(BoardItemColumns, null, 2) }`);
        const column_found = BoardItemColumns.find(column => column.title == column_title);
        console.log(`column_found=${ JSON.stringify(column_found, null, 2) }`);
        const column_id = column_found.id;
        monday_api_wrapper.postBoardItemColumnValuesQuery(monday_token, board_id, item_id, column_id);
        monday_api_wrapper.postChangeColumnValueMutationQuery(monday_token, board_id, item_id, column_id, `\\\"${ version }\\\"`);
        const column_value = monday_api_wrapper.postBoardItemColumnValuesQuery(monday_token, board_id, item_id, column_id);
        console.log(`column_value=${ JSON.stringify(column_value, null, 2) }`);
        console.log(`column_value.value=${ column_value.value }`);
        expect(column_value.value).toBe(`\"${ version }\"`);
      }
    });
  }
}

module.exports = {
  commit_message_to_step,
  compareCommits,
  generateChangeLog,
  getFormattedDate,
  nextVersion,
  updateMonday
}