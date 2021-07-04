const constants = require('./constants');

const lodash = require('lodash');


function parsePullRequestBody(pullRequestBody) {
  console.log(`pullRequestBody=${ pullRequestBody }`);

  const result = {
    descriptions: [],
    mondays: []
  };

  pullRequestBody = pullRequestBody.replace(constants.COMMENT_REGEX, "");
  console.log(`pullRequestBody=${ JSON.stringify(pullRequestBody) }`);

  const descriptionLinesAfterRegex = constants.PR_DESCRIPTION_LINES_REGEX.exec(pullRequestBody);

  if (descriptionLinesAfterRegex != null && descriptionLinesAfterRegex.length != null) {
    for (let descriptionLinesIndex = 0; 
      descriptionLinesIndex < descriptionLinesAfterRegex.length;
      descriptionLinesIndex+=3) {
      const type = descriptionLinesAfterRegex[descriptionLinesIndex + 1];
      const description = descriptionLinesAfterRegex[descriptionLinesIndex + 2];

      console.log(`type=${ JSON.stringify(type) }`);
      console.log(`description=${ JSON.stringify(description) }`);

      result.descriptions.push(
        {
          type: type,
          description: description
        });
    }

    const mondayLinks = pullRequestBody.match(constants.PR_MONDAY_LINKS_REGEX);
    console.log(`mondayLinks=${ JSON.stringify(mondayLinks) }`);
    if (mondayLinks!=null) {
      lodash.forEach(mondayLinks, (mondayLink) => {
        console.log(`mondayLink=${ JSON.stringify(mondayLink) }`);
        result.mondays.push(mondayLink);
      });
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