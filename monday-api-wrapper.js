const mondayApiQueries = require("./monday-api-queries");
const fetch = require("node-fetch");


async function postBoardItemColumnsQuery(token, boardID, itemID) {
  console.log(`boardID=${ boardID }`);

  const query = mondayApiQueries.getBoardItemColumnsQuery(boardID, itemID);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);

  var columnValues = null;
  if (data != null && data != undefined) {
    columnValues = data.boards[0].items[0].column_values;
  }
  console.log(`columnValues=${ JSON.stringify(columnValues) }`);
  
  return columnValues;
}

async function postBoardItemColumnValuesQuery(token, boardID, itemID, columnID) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }, columnID=${ columnID }`);

  const query = mondayApiQueries.getBoardItemColumnValuesQuery(boardID, itemID, columnID);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);

  var columnValues = null;
  if (data != null && data != undefined) {
    columnValues = data.boards[0].items[0].columnValues[0];
  }
  console.log(`columnValues=${ JSON.stringify(columnValues) }`);
  
  return columnValues;
}

async function postBoardItemsQuery(token, boardID) {
  console.log(`boardID=${ boardID }`);

  const query = mondayApiQueries.getBoardItemsQuery(boardID);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);

  var boardItems = null;
  if (data != null && data != undefined) {
    boardItems = data.boards[0].items;
  }
  console.log(`boardItems=${ JSON.stringify(boardItems) }`);
  
  return boardItems;
}

async function postChangeColumnValueMutationQuery(token, boardID, itemID, columnID, value) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }, columnID=${ columnID }, value=${ value }`);

  const query = mondayApiQueries.getChangeColumnValueMutationQuery(boardID, itemID, columnID, value);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);

  var id = null;
  if (data != null && data != undefined) {
    id = data.changeColumnValue;
  }
  console.log(`id=${ JSON.stringify(id) }`);
  
  return id;
}

async function postColumnFieldsQuery(token, boardID) {
  console.log(`boardID=${ boardID }`);

  const query = mondayApiQueries.getColumnFieldsQuery(boardID);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);

  var boardColumns = null;
  if (data != null && data != undefined) {
    boardColumns = data.boards[0].columns;
  }
  console.log(`boardColumns=${ JSON.stringify(boardColumns) }`);
  
  return boardColumns;
}

async function postColumnValuesQuery(token, boardID) {
  console.log(`boardID=${ boardID }`);

  const query = mondayApiQueries.getColumnValuesQuery(boardID);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);
}

async function postCreateOrGetTagMutationQuery(token, tagName) {
  console.log(`tagName=${ tagName }`);

  const query = mondayApiQueries.getCreateOrGetTagMutationQuery(tagName);
  console.log(`query=${ query }`);

  const data = await postQuery(token, query);
  console.log(`data=${ JSON.stringify(data) }`);

  var tagID = null;
  if (data != null && data != undefined) {
    tagID = data.createOrGetTag.id;
  }
  console.log(`tagID=${ tagID }`);
  
  return tagID;
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
  console.log(`response=${ JSON.stringify(response) }`);
  
  if (response.data != null) {
    data = response.data;
  }
  console.log(`data=${ JSON.stringify(data) }`);
  
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