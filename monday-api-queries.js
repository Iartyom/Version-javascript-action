function getColumnFieldsQuery(boardID) {
  console.log(`boardID=${ boardID }`);

  const columnFieldsQuery = ` \
    query { \
      boards (ids: ${ boardID }) { \
        columns { \
          title \
          type \
        } \
      } \
    }`;
  
  console.log(`columnFieldsQuery=${ columnFieldsQuery }`);
  return columnFieldsQuery;
}

function getBoardItemsQuery(boardID) {
  console.log(`itemID=${ boardID }`);
  
  const itemsOfBoardQuery = ` \
  query { \
    boards (ids: ${ boardID }) { \
      items { \
        id \
        name \
      } \
    } \
  }`;
  
  console.log(`itemsOfBoardQuery=${ itemsOfBoardQuery }`);
  return itemsOfBoardQuery;
}

function getBoardItemColumnsQuery(boardID, itemID) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }`);
  
  const boardItemColumnsQuery = ` \
  query { \
    boards (ids: ${ boardID }) { \
      items (ids: ${ itemID }) { \
        id \
        name \
        column_values { \
          id \
          title \
          value \
        } \
      } \
    } \
  }`;
  
  console.log(`boardItemColumnsQuery=${ boardItemColumnsQuery }`);
  return boardItemColumnsQuery;
}

function getBoardItemColumnValuesQuery(boardID, itemID, columnID) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }, columnID=${ columnID }`);
  
  const boardItemColumnValuesQuery = ` \
  query { \
    boards (ids: ${ boardID }) { \
      items (ids: ${ itemID }) { \
        column_values (ids: ${ columnID }) { \
          id \
          title \
          value \
        } \
      } \
    } \
  }`;
  
  console.log(`boardItemColumnValuesQuery=${ boardItemColumnValuesQuery }`);
  return boardItemColumnValuesQuery;
}

function getCreateOrGetTagMutationQuery(tagName) {
  console.log(`tagName=${ tagName }`);
  const createOrGetTagMutationQuery = ` \
    mutation { \
      createOrGetTag (tagName: \"${ tagName }\") { \
        id \
      } \
    } \
  `;
  
  console.log(`createOrGetTagMutationQuery=${ createOrGetTagMutationQuery }`);
  return createOrGetTagMutationQuery;
}

function getChangeColumnValueMutationQuery(boardID, itemID, columnID, value) {
  console.log(`boardID=${ boardID }, itemID=${ itemID }, columnID=${ columnID }, value=${ value }`);
  const changeColumnValueMutationQuery = `\
    mutation {\
      changeColumnValue (boardID: ${ boardID }, itemID: ${ itemID }, columnID: \"${ columnID }\", value: \"${ value }\") { \
        id \
      } \
    } \
  `;
  
  console.log(`changeColumnValueMutationQuery=${ changeColumnValueMutationQuery }`);
  return changeColumnValueMutationQuery;
}

module.exports = {
  getColumnFieldsQuery,
  getBoardItemsQuery,
  getBoardItemColumnsQuery,
  getBoardItemColumnValuesQuery,
  getCreateOrGetTagMutationQuery,
  getChangeColumnValueMutationQuery
}