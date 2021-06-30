function getColumnFieldsQuery(board_id) {
  console.log(`board_id=${ board_id }`);

  const column_fields_query = ` \
    query { \
      boards (ids: ${ board_id }) { \
        columns { \
          title \
          type \
        } \
      } \
    }`;
  
  console.log(`column_fields_query=${ column_fields_query }`);
  return column_fields_query;
}

function getBoardItemsQuery(board_id) {
  console.log(`item_id=${ board_id }`);
  
  const items_of_board_query = ` \
  query { \
    boards (ids: ${ board_id }) { \
      items { \
        id \
        name \
      } \
    } \
  }`;
  
  console.log(`items_of_board_query=${ items_of_board_query }`);
  return items_of_board_query;
}

function getBoardItemColumnsQuery(board_id, item_id) {
  console.log(`board_id=${ board_id }, item_id=${ item_id }`);
  
  const board_item_columns_query = ` \
  query { \
    boards (ids: ${ board_id }) { \
      items (ids: ${ item_id }) { \
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
  
  console.log(`board_item_columns_query=${ board_item_columns_query }`);
  return board_item_columns_query;
}

function getBoardItemColumnValuesQuery(board_id, item_id, column_id) {
  console.log(`board_id=${ board_id }, item_id=${ item_id }, column_id=${ column_id }`);
  
  const board_item_column_values_query = ` \
  query { \
    boards (ids: ${ board_id }) { \
      items (ids: ${ item_id }) { \
        column_values (ids: ${ column_id }) { \
          id \
          title \
          value \
        } \
      } \
    } \
  }`;
  
  console.log(`board_item_column_values_query=${ board_item_column_values_query }`);
  return board_item_column_values_query;
}

function getCreateOrGetTagMutationQuery(tag_name) {
  console.log(`tag_name=${ tag_name }`);
  const create_or_get_tag_mutation_query = ` \
    mutation { \
      create_or_get_tag (tag_name: \"${ tag_name }\") { \
        id \
      } \
    } \
  `;
  
  console.log(`create_or_get_tag_mutation_query=${ create_or_get_tag_mutation_query }`);
  return create_or_get_tag_mutation_query;
}

function getChangeColumnValueMutationQuery(board_id, item_id, column_id, value) {
  console.log(`board_id=${ board_id }, item_id=${ item_id }, column_id=${ column_id }, value=${ value }`);
  const change_column_value_mutation_query = `\
    mutation {\
      change_column_value (board_id: ${ board_id }, item_id: ${ item_id }, column_id: \"${ column_id }\", value: \"${ value }\") { \
        id \
        title \
        value \
      } \
    } \
  `;
  
  console.log(`change_column_value_mutation_query=${ change_column_value_mutation_query }`);
  return change_column_value_mutation_query;
}

module.exports = {
  getColumnFieldsQuery,
  getBoardItemsQuery,
  getBoardItemColumnsQuery,
  getBoardItemColumnValuesQuery,
  getCreateOrGetTagMutationQuery,
  getChangeColumnValueMutationQuery
}