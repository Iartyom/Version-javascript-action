const constants = require("./constants");
const monday_constants = require("./monday_constants");
const tokens = require("../tokens/tokens");
const monday_api_wrapper = require("./monday_api_wrapper");

const monday_token = tokens.MONDAY_TOKEN;
const first_version = constants.FIRST_VERSION;
const board_id = monday_constants.TEST_BOARD_ID;
const item_id = monday_constants.TEST_ITEM_ID;
const column_title = monday_constants.TEST_COLUMN_TITLE;


test('test monday_api_wrapper', async () => {
  // const first_version_tag_id = await monday_api_wrapper.postCreateOrGetTagMutationQuery(monday_token, first_version);
  // await monday_api_wrapper.postColumnFieldsQuery(monday_token, first_version);
  // await monday_api_wrapper.postBoardItemsQuery(monday_token, board_id);
  const BoardItemColumns = await monday_api_wrapper.postBoardItemColumnsQuery(monday_token, board_id, item_id);
  console.log(`BoardItemColumns=${ JSON.stringify(BoardItemColumns, null, 2) }`);
  const column_found = BoardItemColumns.find(column => column.title == column_title);
  console.log(`column_found=${ JSON.stringify(column_found, null, 2) }`);
  const column_id = column_found.id;
  await monday_api_wrapper.postBoardItemColumnValuesQuery(monday_token, board_id, item_id, column_id);
  await monday_api_wrapper.postChangeColumnValueMutationQuery(monday_token, board_id, item_id, column_id, `\\\"${ first_version }\\\"`);
  const column_value = await monday_api_wrapper.postBoardItemColumnValuesQuery(monday_token, board_id, item_id, column_id);
  console.log(`column_value=${ JSON.stringify(column_value, null, 2) }`);
  console.log(`column_value.value=${ column_value.value }`);
  expect(column_value.value).toBe(`\"${ first_version}\"`);
  
})
