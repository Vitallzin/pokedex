import React from 'react';
import { getDefaultAvatar, getImageFallbackHandler } from '../../../utils/avatar';
import './style.css';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User Avatar',
  size = 'md',
  showBorder = true,
}) => {
  const defaultAvatar = getDefaultAvatar(alt);
  
  return (
    <div className={`avatar-container avatar-${size} ${showBorder ? 'avatar-border' : ''}`}>
      <img 
        src={src || defaultAvatar} 
        alt={alt} 
        className="avatar-image" 
        referrerPolicy="no-referrer"
        onError={getImageFallbackHandler(defaultAvatar)}
      />
    </div>
  );
};
