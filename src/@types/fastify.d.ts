import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    userId: string
  }
}
