import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type UserAvatarProps = {
    image: string
    name: string
    size?: 'default' | 'sm' | 'lg'
}

const UserAvatar = ({ image, name, size = 'default' }: UserAvatarProps) => {
    return (
        <Avatar
            size={size}
        >
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-indigo-400 text-white text-xl font-semibold">{name.charAt(0)}</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar