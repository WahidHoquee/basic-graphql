// Before Mutation - Folder-04
const graphql = require('graphql');
const axios = require('axios')
const _ = require('lodash')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
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
  // Enclosing field property in a function because, players property in the field object is asking for PlayerType property which isn't declared yet. If we place PlayerType declaration before this codeblock, In the PlayerType there is also a circulat reference towards the CountryType. To solve this issue we are wrapping the object by methods. So that we can use the power of closure
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString},
    description: { type: GraphQLInt},
    //To fetch all the Players under each Country. As one Country can have multiple players we should have array like data type 
    players: {
      type: new GraphQLList(PlayerType), //List means array.
      resolve(parentValue, args){
        return axios
          .get(`http://localhost:3000/countries/${parentValue.id}/players`)
          .then(res => {
            console.log(res.data)
            console.log(`http://localhost:3000/countries/${parentValue.id}/players`)
            return res.data
          })
      }
    }
  })
})

const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    // We dont need resolve for name, runs because graphql auto match the key with the key of json data
    // If it doesnt match then we have to do resolve. Example Country . There is no props named country in the JSON data
    jerseyNo: { type: GraphQLString },
    firstName: { type: GraphQLString},
    runs: { type: GraphQLInt},
    country: {
      type: CountryType,
      resolve(parentValue, args) {
        //parentValue is a object consists of all the actual property that object(Player) has. We didnt declare countryId here but we can get access to it.
        return axios.get(`http://localhost:3000/countries/${parentValue.countryId}`)
      }
    }
  })
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