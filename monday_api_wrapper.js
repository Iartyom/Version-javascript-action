const monday_api_queries = require("./monday_api_queries");
const fetch = require("node-fetch");


async function postBoardItemColumnsQuery(token, board_id, item_id) {
  console.log(`board_id=${ board_id }`);

  const query = monday_api_queries.getBoardItemColumnsQuery(board_id, item_id);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);

  var column_values = null;
  if (data != null && data != undefined) {
    column_values = data.boards[0].items[0].column_values;
  }
  console.log(`column_values=${ JSON.stringify(column_values, null, 2) }`);
  
  return column_values;
}

async function postBoardItemColumnValuesQuery(token, board_id, item_id, column_id) {
  console.log(`board_id=${ board_id }, item_id=${ item_id }, column_id=${ column_id }`);

  const query = monday_api_queries.getBoardItemColumnValuesQuery(board_id, item_id, column_id);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);

  var column_values = null;
  if (data != null && data != undefined) {
    column_values = data.boards[0].items[0].column_values[0];
  }
  console.log(`column_values=${ JSON.stringify(column_values, null, 2) }`);
  
  return column_values;
}

async function postBoardItemsQuery(token, board_id) {
  console.log(`board_id=${ board_id }`);

  const query = monday_api_queries.getBoardItemsQuery(board_id);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);

  var board_items = null;
  if (data != null && data != undefined) {
    board_items = data.boards[0].items;
  }
  console.log(`board_items=${ JSON.stringify(board_items, null, 2) }`);
  
  return board_items;
}

async function postChangeColumnValueMutationQuery(token, board_id, item_id, column_id, value) {
  console.log(`board_id=${ board_id }, item_id=${ item_id }, column_id=${ column_id }, value=${ value }`);

  const query = monday_api_queries.getChangeColumnValueMutationQuery(board_id, item_id, column_id, value);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);

  var id = null;
  if (data != null && data != undefined) {
    id = data.change_column_value;
  }
  console.log(`id=${ JSON.stringify(id, null, 2) }`);
  
  return id;
}

async function postColumnFieldsQuery(token, board_id) {
  console.log(`board_id=${ board_id }`);

  const query = monday_api_queries.getColumnFieldsQuery(board_id);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);

  var board_columns = null;
  if (data != null && data != undefined) {
    board_columns = data.boards[0].columns;
  }
  console.log(`board_columns=${ JSON.stringify(board_columns) }`);
  
  return board_columns;
}

async function postColumnValuesQuery(token, board_id) {
  console.log(`board_id=${ board_id }`);

  const query = monday_api_queries.getColumnValuesQuery(board_id);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);
}

async function postCreateOrGetTagMutationQuery(token, tag_name) {
  console.log(`tag_name=${ tag_name }`);

  const query = monday_api_queries.getCreateOrGetTagMutationQuery(tag_name);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data, null, 2) }`);

  var tag_id = null;
  if (data != null && data != undefined) {
    tag_id = data.create_or_get_tag.id;
  }
  console.log(`tag_id=${ tag_id }`);
  
  return tag_id;
}

async function postQuery(token, query) {
  console.log(`query=${ query }`);
  var data = null;

  const response = await fetch("https://api.monday.com/v2",
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : token
      },
      body: JSON.stringify({ 
        'query' : query
      })
    })
    .then(response => {
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
  console.log(`body=${ JSON.stringify({ 'query' : query }) }`)
  console.log(`response=${ JSON.stringify(response, null, 2) }`);
  
  if (response.data != null) {
    data = response.data;
  }
  console.log(`data=${ JSON.stringify(data, null, 2) }`);
  
  return data;
}

module.exports = {
  postBoardItemColumnsQuery,
  postBoardItemColumnValuesQuery,
  postBoardItemsQuery,
  postChangeColumnValueMutationQuery,
  postColumnFieldsQuery,
  postColumnValuesQuery,
  postCreateOrGetTagMutationQuery
}