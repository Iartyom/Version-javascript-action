function getColumnFieldsQuery(boardID) {
  console.log(`boardID=${ boardID }`);

  const columnFields_query = ` \
    query { \
      boards (ids: ${ boardID }) { \
        columns { \
          title \
          type \
        } \
      } \
    }`;
  
  console.log(`columnFields_query=${ columnFields_query }`);
  return columnFields_query;
}

function getBoardItemsQuery(boardID) {
  console.log(`itemID=${ boardID }`);
  
  const itemsOf_boardQuery = ` \
  query { \
    boards (ids: ${ boardID }) { \
      items { \
        id \
        name \
      } \
    } \
  }`;
  
  console.log(`itemsOf_boardQuery=${ itemsOf_boardQuery }`);
  return itemsOf_boardQuery;
}

function getBoardItemColumnsQuery(boardID, itemID) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }`);
  
  const boardItem_columnsQuery = ` \
  query { \
    boards (ids: ${ boardID }) { \
      items (ids: ${ itemID }) { \
        id \
        name \
        columnValues { \
          id \
          title \
          value \
        } \
      } \
    } \
  }`;
  
  console.log(`boardItem_columnsQuery=${ boardItem_columnsQuery }`);
  return boardItem_columnsQuery;
}

function getBoardItemColumnValuesQuery(boardID, itemID, columnID) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }, columnID=${ columnID }`);
  
  const boardItem_columnValuesQuery = ` \
  query { \
    boards (ids: ${ boardID }) { \
      items (ids: ${ itemID }) { \
        columnValues (ids: ${ columnID }) { \
          id \
          title \
          value \
        } \
      } \
    } \
  }`;
  
  console.log(`boardItem_columnValuesQuery=${ boardItem_columnValuesQuery }`);
  return boardItem_columnValuesQuery;
}

function getCreateOrGetTagMutationQuery(tagName) {
  console.log(`tagName=${ tagName }`);
  const createOr_getTag_mutationQuery = ` \
    mutation { \
      createOr_getTag (tagName: \"${ tagName }\") { \
        id \
      } \
    } \
  `;
  
  console.log(`createOr_getTag_mutationQuery=${ createOr_getTag_mutationQuery }`);
  return createOr_getTag_mutationQuery;
}

function getChangeColumnValueMutationQuery(boardID, itemID, columnID, value) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }, columnID=${ columnID }, value=${ value }`);
  const changeColumnValueMutation_query = `\
    mutation {\
      changeColumnValue (boardID: ${ boardID }, itemID: ${ itemID }, columnID: \"${ columnID }\", value: \"${ value }\") { \
        id \
      } \
    } \
  `;
  
  console.log(`changeColumnValueMutation_query=${ changeColumnValueMutation_query }`);
  return changeColumnValueMutation_query;
}

module.exports = {
  getColumnFieldsQuery,
  getBoardItemsQuery,
  getBoardItemColumnsQuery,
  getBoardItemColumnValuesQuery,
  getCreateOrGetTagMutationQuery,
  getChangeColumnValueMutationQuery
}