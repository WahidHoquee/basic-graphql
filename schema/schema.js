const graphql = require('graphql');
const axios = require('axios')
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

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString},
    lastName: { type: GraphQLString},
    age: { type: GraphQLInt}
  }
})

const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString},
    description: { type: GraphQLInt}
  }
})

const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: {
    // We dont need resolve for name, runs because graphql auto match the key with the key of json data
    // If it doesnt match then we have to do resolve. Example Country . There is no props named country in the JSON data
    jerseyNo: { type: GraphQLString },
    name: { type: GraphQLString},
    runs: { type: GraphQLInt},
    country: {
      type: CountryType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/countries/${parentValue.countryId}`)
      }
    }
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
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/players/${args.id}`)
          .then(res => res.data)
      }
    },
    country: {
      type: CountryType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/countries/${args.id}`)
          .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})