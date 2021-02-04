const graphql = require('graphql');
const _ = require('lodash')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
} = graphql

const users = [
  {id: '23', firstName: 'Bill', lastName:'Alex', age: 20},
  {id: '47', firstName: 'Duo', lastName:'Lipa', age: 34},
]

const players = [
  {jerseyNo: '75', name: 'Shakib Al Hasan', runs: 6592},
  {jerseyNo: '02', name: 'Tamim Iqbal', runs: 7815},
]

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString},
    lastName: { type: GraphQLString},
    age: { type: GraphQLInt}
  }
})

const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: {
    jerseyNo: { type: GraphQLString },
    name: { type: GraphQLString},
    runs: { type: GraphQLInt}
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id })
      }
    },
    player: {
      type: PlayerType,
      // args: { jerseyNo: { type: GraphQLString } },
      resolve(parentValue, args) {
        return players;
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})