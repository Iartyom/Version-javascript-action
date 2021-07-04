const constants = require("./constants");
const mondayApiWrapper = require("./monday-api-wrapper");
const mondayConstants = require("./monday-constants");
const testConstants = require("./test-constants")
const tokens = require("../tokens/tokens");
const octokitApiWrapper = require("./octokit-api-wrapper");

const github = require('@actions/github');



const mondayToken = tokens.MONDAY_TOKEN;
const boardID = mondayConstants.TEST_BOARD_ID;
const itemID = mondayConstants.TEST_ITEM_ID;
const columnTitle = mondayConstants.TEST_COLUMN_TITLE;

console.log(`constants.REPOSITORY=${ constants.REPOSITORY }`);

const splittedRepository = constants.REPOSITORY.toString().split("/");
const OWNER = splittedRepository[0];
const REPO = splittedRepository[1];
console.log(`splittedRepository=${ JSON.stringify(splittedRepository) }`);
console.log(`OWNER=${ OWNER }`);
console.log(`REPO=${ REPO }`);

test('test mondayApiWrapper', async () => {
  // const firstVersionTagID = await mondayApiWrapper.postCreateOrGetTagMutationQuery(mondayToken, firstVersion);
  // await mondayApiWrapper.postColumnFieldsQuery(mondayToken, firstVersion);
  // await mondayApiWrapper.postBoardItemsQuery(mondayToken, boardID);

  const token = tokens.GITHUB_TOKEN;
  expect(token).toBeDefined();
  expect(token).toEqual(expect.not.stringMatching(testConstants.STRING_REGEX_OF_EMPTY_STRING));
  
  const octokit = github.getOctokit(token);
  expect(token).toBeDefined();

  const afterTags = await octokitApiWrapper.getTags(octokit, OWNER, REPO);
  afterTags.forEach(tag => {
    console.log(`tag.name=${ tag.name }`);
  });

  const filteredAfterTags = afterTags.filter(tag => {
    console.log(`tag=${ JSON.stringify(tag) }`);
    console.log(`tag.name=${ JSON.stringify(tag.name) }`);
    const tagAfterVersionRegexExec = constants.VERSION_REGEX.exec(tag.name);
    console.log(`tagAfterVersionRegexExec=${ JSON.stringify(tagAfterVersionRegexExec) }`);
    if (tagAfterVersionRegexExec != null && tagAfterVersionRegexExec.length != null) {
      return true;
    }
    return false;
  });
  console.log(`filteredAfterTags=${ JSON.stringify(filteredAfterTags) }`);


  const filteredAfterTagsArray = Array.from(filteredAfterTags);
  console.log(`filteredAfterTagsArray=${ JSON.stringify(filteredAfterTagsArray) }`);

  var latestsTag;
  if (filteredAfterTagsArray.length > 1) {
    latestsTag = filteredAfterTagsArray[0].name;
  } else {
    latestsTag = constants.INIT_VERSION;
  }
  console.log(`latestsTag=${ JSON.stringify(latestsTag) }`);

  const BoardItemColumns = await mondayApiWrapper.postBoardItemColumnsQuery(mondayToken, boardID, itemID);
  console.log(`BoardItemColumns=${ JSON.stringify(BoardItemColumns) }`);
  const columnFound = BoardItemColumns.find(column => column.title == columnTitle);
  console.log(`columnFound=${ JSON.stringify(columnFound) }`);
  const columnID = columnFound.id;
  await mondayApiWrapper.postBoardItemColumnValuesQuery(mondayToken, boardID, itemID, columnID);
  await mondayApiWrapper.postChangeColumnValueMutationQuery(mondayToken, boardID, itemID, columnID, `\\\"${ latestsTag }\\\"`);
  const columnValue = await mondayApiWrapper.postBoardItemColumnValuesQuery(mondayToken, boardID, itemID, columnID);
  console.log(`columnValue=${ JSON.stringify(columnValue) }`);
  console.log(`columnValue.value=${ columnValue.value }`);
  expect(columnValue.value).toBe(`\"${ latestsTag }\"`);
})
