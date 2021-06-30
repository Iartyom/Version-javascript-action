const constants = require('./constants')

function parsePullRequestBody(pull_request_body) {
  console.log(`pull_request_body=${ pull_request_body }`);

  const result = {
    descriptions: [],
    mondays: []
  };

  pull_request_body = pull_request_body.replace(constants.COMMENT_REGEX, "");
  console.log(`pull_request_body=${ JSON.stringify(pull_request_body, null, 2) }`);

  const description_lines_after_regex = constants.PR_DESCRIPTION_LINES_REGEX.exec(pull_request_body);

  if (description_lines_after_regex != null && description_lines_after_regex.length != null) {
    for (let description_lines_index = 0; 
      description_lines_index < description_lines_after_regex.length;
      description_lines_index+=3) {
      const type = description_lines_after_regex[description_lines_index + 1];
      const description = description_lines_after_regex[description_lines_index + 2];

      console.log(`type=${ JSON.stringify(type, null, 2) }`);
      console.log(`description=${ JSON.stringify(description, null, 2) }`);

      result.descriptions.push(
        {
          type: type,
          description: description
        });
    }

    const monday_links = pull_request_body.match(constants.PR_MONDAY_LINKS_REGEX);
    console.log(`monday_links=${ JSON.stringify(monday_links, null, 2) }`);
    if (monday_links!=null) {
      for (const monday_link of monday_links) {
        console.log(`monday_link=${ JSON.stringify(monday_link, null, 2) }`);
        result.mondays.push(monday_link);
      }
    }
  } else {
    return null;
  }

  console.log(`result=${ JSON.stringify(result, null, 2) }`);
  return result;
}

function parseVersion(version) {
  const results = version.match(constants.VERSION_REGEX);
  if (results!=null) {
    const version = results[0];
    console.log(`results=${ JSON.stringify(results, null, 2) }`);
    console.log(`version=${ version }`);
    const major = parseInt(results[1]);
    const minor = parseInt(results[2]);
    const patch = parseInt(results[3]);

    console.log(`major=${ major }, minor=${ minor }, patch=${ patch }`);
    return [version, major, minor, patch];
  }
  return null;
}

function parseVersionFromTag(tag) {
  const tag_name = tag.name.toString();

  return parseVersion(tag_name);
}

module.exports = {
  parsePullRequestBody,
  parseVersion,
  parseVersionFromTag
}