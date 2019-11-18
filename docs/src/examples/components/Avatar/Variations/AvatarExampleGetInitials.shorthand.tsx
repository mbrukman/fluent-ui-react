import * as React from 'react'
import { Avatar } from '@stardust-ui/react'

const getInitials = name => name.split(' ').map(word => `${word[0]}.`)

const AvatarExampleGetInitialsShorthand = () => (
  <Avatar
    name="John Doe"
    getInitials={getInitials}
    status={{
      styles: { backgroundColor: 'green' },
      icon: 'stardust-checkmark',
      title: 'Available',
    }}
  />
)

export default AvatarExampleGetInitialsShorthand