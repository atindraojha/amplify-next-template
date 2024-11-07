import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'my_storage',
  access: (allow) => ({
    'storage_files/*': [
      allow.authenticated.to(['read','write','delete']),
      allow.guest.to(['read', 'write'])
    ],
  })
});