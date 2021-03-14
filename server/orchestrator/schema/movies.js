const { gql } = require('apollo-server')
const axios = require('axios')
const Redis = require('ioredis')
const redis = new Redis({ connectTimeout: 60000 })

module.exports = {
  typeDefs: gql`
  type movie {
    id: ID,
    title: String,
    overview: String,
    poster_path: String,
    popularity: Float,
    tags: [String]
  }
  input {
    title: String,
    overview: String,
    poster_path: String,
    popularity: Float,
    tags: [String]
  }
  type Query {
    findById({id: id}): movie
  }
  type Mutation {
    createMovie(input): movie,
    updateMovie(input, {id:id}): movie,
    deleteMovie({id: id}): String
  }
  `,
  resolvers: {
    Query: {},
    Mutations: {
      async createMovie(parent, args, context, info) {
        try {
          await redis.del('movies/series:data')
          const { data } = await axios.post('http://localhost:4001/movies', args.input)

          return data
        } catch ({ message }) {
          return message
        }
      },
      async findById(parent, args, context, info) {
        try {
          await redis.del('movies/series:data')
          const { data } = await axios.get(`http://localhost:4001/movies/${args.id}`)

          return data
        } catch ({ message }) {
          return message
        }
      },
      async updateMovie(parent, args, context, info) {
        try {
          await redis.del('movies/series:data')

          const { data } = await axios.put(`http://localhost:4001/movies/${id}`, args.input)

          return data
        } catch ({ message }) {
          return message
        }
      },
      async deleteMovie(parent, args, context, info) {
        try {
          await redis.del('movies/series:data')

          const { data } = await axios.delete(`http://localhost:4001/movies/${id}`)
          const output = 'Movies deleted successfully'
          return output
        } catch ({message}) {
          return message
        }
      }
    }
  }
}