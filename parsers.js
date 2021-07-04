const constants = require('./constants')

function parsePullRequestBody(pullRequest_body) {
  console.log(`pullRequest_body=${ pullRequest_body }`);

  const result = {
    descriptions: [],
    mondays: []
  };

  pullRequest_body = pullRequest_body.replace(constants.COMMENT_REGEX, "");
  console.log(`pullRequest_body=${ JSON.stringify(pullRequest_body) }`);

  const descriptionLines_afterRegex = constants.PR_DESCRIPTION_LINES_REGEX.exec(pullRequest_body);

  if (descriptionLines_afterRegex != null && descriptionLines_afterRegex.length != null) {
    for (let descriptionLines_index = 0; 
      descriptionLines_index < descriptionLines_afterRegex.length;
      descriptionLines_index+=3) {
      const type = descriptionLines_afterRegex[descriptionLines_index + 1];
      const description = descriptionLines_afterRegex[descriptionLines_index + 2];

      console.log(`type=${ JSON.stringify(type) }`);
      console.log(`description=${ JSON.stringify(description) }`);

      result.descriptions.push(
        {
          type: type,
          description: description
        });
    }

    const mondayLinks = pullRequest_body.match(constants.PR_MONDAY_LINKS_REGEX);
    console.log(`mondayLinks=${ JSON.stringify(mondayLinks) }`);
    if (mondayLinks!=null) {
      for (const mondayLink of mondayLinks) {
        console.log(`mondayLink=${ JSON.stringify(mondayLink) }`);
        result.mondays.push(mondayLink);
      }
    }
  } else {
    return null;
  }

  console.log(`result=${ JSON.stringify(result) }`);
  return result;
}

function parseVersion(version) {
  const results = version.match(constants.VERSION_REGEX);
  if (results!=null) {
    const version = results[0];
    console.log(`results=${ JSON.stringify(results) }`);
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
  const tagName = tag.name.toString();

  return parseVersion(tagName);
}

module.exports = {
  parsePullRequestBody,
  parseVersion,
  parseVersionFromTag
}