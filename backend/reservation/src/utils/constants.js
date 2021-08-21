export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  NURSE: 'nurse',
}

export const RABBIT_QUEUE = {
  exchange: {
    name: 'anle',
  },
  routingKey: 'reservation',
  queue: {
    name: 'reservation',
  }
}