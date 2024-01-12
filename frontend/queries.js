/* eslint-disable */
// this is an auto generated file. This will be overwritten
import {gql} from '@apollo/client'

export const getTodo =  gql`
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      todos
      payments
      groupMembers {
        id
        status
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = gql`
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        todos
        payments
        groupMembers
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
