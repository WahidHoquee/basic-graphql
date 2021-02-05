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


const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString},
    description: { type: GraphQLString},
    user: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => {
            return res.data
          })
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue.companyId)
        return axios
            .get(`http://localhost:3000/companies/${parentValue.companyId}`)
            .then(resp => resp.data)
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
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})